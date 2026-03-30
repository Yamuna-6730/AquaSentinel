import os
from dotenv import load_dotenv
from supabase import create_client, Client
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    SUPABASE_URL: str
    SUPABASE_KEY: str
    DEBUG: str = "False"
    PORT: int = 8000
    
    class Config:
        env_file = ".env"
        extra = "allow"

# Load local .env if it exists
load_dotenv()

# Instantiate settings
try:
    settings = Settings()
except Exception as e:
    print(f"Warning: Environment variables not fully loaded. {e}")
    # Fallback to os.environ directly if pydantic-settings fails
    class MockSettings:
        SUPABASE_URL = os.getenv("SUPABASE_URL", "")
        SUPABASE_KEY = os.getenv("SUPABASE_KEY", "")
        DEBUG = os.getenv("DEBUG", "False")
        PORT = int(os.getenv("PORT", 8000))
    settings = MockSettings()

# Export a synchronous client for simple use-cases if needed
# but we will primarily use AsyncClient in the services
supabase_sync: Client = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)
