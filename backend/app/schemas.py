from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field, validator


class TaskBase(BaseModel):
    title: str = Field(..., max_length=255)
    description: Optional[str] = None
    priority: Optional[str] = None
    due_date: Optional[datetime] = None
    category: Optional[str] = None

    @validator("title")
    def title_not_empty(cls, value: str) -> str:
        trimmed = value.strip()
        if not trimmed:
            raise ValueError("Title must not be empty")
        return trimmed


class TaskCreate(TaskBase):
    pass


class TaskUpdate(BaseModel):
    title: str = Field(..., max_length=255)
    description: Optional[str] = None
    priority: Optional[str] = None
    due_date: Optional[datetime] = None
    category: Optional[str] = None
    completed: bool

    @validator("title")
    def title_not_empty(cls, value: str) -> str:
        trimmed = value.strip()
        if not trimmed:
            raise ValueError("Title must not be empty")
        return trimmed


class TaskOut(BaseModel):
    id: int
    title: str
    description: Optional[str] = None
    completed: bool
    priority: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    due_date: Optional[datetime] = None
    category: Optional[str] = None

    class Config:
        orm_mode = True


class TaskStats(BaseModel):
    total: int
    completed: int
    pending: int
    completion_rate: float
