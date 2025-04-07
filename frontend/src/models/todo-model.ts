export interface Todo {
  id: number
  title: string
  completed: boolean
}

export interface TodoCreate {
  title: string
  completed?: boolean
}

const API_BASE = 'http://localhost:8000/todos/'

export class TodoModel {
  static async getAll(): Promise<Todo[]> {
    const response = await fetch(API_BASE)
    if (!response.ok) throw new Error('Помилка при завантаженні задач')
    return await response.json()
  }

  static async get(id: number): Promise<Todo> {
    const response = await fetch(`${API_BASE}${id}`)
    if (!response.ok) throw new Error('Помилка при завантаженні задачі')
    return await response.json()
  }

  static async create(todo: TodoCreate): Promise<Todo> {
    const response = await fetch(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(todo),
    })
    if (!response.ok) throw new Error('Помилка при створенні задачі')
    return await response.json()
  }

  static async update(id: number, todo: Todo): Promise<Todo> {
    const response = await fetch(`${API_BASE}${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(todo),
    })
    if (!response.ok) throw new Error('Помилка при оновленні задачі')
    return await response.json()
  }

  static async delete(id: number): Promise<void> {
    const response = await fetch(`${API_BASE}${id}`, {
      method: 'DELETE',
    })
    if (!response.ok) throw new Error('Помилка при видаленні задачі')
  }

  static async deleteAll(): Promise<void> {
    const response = await fetch(`${API_BASE}`, {
      method: 'DELETE',
    })
    if (!response.ok) throw new Error('Помилка при видаленні задач')
  }
}
