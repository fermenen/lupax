from fastapi import APIRouter, Depends, HTTPException
from typing import List
from sqlalchemy.orm import Session
from supertokens_python.recipe.session import SessionContainer
from supertokens_python.recipe.session.framework.fastapi import verify_session
from ..dependencies import get_db
from ..services import crud
from ..schemas import schemas


router = APIRouter()


@router.get("/studies/", response_model=List[schemas.Studies], include_in_schema=False)
def get_all_studies(db: Session = Depends(get_db), session: SessionContainer = Depends(verify_session())):
    user_lupax = crud.get_user_of_supertokens(db, session.user_id)
    return crud.get_studies(db, user_lupax.id)


@router.post('/studies/', include_in_schema=False)
async def create_studies(item: schemas.StudiesCreate, db: Session = Depends(get_db), session: SessionContainer = Depends(verify_session())):
    user_lupax = crud.get_user_of_supertokens(db, session.user_id)
    team = crud.get_team(db, item.team_id)
    item.team_id = None
    if (team):
        item.team_id = team.id
    return crud.create_studie(db=db, item=item, user_id=user_lupax.id)


@router.get("/studies/{studie_id}/", response_model=schemas.StudiesDetail, include_in_schema=False)
def get_studie(studie_id: str, db: Session = Depends(get_db), session: SessionContainer = Depends(verify_session())):
    user_lupax = crud.get_user_of_supertokens(db, session.user_id)
    db_studie = crud.get_studie(
        db, studie_id=studie_id, user_id=user_lupax.id)
    if db_studie is None:
        raise HTTPException(status_code=404, detail="Studie not found")
    return db_studie

@router.patch("/studie/{studie_id}/edit/tasks/", include_in_schema=False)
def edit_studie_publish(studie_id: str, item: schemas.StudiesTasksEdit, db: Session = Depends(get_db), session: SessionContainer = Depends(verify_session())):
    user_lupax = crud.get_user_of_supertokens(db, session.user_id)
    db_studie = crud.get_studie(db, studie_id=studie_id, user_id=user_lupax.id)
    if db_studie is None:
         raise HTTPException(status_code=404, detail="Studie not found")
    crud.edit_studie_tasks(db=db, studie_id=db_studie.id, item=item, user_id=user_lupax.id)
    return True

@router.patch("/publish/{studie_id}/", response_model=schemas.StudiesDetail, include_in_schema=False)
def edit_studie(studie_id: str, item: schemas.StudiesPublishEdit, db: Session = Depends(get_db), session: SessionContainer = Depends(verify_session())):
    user_lupax = crud.get_user_of_supertokens(db, session.user_id)
    db_studie = crud.get_studie(db, studie_id=studie_id, user_id=user_lupax.id)
    if db_studie is None:
        raise HTTPException(status_code=404, detail="Studie not found")
    crud.edit_studie(db=db, studie_id=db_studie.id, item=item, user_id=user_lupax.id)
    return crud.get_studie(db, studie_id=studie_id, user_id=user_lupax.id)


@router.get("/studie/public/{studie_id}/", response_model=schemas.StudiePublic, include_in_schema=False)
def get_studie_public(studie_id: str, db: Session = Depends(get_db)):
    db_studie = crud.get_studie_public(db, studie_id=studie_id)
    if db_studie is None:
        raise HTTPException(status_code=404, detail="Studie not found")
    return db_studie


@router.get("/available/{studie_id}/", response_model=schemas.StudiesCan, tags=["Public API lupax"])
def get_studie_public_can(studie_id: str, db: Session = Depends(get_db)):
    db_studie = crud.get_studie_public(db, studie_id=studie_id)
    if db_studie is None:
        raise HTTPException(status_code=404, detail="Studie not found")
    return db_studie
