from sqlmodel import SQLModel


class TodoBase(SQLModel):
    title: str
    completed: bool = False


class TodoCreate(TodoBase):
    pass


class TodoRead(TodoBase):
    id: int
