from sqlmodel import Session, select

from app.models.todo import Todo
from app.schemas.todo import TodoCreate, TodoUpdate


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


def delete_todo(session: Session, todo_id: int) -> Todo | None:
    todo = get_todo_by_id(session, todo_id)
    if todo:
        session.delete(todo)
        session.commit()
    return todo


def update_todo(db: Session, todo_id: int, todo_data: TodoUpdate) -> Todo:
    todo = db.exec(Todo).filter(Todo.id == todo_id).first()
    if not todo:
        raise Exception("Todo not found")

    if todo_data.title is not None:
        todo.title = todo_data.title
    if todo_data.completed is not None:
        todo.completed = todo_data.completed

    db.commit()
    db.refresh(todo)
    return todo
