from concurrent.futures import ThreadPoolExecutor
import asyncio
import aiohttp
from typing import Dict, List
import numpy as np
from .cache import Cache
from .embeddings import EmbeddingGenerator
import logging
import os
from openai import OpenAI
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Initialize OpenAI client
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# logging.basicConfig(level=logging.INFO)

class IssueMatcher:
    def __init__(self):
        self.cache = Cache()
        self.embedding_generator = EmbeddingGenerator()
        self.max_workers = 5
        self.semaphore = asyncio.Semaphore(10)  # Limit concurrent requests

    async def download_file_content(self, session, file):
        if not file.get('download_url'):
            logging.warning(f"Skipping file without URL: {file.get('path', 'Unknown')}")
            return None
        try:
            async with self.semaphore:  # Prevent excessive concurrent requests
                async with session.get(file['download_url'], timeout=5) as response:
                    if response.status == 200:
                        content = await response.text()
                        return {'path': file['path'], 'content': content, 'download_url': file['download_url']}
                    logging.error(f"Failed to download {file['path']} (HTTP {response.status})")
        except asyncio.TimeoutError:
            logging.error(f"Timeout when downloading {file['path']}")
        except Exception as e:
            logging.exception(f"Error downloading {file['path']}: {e}")
        return None

    async def fetch_all_files(self, files):
        async with aiohttp.ClientSession() as session:
            tasks = [self.download_file_content(session, file) for file in files]
            results = await asyncio.gather(*tasks, return_exceptions=True)
            return [r for r in results if r]

    def preprocess_content(self, content: str) -> str:
        """
        Preprocess text by converting to lowercase and removing short words.
        """
        content = content.lower()
        return ' '.join(word for word in content.split() if len(word) > 2 or word.isalnum())

    def calculate_similarity(self, vec1, vec2):
        """
        Compute cosine similarity between two vectors.
        """
        try:
            return float(np.dot(vec1, vec2) / (np.linalg.norm(vec1) * np.linalg.norm(vec2)))
        except ZeroDivisionError:
            return 0.0

    def analyze_repository(self, file_contents):
        """
        Analyze all files in the repository and generate a comprehensive overview.
        """
        # Prepare file structure and content for analysis
        repo_structure = []
        
        # Group files by directory/category
        directories = {}
        for path, content in file_contents.items():
            dir_name = os.path.dirname(path) or "root"
            if dir_name not in directories:
                directories[dir_name] = []
            
            # Extract file extension and size info
            ext = os.path.splitext(path)[1]
            size = len(content)
            
            directories[dir_name].append({
                "path": path,
                "extension": ext,
                "size": size,
                "content": content[:500] + "..." if len(content) > 500 else content  # First 500 chars
            })
        
        # Create structured representation of the repo
        for dir_name, files in directories.items():
            file_info = [f"- {f['path']} ({f['extension']}, {f['size']} bytes)" for f in files]
            repo_structure.append(f"Directory: {dir_name}\nFiles:\n" + "\n".join(file_info))
        
        # Concatenate important files content (keeping token count manageable)
        important_content = ""
        total_chars = 0
        char_limit = 15000  # Adjust based on model's context window
        
        # Prioritize likely important files (.py, .md, etc.)
        priority_extensions = [".py", ".md", ".js", ".java", ".c", ".cpp", ".h", ".sh", ".json", ".yaml", ".yml"]
        sorted_files = sorted(
            [item for sublist in directories.values() for item in sublist], 
            key=lambda x: (0 if any(x['path'].endswith(ext) for ext in priority_extensions) else 1, x['path'])
        )
        
        for file in sorted_files:
            file_content = f"\n\nFILE: {file['path']}\n{file['content']}"
            if total_chars + len(file_content) <= char_limit:
                important_content += file_content
                total_chars += len(file_content)
            else:
                # Add file path even if content doesn't fit
                important_content += f"\n\nFILE: {file['path']} (content omitted due to size)"
        
        # Prepare the prompt
        prompt = f"""
        You are analyzing a GitHub repository. Below is information about the structure and content of key files.
        
        REPOSITORY STRUCTURE:
        {os.linesep.join(repo_structure[:20])}  # Limit if there are too many directories
        
        IMPORTANT FILE CONTENTS:
        {important_content}
        
        Based on this analysis, provide a comprehensive paragraph that explains:
        1. What is the purpose of this repository?
        2. What problem does it solve?
        3. What are the main components and how do they work together?
        4. What technologies/frameworks are being used?
        
        Craft this as a concise technical overview that would help someone quickly understand what this repository is about.
        """
        
        try:
            response = client.chat.completions.create(
                model="gpt-3.5-turbo-16k",  # Using 16k model for larger context
                messages=[
                    {"role": "system", "content": "You are an expert code analyst who can understand repositories and explain them concisely."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=500
            )
            return response.choices[0].message.content.strip()
        except Exception as e:
            logging.exception(f"Error generating repository analysis: {e}")
            return "Failed to generate repository overview due to an error."
    
    async def match_files(self, issue_data: Dict, filtered_files: List[Dict]) -> Dict:
        """
        Match files to the issue based on similarity scores.
        """
        try:
            # Check cache first
            cache_key = self.cache.get_cache_key({
                'issue': issue_data,
                'files': [f['path'] for f in filtered_files]
            })
            
            cached_result = self.cache.get(cache_key)
            if cached_result:
                logging.info("Returning cached result")
                return cached_result

            # Process issue text
            issue_text = f"{issue_data['title']} {issue_data.get('description', '')}"
            issue_embedding = self.embedding_generator.generate_embedding(issue_text)

            # Fetch file contents
            file_contents = await self.fetch_all_files(filtered_files)
            if not file_contents:
                logging.warning("No valid files to analyze")
                return {"status": "error", "message": "No valid files to analyze"}

            # Process files in parallel
            with ThreadPoolExecutor(max_workers=self.max_workers) as executor:
                file_embeddings = list(executor.map(
                    lambda x: {
                        'path': x['path'],
                        'embedding': self.embedding_generator.generate_embedding(
                            self.preprocess_content(x['content'])
                        ),
                        'download_url': x['download_url']
                    },
                    file_contents
                ))

            # Calculate similarities
            matches = []
            for file_data in file_embeddings:
                similarity = self.calculate_similarity(
                    issue_embedding.cpu().numpy(),
                    file_data['embedding'].cpu().numpy()
                )
                if similarity > 0.1:  # Minimum threshold
                    matches.append({
                        "file_name": file_data['path'],
                        "match_score": round(similarity, 2),
                        "download_url": file_data['download_url']
                    })

            # Sort and return results
            matches.sort(key=lambda x: x['match_score'], reverse=True)
            result = {
                "filename_matches": matches[:3]
            }

            # Generate repository analysis by examining all files
            file_contents_dict = {file['path']: file['content'] for file in file_contents}
            overview = self.analyze_repository(file_contents_dict)
            result["overview"] = overview

            # Cache the result
            self.cache.set(cache_key, result)
            return result

        except Exception as e:
            logging.exception("Error in match_files")
            return {"status": "error", "message": str(e)}