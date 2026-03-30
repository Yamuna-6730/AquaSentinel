from fastapi import FastAPI, WebSocket   # ✅ add WebSocket
from fastapi.middleware.cors import CORSMiddleware
from server.routes import predict, upload, fetch, report
import uvicorn
from server.services.ws_instance import manager

app = FastAPI(title="AquaSentinel API", version="1.0.0")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
app.include_router(predict.router, prefix="/api")
app.include_router(upload.router, prefix="/api")
app.include_router(fetch.router, prefix="/api")
app.include_router(report.router, prefix="")

# Health
@app.get("/api/health")
async def health():
    return {"status": "ok"}

# Root
@app.get("/")
def root():
    return {"message": "AquaSentinel backend is live 🚀"}

# ✅ ENABLE WEBSOCKET (just uncomment + fix)
@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            await websocket.receive_text()
    except:
        manager.disconnect(websocket)

if __name__ == "__main__":
    uvicorn.run("server.main:app", host="0.0.0.0", port=8000, reload=True)