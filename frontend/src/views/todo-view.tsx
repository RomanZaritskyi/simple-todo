import { useEffect, useState } from 'react'
import { Todo, TodoCreate } from '../models/todo-model'
import { TodoController } from '../controllers/todo-controller'
// import { Pencil, Trash2, Save, XCircle } from 'lucide-react'

export function TodoView() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [newTodo, setNewTodo] = useState<TodoCreate>({ title: '' })
  // const [editingId, setEditingId] = useState<number | null>(null)
  // const [editingTitle, setEditingTitle] = useState('')

  const onUpdate = (todos: Todo[]) => {
    setTodos((prev) => {
      return [...prev, ...todos.filter((t) => !prev.some((p) => p.id === t.id))]
    })
  }
  const controller = new TodoController(onUpdate)

  useEffect(() => {
    controller.loadTodos()
  }, [])

  // const startEdit = (todo: Todo) => {
  //   setEditingId(todo.id)
  //   setEditingTitle(todo.title)
  // }

  // const saveEdit = async () => {
  //   if (editingId !== null && todoToUpdate !== null) {
  //     await controller.updateTodo(editingId, todoToUpdate)
  //     setEditingId(null)
  //     setEditingTitle('')
  //   }
  // }

  // const cancelEdit = () => {
  //   setEditingId(null)
  //   setEditingTitle('')
  // }

  // const handleDelete = async (id: number) => {
  //   if (confirm('Точно видалити цю задачу?')) {
  //     await controller.deleteTodo(id)
  //   }
  // }\

  const toggleCompleted = async (todo: Todo) => {
    await controller.updateTodo(todo.id, { completed: !todo.completed })
  }

  const handleAdd = async () => {
    if (newTodo.title.trim() === '') return
    const todo: TodoCreate = { title: newTodo.title }
    await controller.addTodo(todo)
    setNewTodo({ title: '' })
  }

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Todo List</h1>

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
            {/* {editingId === todo.id ? (
              <>
                <input
                  className="border px-2 py-1 flex-1 mr-2"
                  value={editingTitle}
                  onChange={(e) => setEditingTitle(e.target.value)}
                />
                <div className="flex gap-2">
                  <button onClick={() => saveEdit(todo)}>
                    <Save size={18} />
                  </button>
                  <button onClick={cancelEdit}>
                    <XCircle size={18} />
                  </button>
                </div>
              </>
            ) : ( */}
            <>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleCompleted(todo)}
                />
                <span>{todo.title}</span>
              </div>
              {/* <div className="flex gap-2">
                  <button onClick={() => startEdit(todo)}>
                    <Pencil size={18} />
                  </button>
                  <button onClick={() => handleDelete(todo.id)}>
                    <Trash2 size={18} className="text-red-500" />
                  </button>
                </div> */}
            </>
            {/* )} */}
          </li>
        ))}
      </ul>
    </div>
  )
}
