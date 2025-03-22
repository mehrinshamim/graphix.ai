# test_run.py
from model.matcher import IssueMatcher
import time
import asyncio
import json

# Sample test data


sampleinput={
  "owner": "jamaljm",
  "repo": "snapcv",
  "filteredFiles": [
    {
      "name": "components.json",
      "path": "components.json",
      "download_url": "https://raw.githubusercontent.com/jamaljm/snapcv/main/components.json"
    },
    {
      "name": "next.config.ts",
      "path": "next.config.ts",
      "download_url": "https://raw.githubusercontent.com/jamaljm/snapcv/main/next.config.ts"
    },
    {
      "name": "package-lock.json",
      "path": "package-lock.json",
      "download_url": "https://raw.githubusercontent.com/jamaljm/snapcv/main/package-lock.json"
    },
    {
      "name": "package.json",
      "path": "package.json",
      "download_url": "https://raw.githubusercontent.com/jamaljm/snapcv/main/package.json"
    },
    {
      "name": "sampl.json",
      "path": "sampl.json",
      "download_url": "https://raw.githubusercontent.com/jamaljm/snapcv/main/sampl.json"
    },
    {
      "name": "setup-latex.sh",
      "path": "scripts/setup-latex.sh",
      "download_url": "https://raw.githubusercontent.com/jamaljm/snapcv/main/scripts/setup-latex.sh"
    },
    {
      "name": "Common_context.tsx",
      "path": "src/Common_context.tsx",
      "download_url": "https://raw.githubusercontent.com/jamaljm/snapcv/main/src/Common_context.tsx"
    },
    {
      "name": "route.ts",
      "path": "src/app/api/checkSlug/route.ts",
      "download_url": "https://raw.githubusercontent.com/jamaljm/snapcv/main/src/app/api/checkSlug/route.ts"
    },
    {
      "name": "route.ts",
      "path": "src/app/api/getGithubWrap/route.ts",
      "download_url": "https://raw.githubusercontent.com/jamaljm/snapcv/main/src/app/api/getGithubWrap/route.ts"
    },
    {
      "name": "route.ts",
      "path": "src/app/api/getMetadata/route.ts",
      "download_url": "https://raw.githubusercontent.com/jamaljm/snapcv/main/src/app/api/getMetadata/route.ts"
    }
  ],
  "issueDetails": {
    "description": "Please Add Skill Reordering for both resume and Portfolio \n",
    "labels": [],
    "owner": "jamaljm",
    "repo": "snapcv",
    "title": "Please Add Skill Reordering for both resume and Portfolio"
  }
}


issue_data=sampleinput['issueDetails']
filtered_files=sampleinput['filteredFiles']
async def main():
    # Initialize the matcher
    matcher = IssueMatcher()
    
    start_time=time.time()
    # Run the matching
    result = await matcher.match_files(issue_data, filtered_files)
    repo=sampleinput["issueDetails"]["repo"]
    des=sampleinput["issueDetails"]["description"]
    result["repo"]=repo
    result["description"]=des
    result["issuenum"]=0
    end_time=time.time()
    elapsed_time=end_time-start_time
    print("Time taken :",elapsed_time)
    print(json.dumps(result,indent=4))
    

# Run the async function

if __name__ == "__main__":
    asyncio.run(main())