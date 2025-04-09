import React from 'react'
import { Todo } from '../models/todo-model'
import { TrashIcon } from 'lucide-react'

interface TodoItemProps {
  todo: Todo
  onToggle: (todo: Todo) => void
  onDelete: (id: number) => void
  onEdit: (todo: Todo) => void
  isEditing: boolean
  draftTitle: string
  onChangeDraft: (value: string) => void
  onCancelEdit: () => void
  onSaveEdit: (id: number) => void
}

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  onToggle,
  onDelete,
  onEdit,
  isEditing,
  draftTitle,
  onChangeDraft,
  onCancelEdit,
  onSaveEdit,
}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') onSaveEdit(todo.id)
    if (e.key === 'Escape') onCancelEdit()
  }

  return (
    <li className="flex items-center justify-between border-b py-1">
      {isEditing ? (
        <input
          className="border px-2 py-1 flex-1 mr-2"
          value={draftTitle}
          onChange={(e) => onChangeDraft(e.target.value)}
          onBlur={() => onSaveEdit(todo.id)}
          onKeyDown={handleKeyDown}
          autoFocus
        />
      ) : (
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => onToggle(todo)}
            />
            <span
              onDoubleClick={() => onEdit(todo)}
              className={todo.completed ? 'line-through text-gray-400' : ''}
            >
              {todo.title}
            </span>
          </div>
          <button onClick={() => onDelete(todo.id)}>
            <TrashIcon className="w-4 h-4" />
          </button>
        </div>
      )}
    </li>
  )
}
