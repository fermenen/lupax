from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from supertokens_python.recipe.session import SessionContainer
from supertokens_python.recipe.session.framework.fastapi import verify_session
from supertokens_python.syncio import get_users_newest_first
from ..services import users_service, notifications_service
from ..schemas import schemas
from ..models import models
from ..dependencies import get_db

router = APIRouter(
    prefix="/admin",
    responses={404: {"description": "Not admin"}},
)


@router.get("/metrics/", include_in_schema=False)
def get_metrics(db: Session = Depends(get_db), session: SessionContainer = Depends(verify_session())):
    user_lupax = users_service.get_user_of_supertokens(db, session.user_id)
    if user_lupax and user_lupax.role == 'admin':
        count_users = db.query(models.Users).filter(
            models.Users.role == 'user').count()
        count_studies_teams = db.query(models.Studies).join(models.Teams).join(
            models.Users, models.Teams.users).filter(models.Users.role == 'user').count()
        count_studies_user = db.query(models.Studies).join(models.Users).filter(
            models.Studies.team_id == None).filter(models.Users.role == 'user').count()
        data = {
            'count_users': count_users,
            'count_studies_teams': count_studies_teams,
            'count_studies_user': count_studies_user
        }
        return data
    else:
        raise HTTPException(status_code=404)


@router.get("/users/", include_in_schema=False)
def get_users(db: Session = Depends(get_db), session: SessionContainer = Depends(verify_session())):
    user_lupax = users_service.get_user_of_supertokens(db, session.user_id)
    if user_lupax and user_lupax.role == 'admin':
        users_response = get_users_newest_first()
        for index, user in enumerate(users_response.users):
            users_response.users[index] = {
                'supertokens': user, "lupax": users_service.get_user_of_supertokens(db, user.user_id)}
        return users_response
    else:
        raise HTTPException(status_code=404)


@router.post("/delete/user/", include_in_schema=False)
def delete_user_lupax_supertokens(item: schemas.DeleteUser, db: Session = Depends(get_db), session: SessionContainer = Depends(verify_session())):
    user_lupax = users_service.get_user_of_supertokens(
        db=db, user_id_supertokens=session.user_id)
    if user_lupax and user_lupax.role == 'admin':
        return users_service.delete_account(db, supertokens_user_id=item.user_id)
    else:
        raise HTTPException(status_code=404)


@router.post("/create_notification/", include_in_schema=False)
def create_notification(item: schemas.CreateNotification, db: Session = Depends(get_db), session: SessionContainer = Depends(verify_session())):
    user_lupax = users_service.get_user_of_supertokens(db, session.user_id)
    if user_lupax and user_lupax.role == 'admin':
        return notifications_service.create_notification(db, item)
    else:
        raise HTTPException(status_code=404)
