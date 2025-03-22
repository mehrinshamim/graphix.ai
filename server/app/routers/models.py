from fastapi import APIRouter, HTTPException
from app.schemas.model_schemas import IssueAnalysisRequest, IssueAnalysisResponse
from model.matcher import IssueMatcher
import time

router = APIRouter()

@router.post("/match-keywords", response_model=IssueAnalysisResponse)
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
        
        return IssueAnalysisResponse(
            elapsed_time=elapsed_time,
            matches=result,
            status="success",
            message="Issue analysis completed successfully"
        )
    
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error analyzing issue: {str(e)}"
        )