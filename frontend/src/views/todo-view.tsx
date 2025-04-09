import { useEffect, useMemo, useState } from 'react'
import { Todo, TodoCreate } from '../models/todo-model'
import { TodoController } from '../controllers/todo-controller'
import { Header } from './header'
import { AddTodoForm } from './add-todo-form'
import { TodoList } from './todo-list'

export function TodoView() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [newTodo, setNewTodo] = useState<TodoCreate>({ title: '' })
  const [editingId, setEditingId] = useState<number | null>(null)
  const [draftTitle, setDraftTitle] = useState('')

  const onUpdate = (todos: Todo[]) => setTodos(todos)
  const controller = useMemo(() => new TodoController(onUpdate), [])

  useEffect(() => {
    controller.loadTodos()
  }, [controller])

  const handleAdd = async () => {
    if (!newTodo.title.trim()) return
    try {
      await controller.addTodo(newTodo)
      setNewTodo({ title: '' })
    } catch (e) {
      alert(e)
    }
  }

  const handleToggle = async (todo: Todo) => {
    try {
      await controller.updateCompleted(todo.id, !todo.completed)
    } catch (e) {
      alert(e)
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await controller.deleteTodo(id)
    } catch (e) {
      alert(e)
    }
  }

  const handleDeleteAll = async () => {
    if (!confirm('Точно видалити всі задачі?')) return
    try {
      await controller.deleteAllTodos()
    } catch (e) {
      alert(e)
    }
  }

  const startEditing = (todo: Todo) => {
    setEditingId(todo.id)
    setDraftTitle(todo.title)
  }

  const cancelEdit = () => {
    setEditingId(null)
    setDraftTitle('')
  }

  const saveEdit = async (id: number) => {
    if (!draftTitle.trim()) return
    try {
      await controller.updateTitle(id, draftTitle)
      cancelEdit()
    } catch (e) {
      alert(e)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10">
      <Header onDeleteAll={handleDeleteAll} />
      <AddTodoForm
        value={newTodo.title}
        onChange={(value) => setNewTodo({ title: value })}
        onSubmit={handleAdd}
      />
      <TodoList
        todos={todos}
        onToggle={handleToggle}
        onDelete={handleDelete}
        onEdit={startEditing}
        editingId={editingId}
        draftTitle={draftTitle}
        onChangeDraft={setDraftTitle}
        onCancelEdit={cancelEdit}
        onSaveEdit={saveEdit}
      />
    </div>
  )
}
