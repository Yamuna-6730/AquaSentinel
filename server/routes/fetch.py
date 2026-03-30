from fastapi import APIRouter, HTTPException
from server.services.supabase_service import SupabaseService
from typing import List, Dict

router = APIRouter(tags=["fetch"])
supabase_service = SupabaseService()

@router.get("/uploads")
async def list_uploads():
    """
    GET /api/uploads → list uploads
    """
    try:
        return await supabase_service.get_uploads()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/telemetry")
async def list_telemetry():
    """
    GET /api/telemetry → list telemetry results
    """
    try:
        return await supabase_service.get_telemetry_results()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/detections/{telemetry_id}")
async def list_detections(telemetry_id: str):
    """
    GET /api/detections/{telemetry_id}
    """
    try:
        return await supabase_service.get_detections_by_telemetry(telemetry_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
