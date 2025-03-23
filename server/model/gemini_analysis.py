import os
import asyncio
import json
import google.generativeai as genai
import aiohttp
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Set up Gemini API Key
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=GEMINI_API_KEY)

async def fetch_file_contents(file):
    """Download file content asynchronously."""
    async with aiohttp.ClientSession() as session:
        async with session.get(file['download_url']) as response:
            if response.status == 200:
                return {'name': file['name'], 'content': await response.text()}
    return None

async def analyze_issue_with_gemini(issue_description, filtered_files):
    """Uses Google Gemini API to analyze the issue and recommend solutions."""
    
    # Fetch file contents asynchronously
    tasks = [fetch_file_contents(file) for file in filtered_files]
    files_content = await asyncio.gather(*tasks)
    files_content = [f for f in files_content if f]

    # Prepare input for Gemini API
    file_summaries = "\n".join([f"**{f['name']}**:\n{f['content'][:500]}..." for f in files_content])
    
    prompt = f"""
You are an AI assistant specialized in debugging and issue resolution.
Analyze the following GitHub issue description and related files.

## Issue Context:
- The issue is occurring in a **headless CI/CD environment (e.g., ubuntu-latest)**.
- It is likely related to **OpenCV GUI functions** (such as cv2.imshow).
- The same code works fine locally but fails in CI.

## Issue Description:
{issue_description}

## Related Files:
{file_summaries}

## Expected Output:
1. **Identify the Root Cause**:
   - Explain why the issue occurs in a CI environment.
   - Specify which functions or dependencies might be causing it.

2. **Recommended Solutions (Ranked)**:
   - Provide a structured list of **solutions**, from most preferred to least preferred.
   - Include **code snippets** where applicable.
   - If possible, suggest a way to **automatically detect and handle GUI-related issues** in CI.

3. **Actionable Steps**:
   - List **clear, step-by-step instructions** to implement the best solution.
   - Highlight any **potential pitfalls or trade-offs**.

Ensure your response is structured, concise, and easy to follow. 🚀
"""


    # Call Gemini API
    model = genai.GenerativeModel("gemini-1.5-pro")
    response = model.generate_content(prompt)

    return response.text

async def main():
    """Main function to analyze issue and suggest solutions."""
    sample_input = {
        "owner": "Udayraj123",
        "repo": "OMRChecker",
        "issueDetails": {
            "title": "[Environment] OpenCV NULL guiReceiver error during pre-commit testing.",
            "description": "While running pre-commit hooks and pytest for my application, I'm encountering an OpenCV error related to GUI functions.\n\nSteps to reproduce:\n1. Make any changes in code.\n2. Run commands `git add` and `pre-commit run -a`.\n3. Commit changes using `git commit -m \"commit message\"`.\n\nOS: Ubuntu 24.04.1 LTS\nPython: 3.12.3\nOpenCV: 4.10.0"
        },
        "filteredFiles": [
            {
                "name": "pre-commit.yml",
                "path": ".github/pre-commit.yml",
                "download_url": "https://raw.githubusercontent.com/Udayraj123/OMRChecker/master/.github/pre-commit.yml"
            },
            {
                "name": "main.py",
                "path": "main.py",
                "download_url": "https://raw.githubusercontent.com/Udayraj123/OMRChecker/master/main.py"
            }
        ]
    }

    issue_description = sample_input["issueDetails"]["description"]
    filtered_files = sample_input["filteredFiles"]

    print("Analyzing issue with Gemini...")
    recommendations = await analyze_issue_with_gemini(issue_description, filtered_files)
    
    # Output the response
    print(json.dumps({"recommendations": recommendations}, indent=4))

if __name__ == "__main__":
    asyncio.run(main())
