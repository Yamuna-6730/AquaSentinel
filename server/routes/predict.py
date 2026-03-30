from fastapi import APIRouter, UploadFile, File, HTTPException
from server.services.model_service import ModelService
from server.services.supabase_service import SupabaseService
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
    1. Inference via ModelService
    2. Upload image to Supabase
    3. Save results to DB (uploads, telemetry_results, detections)
    """
    try:
        # Read file bytes
        contents = await file.read()
        nparr = np.frombuffer(contents, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if img is None:
            raise HTTPException(status_code=400, detail="Invalid image file")

        # 1. Mock/Actual Model Inference
        inference_result = model_service.predict(img)

        # 2. Upload file to Supabase Storage
        file_url = await supabase_service.upload_file(
            file_content=contents,
            filename=file.filename,
            content_type=file.content_type or "image/jpeg"
        )

        # 3. Save to "uploads" table
        upload_record = await supabase_service.add_upload_record(
            filename=file.filename,
            file_type=file.content_type or "image/jpeg",
            file_url=file_url
        )
        upload_id = upload_record.get("id")

        # 4. Save to "telemetry_results" table
        lat = random.uniform(12.0, 13.0) 
        lng = random.uniform(77.0, 78.0) 
        
        telemetry_record = await supabase_service.add_telemetry_result(
            upload_id=upload_id,
            telemetry=inference_result.get("telemetry"),
            lat=lat,
            lng=lng
        )
        telemetry_id = telemetry_record.get("id")

        # 5. Save multiple detections
        detections_list = inference_result.get("detections", [])
        saved_detections = await supabase_service.add_detections(
            telemetry_id=telemetry_id,
            detections=detections_list
        )

        return {
            "status": "success",
            "upload_id": upload_id,
            "telemetry_id": telemetry_id,
            "file_url": file_url,
            "telemetry": inference_result.get("telemetry"),
            "detections": saved_detections,
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
        return inference_result
    except Exception as e:
        import traceback
        print(f"Prediction Error (Frame): {e}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))
