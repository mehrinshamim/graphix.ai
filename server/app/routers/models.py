from fastapi import APIRouter, HTTPException
from app.schemas.model_schemas import IssueAnalysisRequest, IssueAnalysisResponse
from model.matcher import IssueMatcher
import time

router = APIRouter()

@router.post("/match-keywords")
async def analyze_issue(request: IssueAnalysisRequest):
    try:
        # Initialize the matcher
        matcher = IssueMatcher()
        
        start_time = time.time()
        
        # Run the matching
        result = await matcher.match_files(
            request.issueDetails.dict(),
            [file.dict() for file in request.filteredFiles]
        )
        
        end_time = time.time()
        elapsed_time = end_time - start_time
        
        # Add additional fields to match test_run.py output
        result["repo"] = request.issueDetails.repo
        result["description"] = request.issueDetails.description
        result["issuenum"] = request.issueDetails.issuenum
        result["owner"] = request.issueDetails.owner

        return result
    
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error analyzing issue: {str(e)}"
        )