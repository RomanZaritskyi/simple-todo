import React from 'react'

interface HeaderProps {
  onDeleteAll: () => void
}

export const Header: React.FC<HeaderProps> = ({ onDeleteAll }) => {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-xl font-bold">Мої задачі</h2>
      <button
        onClick={onDeleteAll}
        className="text-sm text-red-500 hover:underline"
      >
        🗑 Видалити всі
      </button>
    </div>
  )
}
