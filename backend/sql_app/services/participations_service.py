from sqlalchemy.orm import Session
from ..schemas import schemas
from ..models import models


def create_participation(db: Session, item: schemas.ParticipationCreate):
    db_item_participation = models.Participation(**item.dict())
    db.add(db_item_participation)
    db.commit()
    db.refresh(db_item_participation)
    return db_item_participation
