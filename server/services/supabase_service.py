import asyncio
from server.config import settings
from supabase import create_async_client, AsyncClient
from typing import Dict, List, Optional
import uuid
import datetime

class SupabaseService:
    _instance = None
    _client: Optional[AsyncClient] = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(SupabaseService, cls).__new__(cls)
        return cls._instance

    def __init__(self):
        self.bucket_name = "uploads"

    async def _get_client(self) -> AsyncClient:
        """
        Lazily initialize and return the async Supabase client.
        """
        if self._client is None:
            self._client = await create_async_client(
                settings.SUPABASE_URL, 
                settings.SUPABASE_KEY
            )
        return self._client

    async def upload_file(self, file_content: bytes, filename: str, content_type: str = "image/jpeg") -> str:
        """
        Uploads a file to the Supabase storage bucket named "uploads".
        Returns the public URL of the uploaded file.
        """
        try:
            client = await self._get_client()
            unique_filename = f"{uuid.uuid4()}_{filename}"
            
            # Upload to storage (Async)
            await client.storage.from_(self.bucket_name).upload(
                path=unique_filename,
                file=file_content,
                file_options={"content-type": content_type}
            )
            
            # Get public URL (Async in AsyncClient)
            public_url_response = client.storage.from_(self.bucket_name).get_public_url(unique_filename)
            if hasattr(public_url_response, "__await__") or asyncio.iscoroutine(public_url_response):
                public_url_response = await public_url_response
            return public_url_response
        except Exception as e:
            print(f"Supabase Storage Upload Error: {e}")
            raise e

    async def add_upload_record(self, filename: str, file_type: str, file_url: str) -> Dict:
        """
        Inserts a record into the 'uploads' table.
        """
        try:
            client = await self._get_client()
            data = {
                "file_name": filename,
                "file_type": file_type,
                "file_url": file_url,
                "uploaded_at": datetime.datetime.utcnow().isoformat()
            }
            result = await client.table("uploads").insert(data).execute()
            return result.data[0] if result.data else {}
        except Exception as e:
            print(f"Supabase DB 'uploads' Insert Exception: {e}")
            raise e

    async def add_telemetry_result(self, upload_id: str, telemetry: Dict, lat: float, lng: float) -> Dict:
        """
        Inserts a record into the 'telemetry_results' table.
        """
        try:
            client = await self._get_client()
            data = {
                "upload_id": upload_id,
                "object_detected": telemetry.get("object_detected", False),
                "risk_level": telemetry.get("risk_level", "Low"),
                "distance": float(telemetry.get("distance", 0.0)),
                "visibility_score": float(telemetry.get("visibility_score", 0.0)),
                "latitude": lat,
                "longitude": lng,
                "created_at": datetime.datetime.utcnow().isoformat()
            }
            result = await client.table("telemetry_results").insert(data).execute()
            return result.data[0] if result.data else {}
        except Exception as e:
            print(f"Supabase DB 'telemetry_results' Insert Exception: {e}")
            raise e

    async def add_detections(self, telemetry_id: str, detections: List[Dict]) -> List[Dict]:
        """
        Inserts multiple detections for a given telemetry ID.
        """
        try:
            if not detections:
                return []
                
            client = await self._get_client()
            data = []
            for det in detections:
                data.append({
                    "telemetry_id": telemetry_id,
                    "label": det.get("label"),
                    "confidence": float(det.get("confidence", 0.0)),
                    "bbox": det.get("bbox") # JSON field in PG
                })
                
            result = await client.table("detections").insert(data).execute()
            return result.data if result.data else []
        except Exception as e:
            print(f"Supabase DB 'detections' Insert Exception: {e}")
            raise e

    async def get_uploads(self, limit: int = 100) -> List[Dict]:
        client = await self._get_client()
        result = await client.table("uploads").select("*").order("uploaded_at", desc=True).limit(limit).execute()
        return result.data if result.data else []

    async def get_telemetry_results(self, limit: int = 100) -> List[Dict]:
        client = await self._get_client()
        result = await client.table("telemetry_results").select("*").order("created_at", desc=True).limit(limit).execute()
        return result.data if result.data else []

    async def get_detections_by_telemetry(self, telemetry_id: str) -> List[Dict]:
        client = await self._get_client()
        result = await client.table("detections").select("*").eq("telemetry_id", telemetry_id).execute()
        return result.data if result.data else []
