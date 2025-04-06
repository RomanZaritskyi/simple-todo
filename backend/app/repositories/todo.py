from sqlmodel import Session, select
from app.models.todo import Todo
from app.schemas.todo import TodoCreate


def get_all_todos(session: Session) -> list[Todo]:
    statement = select(Todo)
    todos = session.exec(statement).all()
    return todos

def get_todo_by_id(session: Session, todo_id: int) -> Todo | None:
    statement = select(Todo).where(Todo.id == todo_id)
    todo = session.exec(statement).one_or_none()
    return todo


def create_todo(session: Session, todo_create: TodoCreate) -> Todo:
    todo = Todo.model_validate(todo_create)
    session.add(todo)
    session.commit()
    session.refresh(todo)
    return todo
