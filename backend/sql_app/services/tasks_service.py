from sqlalchemy.orm import Session
from ..schemas import schemas
from ..models import models


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


def edit_task_description(db: Session, task_id: int, item: schemas.TaskEditDescription):
    task_edit = db.query(models.Task).filter(
        models.Task.id == task_id).update(item.dict())
    db.commit()
    return task_edit


def change_index(db: Session, task_id: int, new_index: int):
    db.query(models.Task).filter(models.Task.id ==
                                 task_id).update({'index':  new_index})
    db.commit()