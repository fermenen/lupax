from sqlalchemy.orm import Session
from .users_service import get_user_info
from ..schemas import schemas
from ..models import models

def get_teams(db: Session, user_id: int):
    return db.query(models.Users).filter(models.Users.id == user_id).first().teams


def get_team(db: Session, team_id: int):
    return db.query(models.Teams).filter(models.Teams.id == team_id).first()


def create_team(db: Session, item: schemas.TeamCreate, user_id: int):
    db_team = models.Teams(**item.dict(), admin_user_id=user_id)
    db.add(db_team)
    db.commit()
    db.refresh(db_team)
    create_association(db=db, user_id=user_id, team_id=db_team.id)
    return db_team


def create_association(db: Session, user_id: int, team_id: int):
    user = get_user_info(db, user_id)
    team = get_team(db, team_id)
    if user and team:
        team.users.append(user)
        db.commit()
    else:
        raise Exception("User or Team not exist")


def delete_association(db: Session, user_id: int, team_id: int):
    new_associations = list(
        filter(lambda user: user.id != user_id, get_team(db=db, team_id=team_id).users))
    get_team(db=db, team_id=team_id).users = new_associations
    db.commit()
    return


def is_user_in_team(db: Session, user_id: int, team_id: int):
    user = db.query(models.Teams).join(models.Users, models.Teams.users).filter(
        models.Teams.id == team_id).filter(models.Users.id == user_id).first()
    return bool(user)