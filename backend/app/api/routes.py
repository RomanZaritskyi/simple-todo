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
