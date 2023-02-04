from sqlalchemy.orm import Session
from ..models import models


def create_file_storage(db: Session, type: str):
    db_file_storage = models.Storage(type=type)
    db.add(db_file_storage)
    db.commit()
    db.refresh(db_file_storage)
    return db_file_storage


def link_video_participation(db: Session, id_video: str, id_participation: str):
    db.query(models.Participation).filter(models.Participation.id ==
                                          id_participation).update({'video_storage_id':  id_video})
    db.commit()
