import { useEffect, useMemo, useState } from 'react'
import { Todo, TodoCreate } from '../models/todo-model'
import { TodoController } from '../controllers/todo-controller'
import { TrashIcon } from 'lucide-react'

export function TodoView() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [newTodo, setNewTodo] = useState<TodoCreate>({ title: '' })
  const [editingId, setEditingId] = useState<number | null>(null)
  const [draftTitle, setDraftTitle] = useState('')

  const onUpdate = (todos: Todo[]) => {
    setTodos(todos)
  }
  const controller = useMemo(() => new TodoController(onUpdate), [])

  useEffect(() => {
    controller.loadTodos()
  }, [controller])

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
    } catch (e) {
      alert(e)
    } finally {
      cancelEdit()
    }
  }

  const toggleCompleted = async (todo: Todo) => {
    const newStatus = !todo.completed

    try {
      await controller.updateCompleted(todo.id, newStatus)
    } catch (error) {
      alert(`Помилка при оновленні статусу задачі ${error}`)
    }
  }
  const handleAdd = async () => {
    try {
      if (newTodo.title.trim() === '') return

      const todo: TodoCreate = { title: newTodo.title }

      await controller.addTodo(todo)
      setNewTodo({ title: '' })
    } catch (error) {
      alert(`Помилка при створенні задачі ${error}`)
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await controller.deleteTodo(id)
    } catch (error) {
      alert(`Помилка при видаленні задачі ${error}`)
    }
  }

  const handleDeleteAll = async () => {
    if (!confirm('Ти впевнений, що хочеш видалити всі задачі?')) return

    try {
      await controller.deleteAllTodos()
    } catch (error) {
      alert(error)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Мої задачі</h2>
        <button
          onClick={handleDeleteAll}
          className="text-sm text-red-500 hover:underline"
        >
          🗑 Видалити всі
        </button>
      </div>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={newTodo.title}
          onChange={(e) =>
            setNewTodo((prev) => ({ ...prev, title: e.target.value }))
          }
          className="border px-2 py-1 flex-1"
          placeholder="Нова задача..."
        />
        <button
          onClick={handleAdd}
          className="bg-blue-500 text-white px-4 py-1 rounded"
        >
          Додати
        </button>
      </div>

      <ul className="space-y-2 max-h-[300px] overflow-y-auto">
        {todos.map((todo) => (
          <li
            key={todo.id}
            className="flex items-center justify-between border-b py-1"
          >
            {editingId === todo.id ? (
              <>
                <input
                  className="border px-2 py-1 flex-1 mr-2"
                  value={draftTitle}
                  onChange={(e) => setDraftTitle(e.target.value)}
                  onBlur={() => saveEdit(todo.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') saveEdit(todo.id)
                    if (e.key === 'Escape') cancelEdit()
                  }}
                  autoFocus
                />
              </>
            ) : (
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleCompleted(todo)}
                  />
                  <span onDoubleClick={() => startEditing(todo)}>
                    {todo.title}
                  </span>
                </div>
                <button onClick={() => handleDelete(todo.id)}>
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
