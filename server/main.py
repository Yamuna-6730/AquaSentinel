from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from server.routes import predict, upload, fetch
import uvicorn

app = FastAPI(title="AquaSentinel API", version="1.0.0")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development; restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routes
app.include_router(predict.router, prefix="/api")
app.include_router(upload.router, prefix="/api")
app.include_router(fetch.router, prefix="/api")

# Health check
@app.get("/api/health")
async def health():
    return {"status": "ok", "message": "AquaSentinel AI service is running"}

# Debug: List all routes
@app.get("/api/routes")
async def list_routes():
    routes = []
    for route in app.routes:
        routes.append({
            "path": getattr(route, "path", None),
            "name": getattr(route, "name", None),
            "methods": list(getattr(route, "methods", []))
        })
    return {"routes": routes}

# Optional root (to avoid 404 at "/")
@app.get("/")
def root():
    return {"message": "AquaSentinel backend is live 🚀"}

if __name__ == "__main__":
    uvicorn.run("server.main:app", host="0.0.0.0", port=8000, reload=True)