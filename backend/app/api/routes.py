from fastapi import APIRouter, Depends
from sqlmodel import Session

from app.api.deps import get_session
from app.schemas.todo import TodoCreate, TodoRead
from app.services import todo as todo_service

router = APIRouter(prefix="/todos", tags=["todos"])


@router.get("/", response_model=list[TodoRead])
def read_todos(session: Session = Depends(get_session)):
    return todo_service.get_todos(session)


@router.post("/", response_model=TodoRead)
def add_todo(todo_data: TodoCreate, session: Session = Depends(get_session)):
    return todo_service.create_todo(session, todo_data)


@router.get("/{todo_id}", response_model=TodoRead)
def read_todo(todo_id: int, session: Session = Depends(get_session)):
    todo = todo_service.get_todo_by_id(session, todo_id)
    if not todo:
        return {"error": "Todo not found"}
    return todo


@router.put("/{todo_id}", response_model=TodoRead)
def update_todo(
    todo_id: int, todo_data: TodoCreate, session: Session = Depends(get_session)
):
    todo = todo_service.update_todo(session, todo_id, todo_data)
    if not todo:
        return {"error": "Todo not found"}
    return todo


@router.delete("/{todo_id}", response_model=TodoRead)
def delete_todo(todo_id: int, session: Session = Depends(get_session)):
    todo = todo_service.delete_todo(session, todo_id)
    if not todo:
        return {"error": "Todo not found"}
    return todo


@router.delete("/", response_model=list[TodoRead])
def delete_all_todos(session: Session = Depends(get_session)):
    todos = todo_service.delete_all_todos(session)
    return todos
