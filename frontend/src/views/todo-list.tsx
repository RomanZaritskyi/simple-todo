import React from 'react'
import { Todo } from '../models/todo-model'
import { TodoItem } from './todo-item'

interface TodoListProps {
  todos: Todo[]
  onToggle: (todo: Todo) => void
  onDelete: (id: number) => void
  onEdit: (todo: Todo) => void
  editingId: number | null
  draftTitle: string
  onChangeDraft: (value: string) => void
  onCancelEdit: () => void
  onSaveEdit: (id: number) => void
}

export const TodoList: React.FC<TodoListProps> = ({
  todos,
  onToggle,
  onDelete,
  onEdit,
  editingId,
  draftTitle,
  onChangeDraft,
  onCancelEdit,
  onSaveEdit,
}) => {
  return (
    <ul className="space-y-2 max-h-[300px] overflow-y-auto">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onDelete={onDelete}
          onEdit={onEdit}
          isEditing={editingId === todo.id}
          draftTitle={draftTitle}
          onChangeDraft={onChangeDraft}
          onCancelEdit={onCancelEdit}
          onSaveEdit={onSaveEdit}
        />
      ))}
    </ul>
  )
}
