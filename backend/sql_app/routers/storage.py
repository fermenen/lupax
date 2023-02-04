import os
import base64
import uuid
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..services import storage_services
from ..schemas import schemas
from ..dependencies import get_db
from ..utils.storage import StorageCloud

router = APIRouter()


@router.post('/storage/video/task/', response_model=schemas.Storage, include_in_schema=False)
async def create_file_storage(item: schemas.StorageCreate, db: Session = Depends(get_db)):

    file_video_name_random = str(uuid.uuid4()) + '.mp4'

    videobase64 = item.file.replace('data:video/mp4;base64,', '')
    video_bytes = base64.b64decode(videobase64)
    video_result = open(file_video_name_random, "wb")
    video_result.write(video_bytes)

    db_storage = storage_services.create_file_storage(db=db, type='.mp4')

    StorageCloud().upload_file(file='./'+file_video_name_random,
                               destination=db_storage.id + db_storage.type)
    storage_services.link_video_participation(
        db=db, id_video=db_storage.id, id_participation=item.participation_id)
    os.remove(file_video_name_random)
    return db_storage
