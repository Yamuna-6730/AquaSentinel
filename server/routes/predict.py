from fastapi import APIRouter, UploadFile, File, HTTPException
from server.services.model_service import ModelService
from server.services.supabase_service import SupabaseService
from server.services.ws_instance import manager

import numpy as np
import cv2
import random
import uuid

router = APIRouter(prefix="/predict", tags=["predict"])
model_service = ModelService()
supabase_service = SupabaseService()

from pydantic import BaseModel

class FrameInput(BaseModel):
    image: str  # Base64 encoded image

@router.post("/image")
async def predict_image(file: UploadFile = File(...)):
    """
    Simplified endpoint for hackathon:
    1. Read image
    2. Run YOLOv8 inference
    3. Return results directly (skipping Supabase storage)
    """
    try:
        # Read file bytes
        contents = await file.read()
        nparr = np.frombuffer(contents, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if img is None:
            raise HTTPException(status_code=400, detail="Invalid image file")

        # Perform Model Inference
        # Returns { detections: [...], telemetry: { ... }, annotated_image: "data:..." }
        inference_result = model_service.predict(img)
        telemetry = inference_result.get("telemetry", {})
        risk = telemetry.get("risk_level", "Low")

        if risk in ["Medium", "High"]:
            await manager.send_alert(
                f"⚠️ {risk} Risk | Distance: {round(telemetry.get('distance', 0),2)}m"
            )

        return {
            "status": "success",
            "telemetry": inference_result.get("telemetry"),
            "detections": inference_result.get("detections"),
            "annotated_image": inference_result.get("annotated_image")
        }
    except Exception as e:
        import traceback
        print(f"Prediction Error (Image): {e}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/frame")
async def predict_frame(data: FrameInput):
    """
    Handles real-time camera frames (base64)
    """
    try:
        img = model_service.base64_to_numpy(data.image)
        if img is None:
            raise HTTPException(status_code=400, detail="Invalid base64 image")
            
        inference_result = model_service.predict(img)
        telemetry = inference_result.get("telemetry", {})
        risk = telemetry.get("risk_level", "Low")

        if risk in ["Medium", "High"]:
            await manager.send_alert(
                f"⚠️ {risk} Risk | Distance: {round(telemetry.get('distance', 0),2)}m"
            )
        return inference_result
    
    except Exception as e:
        import traceback
        print(f"Prediction Error (Frame): {e}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))
