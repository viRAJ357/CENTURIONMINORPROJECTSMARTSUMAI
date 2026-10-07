from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import os
from constants import SERVER_URL, PORT, ENV, DEFAULT_ORIGINS, PRODUCTION_ORIGINS
from apps.calculator.route import router as calculator_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    yield

app = FastAPI(
    title="SmartSum AI Backend", 
    version="1.0.0",
    description="AI-powered mathematical expression solver",
    lifespan=lifespan
)

# Determine allowed origins based on environment
if ENV == 'prod':
    # For production, use environment variable or specific production domains
    custom_origins = os.getenv('ALLOWED_ORIGINS')
    if custom_origins:
        ALLOWED_ORIGINS = custom_origins.split(',')
    else:
        ALLOWED_ORIGINS = PRODUCTION_ORIGINS + [
            "https://smart-sum-ai.vercel.app",
        ]
else:
    # For development, use the predefined list of common dev servers
    ALLOWED_ORIGINS = DEFAULT_ORIGINS + PRODUCTION_ORIGINS

# Remove duplicates
ALLOWED_ORIGINS = list(set(ALLOWED_ORIGINS))

print(f"Environment: {ENV}")
print(f"CORS Origins: {ALLOWED_ORIGINS}")  # Debug print

# Middleware to handle CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes to check server health and get the server URL
@app.get("/")
async def health():
    return {
        'message': 'SmartSum AI Backend is running',
        'status': 'healthy',
        'environment': ENV,
        'version': '1.0.0',
        'cors_origins': ALLOWED_ORIGINS  # Add this for debugging
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy", 
        "message": "API is working",
        "environment": ENV,
        "cors_origins": ALLOWED_ORIGINS  # Add this for debugging
    }

# Adding the router.py response route to main.py
app.include_router(calculator_router, prefix='/calculate', tags=['calculate'])

if __name__ == '__main__':
    host = '0.0.0.0' if ENV == 'prod' else SERVER_URL
    print(f"Starting server on {host}:{PORT} in {ENV} environment")
    print(f"Allowed CORS origins: {ALLOWED_ORIGINS}")
    uvicorn.run('main:app', host=host, port=PORT, reload=(ENV == 'dev'))