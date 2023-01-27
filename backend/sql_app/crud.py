from sqlalchemy.orm import Session
from supertokens_python.syncio import delete_user
from supertokens_python.recipe.session.syncio import revoke_all_sessions_for_user
from .database import SessionLocal
from . import models, schemas


def get_user_of_supertokens(db: Session, user_id_supertokens: int):
    return db.query(models.Users).filter(models.Users.id_supertokens == user_id_supertokens).first()


# %% STUDIES


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


# %% TASKS


def get_task_public(db: Session, task_id: int):
    return db.query(models.Task).filter(models.Task.id == task_id).first()


def create_task(db: Session, item: schemas.TaskCreate):
    db_item_task = models.Task(**item.dict())
    number_tasks = db.query(models.Studies).join(models.Task).filter(
        models.Task.studie_id == db_item_task.studie_id).first().number_tasks
    db_item_task.index = number_tasks - 1
    db.add(db_item_task)
    db.query(models.Task).filter(models.Task.studie_id == db_item_task.studie_id).filter(
        models.Task.type == models.EnumTaskType.farewell).update({'index':  number_tasks})
    db.commit()
    db.refresh(db_item_task)
    return db_item_task


def delete_task(db: Session, task_id: int):
    db.query(models.Task).filter(models.Task.id == task_id).delete()
    db.commit()
    return


def edit_task_description(db: Session, task_id: int, item: schemas.TaskEditDescription):
    task_edit = db.query(models.Task).filter(
        models.Task.id == task_id).update(item.dict())
    db.commit()
    return task_edit


def change_index(db: Session, task_id: int, new_index: int):
    db.query(models.Task).filter(models.Task.id ==
                                 task_id).update({'index':  new_index})
    db.commit()
    return


# %% PARTICIPATIONS

def create_participation(db: Session, item: schemas.ParticipationCreate):
    db_item_participation = models.Participation(**item.dict())
    db.add(db_item_participation)
    db.commit()
    db.refresh(db_item_participation)
    return db_item_participation


# %% TEAMS


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

# %% USERS


def get_user_info(db: Session, user_id_lupax: int):
    return db.query(models.Users).filter(models.Users.id == user_id_lupax).first()


def get_user_by_mail(db: Session, user_email: str):
    return db.query(models.Users).filter(models.Users.email == user_email).first()


def create_user(user_supertokens: object, name: str, last_name: str, picture: str = ""):

    try:
        session = SessionLocal()
        db_preferences = models.Preferences()
        session.add(db_preferences)
        session.commit()
        db_user = models.Users(id_supertokens=user_supertokens.user_id, email=user_supertokens.email,
                               name=name, last_name=last_name, picture=picture, preferences_id=db_preferences.id)
        session.add(db_user)
        session.commit()
        add_notification(db=session, type='app', user_id=db_user.id,
                         text="Welcome to lupax {}. Your account has been successfully created. If you have any questions, please contact us in the support tab.".format(db_user.name))
        session.commit()
        session.refresh(db_user)
        session.refresh(db_preferences)
    except Exception as error:
        session.rollback()
        delete_user_in_supertokens(supertokens_user_id=user_supertokens.user_id)
    finally:
        session.close()


def edit_preferences(db: Session, item: schemas.PreferencesEdit, user_id: int):
    db_user_me = get_user_info(db=db, user_id_lupax=user_id)
    item_changes = {
        key: value for key, value in item.dict().items() if value is not None
    }
    db.query(models.Preferences).filter_by(
        id=db_user_me.preferences_id).update(item_changes)
    db.commit()


def delete_account(db: Session, supertokens_user_id: int):
    try:
        user_lupax = get_user_of_supertokens(db, supertokens_user_id)
        db.query(models.Notifications).filter(
            models.Notifications.user_id == user_lupax.id).delete()
        db.query(models.Users).filter(
            models.Users.id_supertokens == supertokens_user_id).delete()
    except Exception as err:
        db.rollback()
        raise err
    else:
        db.commit()
        revoke_all_sessions_for_user(supertokens_user_id)
        delete_user_in_supertokens(supertokens_user_id)

def delete_user_in_supertokens(supertokens_user_id: int):
    delete_user(supertokens_user_id)



# %% STORAGE

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
    return

# %% Notifications


def create_notification(db: Session, item: schemas.PreferencesEdit):
    for user in db.query(models.Users).all():
        add_notification(db, type=item.type, text=item.text, user_id=user.id)
    return


def add_notification(db: Session, type: str, text: str, user_id: int):
    db_notification = models.Notifications(
        text=text, type=type, user_id=user_id)
    db.add(db_notification)
    db.commit()
    db.refresh(db_notification)
    return db_notification


def get_notifications(db: Session, user_id: int):
    return db.query(models.Notifications).filter(models.Notifications.user_id == user_id).filter(models.Notifications.seen == False).all()


def get_notification(db: Session, notification_id: int, user_id: int):
    return db.query(models.Notifications).filter(models.Notifications.user_id == user_id).filter(models.Notifications.id == notification_id).first()


def mark_as_viewed(db: Session, notification_id: int):
    db.query(models.Notifications).filter(
        models.Notifications.id == notification_id).update({'seen':  True})
    db.commit()
    return
