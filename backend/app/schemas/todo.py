from typing import Optional

from pydantic import BaseModel
from sqlmodel import SQLModel


class TodoBase(SQLModel):
    title: str
    completed: bool = False


class TodoCreate(TodoBase):
    pass


class TodoRead(TodoBase):
    id: int


class TodoUpdate(BaseModel):
    title: Optional[str] = None
    completed: Optional[bool] = None
