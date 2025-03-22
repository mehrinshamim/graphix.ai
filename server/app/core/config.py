from pydantic_settings import BaseSettings
from typing import Optional
from functools import lru_cache

class Settings(BaseSettings):
    # GitHub settings
    GITHUB_TOKEN: str
    GITHUB_API_VERSION: str = "2022-11-28"
    
    # OpenAI settings
    OPENAI_API_KEY: str
    OPENAI_MODEL: str = "gpt-3.5-turbo-16k"
    OPENAI_TEMPERATURE: float = 0.2
    OPENAI_MAX_TOKENS: int = 2000
    
    # API settings
    API_TIMEOUT: int = 60
    MAX_FILES_PER_REQUEST: int = 5

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

@lru_cache()
def get_settings() -> Settings:
    """Cache and return settings instance"""
    return Settings()