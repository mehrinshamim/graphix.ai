from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
#from app.routers import issues
app = FastAPI(
    title="TinkHack",
    description="...",
    version="1.0.0",
)
# CORS setup
origins = [
    "http://localhost:3000",  # Allow local frontend
    "https://your-deployed-client-url.com",  # Add your deployed frontend URL here
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # List of allowed origins
    allow_credentials=True,  # Allow cookies to be included
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, PUT, etc.)
    allow_headers=["*"],  # Allow all headers
)

# Include routers
#app.include_router(issues.router, prefix="/api/issues", tags=["Issues"])
@app.get("/")
def read_root():
    return {"message": "Welcome to TinkHack API!"}
@app.get("/health", tags=["Health"])
def health_check():
    return {"status": "Server is running!"}