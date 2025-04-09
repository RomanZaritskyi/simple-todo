from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session

from app.api.deps import get_session
from app.models.todo import Todo
from app.schemas.todo import TodoCreate, TodoRead, TodoUpdate
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


@router.put("/{todo_id}", response_model=Todo)
def update_todo(
    todo_id: int, todo_data: TodoUpdate, session: Session = Depends(get_session)
):
    try:
        return todo_service.update_todo_service(session, todo_id, todo_data)
    except Exception:
        raise HTTPException(status_code=404, detail="Todo not found")
    

@router.delete("/all", status_code=204)
def delete_all_todos(session: Session = Depends(get_session)) -> None:
    try:
        todo_service.delete_all_todos_service(session)
    except Exception:
        raise HTTPException(status_code=500, detail="Не вдалося видалити всі TODO")
    

@router.delete("/{todo_id}", status_code=204)
def delete_todo(todo_id: int, session: Session = Depends(get_session)) -> None:
    try:
        todo_service.delete_todo_service(session, todo_id)
    except Exception:
        raise HTTPException(status_code=404, detail="Todo not found")
    
    
