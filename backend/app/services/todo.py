from sqlmodel import Session

from app.models.todo import Todo
from app.repositories import todo as todo_repo
from app.schemas.todo import TodoCreate, TodoUpdate


def get_todos(session: Session) -> list[Todo]:
    return todo_repo.get_all_todos(session)


def create_todo(session: Session, todo_data: TodoCreate) -> Todo:
    return todo_repo.create_todo(session, todo_data)


def get_todo_by_id(session: Session, todo_id: int) -> Todo | None:
    return todo_repo.get_todo_by_id(session, todo_id)


def update_todo_service(session: Session, todo_id: int, data: TodoUpdate) -> Todo:
    return todo_repo.update_todo(session, todo_id, data)


def delete_todo_service(session: Session, todo_id: int) -> None:
    return todo_repo.delete_todo(session, todo_id)


def delete_all_todos_service(session: Session) -> None:
    return todo_repo.delete_all_todos(session)