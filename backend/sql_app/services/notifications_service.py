from sqlalchemy.orm import Session
from ..schemas import schemas
from ..models import models


def create_notification(db: Session, item: schemas.PreferencesEdit):
    for user in db.query(models.Users).all():
        add_notification(db, type=item.type, text=item.text, user_id=user.id)


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
