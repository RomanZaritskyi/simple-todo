export interface Todo {
  id: number
  title: string
  completed: boolean
}

export interface TodoCreate {
  title: string
}

const API_BASE = 'http://localhost:8000/todos/'

function handleError(message: string, response: Response) {
  if (!response.ok) throw new Error(message)
}

export class TodoModel {
  static async getAll(): Promise<Todo[]> {
    const response = await fetch(API_BASE)
    handleError('Something went wrong when downloading', response)
    return await response.json()
  }

  static async get(id: number): Promise<Todo> {
    const response = await fetch(`${API_BASE}${id}`)
    handleError('Something went wrong when downloading', response)
    return await response.json()
  }

  static async create(todo: TodoCreate): Promise<Todo> {
    const response = await fetch(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(todo),
    })
    handleError('Something went wrong when creating', response)
    return await response.json()
  }

  static async update(id: number, todo: Partial<Todo>): Promise<Todo> {
    const response = await fetch(`${API_BASE}${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(todo),
    })
    handleError('Something went wrong when updating', response)
    return await response.json()
  }

  static async delete(id: number): Promise<void> {
    const response = await fetch(`${API_BASE}${id}`, { method: 'DELETE' })
    handleError('Something went wrong when deleting', response)
  }

  static async deleteAll(): Promise<void> {
    const response = await fetch(`${API_BASE}all`, {
      method: 'DELETE',
    })
    handleError('Something went wrong when deleting all', response)
  }
}
