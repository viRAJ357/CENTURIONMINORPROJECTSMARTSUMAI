from dotenv import load_dotenv
import os 
load_dotenv() #This file automatically reads env files 

# Use Render's PORT environment variable in production, fallback to 8900 for dev
SERVER_URL = os.getenv('SERVER_URL', 'localhost') # The server URL where the backend is hosted
PORT = int(os.getenv('PORT', 8900))
ENV = os.getenv('ENV', 'dev') # The environment in which the server is running (dev or prod)
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY') # Gemini API key for authentication

# Validate that GEMINI_API_KEY is set
if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY environment variable is not set! Please set it in your .env file or environment variables.")

# Default allowed origins for development
DEFAULT_ORIGINS = [
    "http://localhost:3000",                    # React dev server
    "http://localhost:5173",                    # Vite dev server
    "http://127.0.0.1:5173",                    # Alternative Vite dev server
    "http://localhost:8080",                    # Vue dev server
    "http://127.0.0.1:3000",                    # Alternative React dev server
    "http://localhost:4173",                    # Vite preview
]

# Production origins for your deployed frontend
PRODUCTION_ORIGINS = [
    "https://smart-sum-ai.vercel.app",          # Your main frontend domain
    "https://smart-sum-ai-*.vercel.app",        # Vercel preview deployments
    "https://*.vercel.app",                     # All Vercel preview domains
]