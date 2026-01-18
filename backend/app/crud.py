from datetime import datetime
from typing import List, Optional

from sqlalchemy import case, or_
from sqlalchemy.orm import Session

from . import models, schemas


def get_task(db: Session, task_id: int) -> Optional[models.Task]:
    return db.query(models.Task).filter(models.Task.id == task_id).first()


def get_tasks(
    db: Session,
    status: str = "all",
    category: Optional[str] = None,
    search: Optional[str] = None,
    sort_by: str = "created_at",
    sort_dir: str = "desc",
) -> List[models.Task]:
    query = db.query(models.Task)

    if status == "completed":
        query = query.filter(models.Task.completed.is_(True))
    elif status == "pending":
        query = query.filter(models.Task.completed.is_(False))

    if category:
        query = query.filter(models.Task.category == category)

    if search:
        like_value = f"%{search.strip()}%"
        query = query.filter(
            or_(
                models.Task.title.ilike(like_value),
                models.Task.description.ilike(like_value),
            )
        )

    if sort_by == "title":
        sort_column = models.Task.title
    elif sort_by == "priority":
        sort_column = case(
            (models.Task.priority == "high", 3),
            (models.Task.priority == "medium", 2),
            (models.Task.priority == "low", 1),
            else_=0,
        )
    elif sort_by == "due_date":
        sort_column = models.Task.due_date
    else:
        sort_column = models.Task.created_at

    if sort_dir == "asc":
        sort_column = sort_column.asc()
    else:
        sort_column = sort_column.desc()

    return query.order_by(sort_column, models.Task.created_at.desc()).all()


def create_task(db: Session, task: schemas.TaskCreate) -> models.Task:
    now = datetime.utcnow()
    db_task = models.Task(
        title=task.title.strip(),
        description=task.description,
        priority=task.priority,
        due_date=task.due_date,
        category=task.category,
        completed=False,
        created_at=now,
        updated_at=now,
    )
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task


def update_task(
    db: Session,
    db_task: models.Task,
    task_update: schemas.TaskUpdate,
) -> models.Task:
    db_task.title = task_update.title.strip()
    db_task.description = task_update.description
    db_task.priority = task_update.priority
    db_task.due_date = task_update.due_date
    db_task.category = task_update.category
    db_task.completed = task_update.completed
    db_task.updated_at = datetime.utcnow()
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task


def toggle_task(db: Session, db_task: models.Task) -> models.Task:
    db_task.completed = not db_task.completed
    db_task.updated_at = datetime.utcnow()
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task


def delete_task(db: Session, db_task: models.Task) -> None:
    db.delete(db_task)
    db.commit()
