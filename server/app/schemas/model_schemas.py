from pydantic import BaseModel, HttpUrl
from typing import List, Optional

class FileInfo(BaseModel):
    name: str
    path: str
    download_url: str

class IssueDetails(BaseModel):
    owner: str
    repo: str
    title: str
    description: str
    labels: List[str]
    issuenum : Optional[int] = 0


class IssueAnalysisRequest(BaseModel):
    owner: str
    repo: str
    filteredFiles: List[FileInfo]
    issueDetails: IssueDetails


class FileMatch(BaseModel):
    file_name: str
    match_score: float
    download_url: str

class IssueAnalysisResponse(BaseModel):
    filename_matches: List[FileMatch]
    overview: str
    repo: str
    description: str
    issuenum: int = 0
    owner: str

