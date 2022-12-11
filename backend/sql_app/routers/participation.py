from fastapi import APIRouter
from .. import crud, schemas
from fastapi import Depends, HTTPException
from sqlalchemy.orm import Session
from supertokens_python.recipe.session import SessionContainer
from supertokens_python.recipe.session.framework.fastapi import verify_session
from ..dependencies import get_db

router = APIRouter()


@router.post('/participation/', response_model=schemas.Participation, include_in_schema=False)
async def create_participation(item: schemas.ParticipationCreate, db: Session = Depends(get_db)):
    return crud.create_participation(db=db, item=item)
