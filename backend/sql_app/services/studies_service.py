from sqlalchemy.orm import Session
from ..schemas import schemas
from ..models import models


def create_studie(db: Session, item: schemas.StudiesCreate, user_id: int):
    db_item = models.Studies(**item.dict(), user_id=user_id)
    db.add(db_item)
    db.commit()
    welcome_message = models.Task(studie_id=db_item.id, type=models.EnumTaskType.welcome, index=0, move=False,
                                  welcome_message="Please take a moment to help us improve our website. We've made a new feature and would like to know what you think about it. There's no right or wrong answers and it will only take five minutes of your time. Thanks for your feedback!")
    db.add(welcome_message)
    extension_message = models.Task(
        studie_id=db_item.id, type=models.EnumTaskType.extension, index=1, move=False)
    db.add(extension_message)
    farewell_message = models.Task(studie_id=db_item.id, type=models.EnumTaskType.farewell,
                                   index=2, move=False, farewell_message="Thanks for participating!")
    db.add(farewell_message)
    db.commit()
    db.refresh(db_item)
    db.refresh(welcome_message)
    return db_item


def edit_studie(db: Session, studie_id: str, item: schemas.StudiesEdit, user_id: int):
    studie_to_edit = get_studie(db, studie_id, user_id)
    studie_edit = db.query(models.Studies).filter(
        models.Studies.id == studie_to_edit.id).update(item.dict())
    db.commit()
    return studie_edit


def edit_studie_tasks(db: Session, studie_id: str, item: schemas.StudiesTasksEdit, user_id: int):
    studie_to_edit = get_studie(db, studie_id, user_id)
    for task in item.dict()['tasks']:
        db.query(models.Task).filter(models.Task.studie_id == studie_to_edit.id).filter(
            models.Task.id == task['id']).update(task)
    db.commit()
    return True


def get_studies(db: Session, user_id: int):
    studies_me = get_studies_me(db=db, user_id=user_id).all()
    studies_teams = get_studies_teams(db=db, user_id=user_id).all()
    return studies_me + studies_teams


def get_studie(db: Session, studie_id: int, user_id: int):
    studies_me = get_studies_me(db=db, user_id=user_id).filter(
        models.Studies.id == studie_id).first()
    studies_teams = get_studies_teams(db=db, user_id=user_id).filter(
        models.Studies.id == studie_id).first()
    return studies_me or studies_teams


def have_access_studie(db: Session, studie_id: int, user_id: int):
    return bool(get_studie(db=db, studie_id=studie_id, user_id=user_id))


def get_studie_public(db: Session, studie_id: int):
    return db.query(models.Studies).filter(models.Studies.id == studie_id).first()


def get_studies_me(db: Session, user_id: int):
    return db.query(models.Studies).filter(models.Studies.user_id == user_id).filter(models.Studies.team_id == None)


def get_studies_teams(db: Session, user_id: int):
    return db.query(models.Studies).join(models.Teams).join(models.Users, models.Teams.users).filter(models.Users.id == user_id)