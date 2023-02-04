from fastapi import APIRouter
from typing import List
from fastapi import Depends, HTTPException
from sqlalchemy.orm import Session
from supertokens_python.recipe.session import SessionContainer
from supertokens_python.recipe.session.framework.fastapi import verify_session
from ..services import crud
from ..schemas import schemas
from ..dependencies import get_db


router = APIRouter()


@router.get('/teams/', response_model=List[schemas.Team], include_in_schema=False)
def get_all_teams(db: Session = Depends(get_db), session: SessionContainer = Depends(verify_session())):
    user_lupax = crud.get_user_of_supertokens(db, session.user_id)
    return crud.get_teams(db, user_lupax.id)


@router.get('/team/{team_id}/', response_model=schemas.Team, include_in_schema=False)
def get_team(team_id: str, db: Session = Depends(get_db), session: SessionContainer = Depends(verify_session())):
    db_team = crud.get_team(db, team_id=team_id)
    if db_team is None:
        raise HTTPException(status_code=404, detail="Team not found")
    return db_team


@router.post('/teams/', include_in_schema=False)
async def create_team(item: schemas.TeamCreate, db: Session = Depends(get_db), session: SessionContainer = Depends(verify_session())):
    user_lupax = crud.get_user_of_supertokens(db, session.user_id)
    return crud.create_team(db=db, item=item, user_id=user_lupax.id)


@router.post('/teams/association/', include_in_schema=False)
async def create_association(item: schemas.AssociationUserTeamCreate, db: Session = Depends(get_db), session: SessionContainer = Depends(verify_session())):
    user_lupax = crud.get_user_of_supertokens(db, session.user_id)
    team = crud.get_team(db=db, team_id=item.team_id)
    if team.admin_user_id != user_lupax.id:
        raise HTTPException(status_code=400, detail="User not admin")
    user_to_add = crud.get_user_by_mail(db=db, user_email=item.user_email)
    if user_to_add is None:
        raise HTTPException(status_code=200, detail="User not found")
    is_user_in_team_already = crud.is_user_in_team(
        db=db, user_id=user_to_add.id, team_id=team.id)
    if is_user_in_team_already:
        raise HTTPException(status_code=200, detail="User already in team")
    crud.create_association(db=db, user_id=user_to_add.id, team_id=team.id)
    crud.add_notification(db=db, type='team', user_id=user_to_add.id, text="{} ({}) has added you to the team '{}'.".format(
        user_lupax.name, user_lupax.email, team.name.upper()))
    return True


@router.post('/team/{team_id}/leave/', include_in_schema=False)
async def leave_team(team_id: str, db: Session = Depends(get_db), session: SessionContainer = Depends(verify_session())):
    user_lupax = crud.get_user_of_supertokens(db, session.user_id)
    crud.delete_association(db=db, user_id=user_lupax.id, team_id=team_id)
    db_team = crud.get_team(db=db, team_id=team_id)
    crud.add_notification(db=db, type='team', user_id=db_team.admin_user_id, text="{} ({}) has left the '{}' team.".format(
        user_lupax.name, user_lupax.email, db_team.name.upper()))
    return True


@router.post('/team/{team_id}/delete/user/', include_in_schema=False)
async def delete_user_of_team(team_id: str, item: schemas.DeleteUser, db: Session = Depends(get_db), session: SessionContainer = Depends(verify_session())):
    user_lupax = crud.get_user_of_supertokens(db, session.user_id)
    db_team = crud.get_team(db=db, team_id=team_id)
    if db_team.admin_user_id != user_lupax.id:
        raise HTTPException(status_code=400, detail="User not admin")
    crud.delete_association(db=db, user_id=item.user_id, team_id=team_id)
    crud.add_notification(db=db, type='team', user_id=item.user_id,
                          text="You have been eliminated from the team '{}'.".format(db_team.name.upper()))
    return True
