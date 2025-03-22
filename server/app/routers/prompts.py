from fastapi import APIRouter, HTTPException, Body
from fastapi.responses import JSONResponse
import httpx
import json
from typing import List, Dict, Any, Optional
from pydantic import BaseModel, HttpUrl, Field
from app.core.config import get_settings
import logging
from tenacity import retry, stop_after_attempt, wait_exponential

settings = get_settings()
logger = logging.getLogger(__name__)

# System prompt that recognizes diverse file types and structures
SYSTEM_MESSAGE = """You are a code analysis expert. Your task is to analyze code files and extract their structure.

For each file:
1. Detect the language (Python, JavaScript, TypeScript, etc.)
2. Identify the file's purpose/category (e.g., backend API, frontend component, ML model, database service, utility, etc.)
3. Extract all significant components based on the file's type and purpose

Extract components that make sense for the specific file type. For example:

- For API files: endpoints, routes, handlers
- For ML files: models, training functions, data processing
- For frontend files: components, hooks, effects
- For database files: queries, schemas, models
- For service clients: API methods, configuration
- For utility files: helper functions, constants

Provide the response in this exact JSON format:

---JSON_GRAPH---
{
  "filename": {
    "language": "detected_language",
    "category": "detected_category",
    "components": {
      "componentType1": [
        {"name": "item1_name", "attributes": {}, "description": "what it does"}
      ],
      "componentType2": [
        {"name": "item2_name", "attributes": {}, "description": "what it does"}
      ]
      // Include only relevant component types for this file
    }
  }
}
---JSON_END---

---DESCRIPTION---
Brief description of the code's purpose and functionality
---DESCRIPTION_END---

Notes:
- Only include component types that are actually present in the file
- For each component type, provide detailed information in a consistent format
- The "attributes" field can contain any relevant metadata for that component
- Be accurate and precise in your analysis"""

router = APIRouter()

# Models
class GitHubFile(BaseModel):
    url: HttpUrl

class GitHubFiles(BaseModel):
    files: List[HttpUrl] = Field(..., max_items=settings.MAX_FILES_PER_REQUEST)

class CodeAnalysisResponse(BaseModel):
    description: str
    graph: Dict[str, Dict[str, Any]]

def get_github_headers():
    return {
        "Accept": "application/vnd.github+json",
        "Authorization": f"Bearer {settings.GITHUB_TOKEN}",
        "X-GitHub-Api-Version": settings.GITHUB_API_VERSION
    }

def get_openai_headers():
    return {
        "Authorization": f"Bearer {settings.OPENAI_API_KEY}",
        "Content-Type": "application/json"
    }

async def fetch_code_from_github(file_url: str) -> str:
    """Fetch code content from a GitHub file URL"""
    try:
        # Process the URL to get raw content
        if "raw.githubusercontent.com" in file_url:
            raw_url = file_url
        else:
            # Convert from github.com URL to raw.githubusercontent.com
            raw_url = file_url.replace("github.com", "raw.githubusercontent.com")
            raw_url = raw_url.replace("/blob/", "/")

        logger.info(f"Fetching code from: {raw_url}")
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.get(raw_url, headers=get_github_headers(), timeout=30.0)
            if response.status_code != 200:
                logger.error(f"GitHub API error: {response.status_code} - {response.text}")
                raise HTTPException(
                    status_code=response.status_code,
                    detail=f"Failed to fetch code from GitHub: {response.text}"
                )
            return response.text
    except httpx.HTTPError as e:
        logger.error(f"GitHub API request failed: {str(e)}")
        raise HTTPException(
            status_code=500, 
            detail=f"GitHub API request failed: {str(e)}"
        )
    except Exception as e:
        logger.error(f"Error fetching code: {str(e)}")
        raise HTTPException(
            status_code=500, 
            detail=f"Error fetching code: {str(e)}"
        )

@retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=4, max=10))
async def analyze_code_with_openai(code_files: Dict[str, str]) -> Dict[str, Any]:
    """Send code to OpenAI for analysis with retries"""
    try:
        messages = [
            {"role": "system", "content": SYSTEM_MESSAGE},
            {"role": "user", "content": "Analyze these files and provide a structured graph of their components:"}
        ]
        
        # Add each file to be analyzed
        for filename, code in code_files.items():
            messages.append({"role": "user", "content": f"File: {filename}\n\n```\n{code}\n```"})
        
        logger.info(f"Sending {len(code_files)} files to OpenAI for analysis")
        async with httpx.AsyncClient(timeout=settings.API_TIMEOUT) as client:
            response = await client.post(
                "https://api.openai.com/v1/chat/completions",
                headers=get_openai_headers(),
                json={
                    "model": settings.OPENAI_MODEL,
                    "messages": messages,
                    "temperature": 0.1,
                    "max_tokens": settings.OPENAI_MAX_TOKENS
                },
                timeout=settings.API_TIMEOUT
            )
            
            if response.status_code != 200:
                logger.error(f"OpenAI API error: {response.status_code} - {response.text}")
                raise HTTPException(
                    status_code=response.status_code,
                    detail=f"OpenAI API error: {response.text}"
                )
            
            result = response.json()
            if "choices" not in result or not result["choices"]:
                logger.error("Invalid response structure from OpenAI")
                raise HTTPException(
                    status_code=500,
                    detail="Invalid response from OpenAI API"
                )
                
            full_response = result["choices"][0]["message"]["content"]
            
            if not full_response:
                logger.warning("Empty response from OpenAI")
                return {"description": "No analysis available", "graph": {}}

            # Extract the JSON graph data
            try:
                # Find the JSON markers
                json_start = full_response.find("---JSON_GRAPH---")
                json_end = full_response.find("---JSON_END---")
                
                if json_start == -1 or json_end == -1:
                    logger.warning("Missing JSON markers in response")
                    raise ValueError("Missing JSON markers in response")
                
                # Extract the JSON string
                json_str = full_response[json_start + 15:json_end].strip()
                
                # Clean up potential issues in the JSON string
                json_str = json_str.replace("```json", "").replace("```", "")
                # Remove comments that might have been added
                json_str = '\n'.join([line for line in json_str.split('\n') if not line.strip().startswith('//')])
                
                # Parse and validate JSON
                if not json_str:
                    logger.warning("Empty JSON structure")
                    raise ValueError("Empty JSON structure")
                
                try:
                    graph = json.loads(json_str)
                except json.JSONDecodeError:
                    # Try to fix common JSON issues and try again
                    logger.warning("Initial JSON parsing failed, attempting to fix format")
                    # Replace single quotes with double quotes
                    json_str = json_str.replace("'", "\"")
                    # Remove trailing commas
                    json_str = json_str.replace(",\n}", "\n}")
                    json_str = json_str.replace(",\n]", "\n]")
                    graph = json.loads(json_str)
                
                # Extract description
                desc_start = full_response.find("---DESCRIPTION---")
                desc_end = full_response.find("---DESCRIPTION_END---")
                
                description = (full_response[desc_start + 16:desc_end].strip() 
                             if desc_start != -1 and desc_end != -1 
                             else "No description available")
                
                return {
                    "description": description,
                    "graph": graph
                }
                
            except json.JSONDecodeError as e:
                logger.error(f"JSON parsing error: {str(e)}, JSON string: {json_str[:200]}...")
                return {
                    "description": "Error parsing analysis",
                    "graph": {"error": f"Invalid JSON structure: {str(e)}"}
                }
            except ValueError as e:
                logger.error(f"Response format error: {str(e)}")
                return {
                    "description": str(e),
                    "graph": {"error": "Invalid response format"}
                }
            
    except httpx.TimeoutException:
        logger.error("OpenAI API request timed out")
        raise HTTPException(status_code=504, detail="Analysis request timed out")
    except Exception as e:
        logger.error(f"Analysis error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error analyzing code: {str(e)}")

@router.post("/analyze/", response_model=CodeAnalysisResponse)
async def analyze_github_files(files_data: GitHubFiles = Body(...)):
    """
    Analyze multiple GitHub code files and return their structure as a graph
    
    - Fetches code from GitHub URLs
    - Uses AI to analyze the code structure
    - Returns a graph representation of the code components
    """
    if not files_data.files:
        raise HTTPException(status_code=400, detail="No files provided")
    
    try:
        # Fetch code for each file
        code_files = {}
        for file_url in files_data.files:
            filename = str(file_url).split("/")[-1]
            code = await fetch_code_from_github(str(file_url))
            code_files[filename] = code
            
        # Analyze code with OpenAI
        analysis = await analyze_code_with_openai(code_files)
        
        # Prepare response
        return JSONResponse(content={
            "description": analysis["description"],
            "graph": analysis["graph"]
        })
        
    except HTTPException:
        # Let existing HTTPExceptions pass through
        raise
    except Exception as e:
        logger.error(f"Error processing request: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error processing request: {str(e)}")

@router.post("/analyze/single/", response_model=CodeAnalysisResponse)
async def analyze_single_file(file_data: GitHubFile = Body(...)):
    """Analyze a single GitHub code file and return its structure as a graph"""
    try:
        code = await fetch_code_from_github(str(file_data.url))
        filename = str(file_data.url).split("/")[-1]
        
        analysis = await analyze_code_with_openai({filename: code})
        
        return JSONResponse(content={
            "description": analysis["description"],
            "graph": analysis["graph"]
        })
        
    except HTTPException:
        # Let existing HTTPExceptions pass through
        raise
    except Exception as e:
        logger.error(f"Error processing single file: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error processing request: {str(e)}")