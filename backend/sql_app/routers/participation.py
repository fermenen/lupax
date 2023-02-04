from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..dependencies import get_db
from ..services import participations_service
from ..schemas import schemas

router = APIRouter()


@router.post('/participation/', response_model=schemas.Participation, include_in_schema=False)
async def create_participation(item: schemas.ParticipationCreate, db: Session = Depends(get_db)):
    return participations_service.create_participation(db=db, item=item)
