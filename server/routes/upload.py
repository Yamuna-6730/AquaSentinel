from fastapi import APIRouter, UploadFile, File, HTTPException
from server.services.supabase_service import SupabaseService
import mimetypes

router = APIRouter(prefix="/upload", tags=["upload"])
supabase_service = SupabaseService()

@router.post("/")
async def upload_file(file: UploadFile = File(...)):
    """
    Accept image/video file via FastAPI UploadFile
    Upload file to Supabase storage bucket "uploads"
    Get public URL
    Insert record into "uploads" table
    Return: { upload_id, file_url }
    """
    try:
        # Read file contents
        contents = await file.read()
        
        # Determine content type if not provided
        content_type = file.content_type
        if not content_type:
            content_type, _ = mimetypes.guess_type(file.filename)
            content_type = content_type or "application/octet-stream"

        # 1. Upload to Supabase Storage
        # Note: public_url is not truly public unless bucket is public, 
        # but the request implies publicUrl function from Supabase Storage API.
        public_url = await supabase_service.upload_file(
            file_content=contents,
            filename=file.filename,
            content_type=content_type
        )

        # 2. Insert record into database
        upload_record = await supabase_service.add_upload_record(
            filename=file.filename,
            file_type=content_type,
            file_url=public_url
        )

        return {
            "upload_id": upload_record.get("id"),
            "file_url": public_url
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
