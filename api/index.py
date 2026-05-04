import sys
import os

# Add the project root and backend to sys.path
root_path = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
sys.path.append(root_path)
sys.path.append(os.path.join(root_path, "backend"))

# Import the FastAPI app from backend/main.py
from backend.main import app

# This is required for Vercel to recognize the app
# Vercel's Python runtime will look for 'app' in the entry point
# Since we imported it above, it's already available as 'app'
