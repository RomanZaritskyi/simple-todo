import React from 'react'

interface AddTodoFormProps {
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
}

export const AddTodoForm: React.FC<AddTodoFormProps> = ({
  value,
  onChange,
  onSubmit,
}) => {
  return (
    <div className="flex gap-2 mb-4">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border px-2 py-1 flex-1"
        placeholder="Нова задача..."
      />
      <button
        onClick={onSubmit}
        className="bg-blue-500 text-white px-4 py-1 rounded"
      >
        Додати
      </button>
    </div>
  )
}
