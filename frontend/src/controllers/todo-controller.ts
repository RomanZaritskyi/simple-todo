import { Todo, TodoCreate, TodoModel } from '../models/todo-model'

export class TodoController {
  private todos: Todo[] = []
  private onUpdate: (todos: Todo[]) => void

  constructor(onUpdate: (todos: Todo[]) => void) {
    this.onUpdate = onUpdate
  }

  async loadTodos(): Promise<void> {
    try {
      this.todos = await TodoModel.getAll()
      this.onUpdate(this.todos)
    } catch (error) {
      console.error('Помилка при завантаженні задач:', error)
    }
  }

  async addTodo(todoData: TodoCreate): Promise<void> {
    try {
      const newTodo = await TodoModel.create(todoData)
      this.todos.push(newTodo)
      this.onUpdate(this.todos)
    } catch (error) {
      console.error('Помилка при створенні задачі:', error)
    }
  }

  async updateTodo(id: number, todoData: Todo): Promise<void> {
    try {
      const updatedTodo = await TodoModel.update(id, todoData)
      const index = this.todos.findIndex((todo) => todo.id === id)
      if (index !== -1) {
        this.todos[index] = updatedTodo
        this.onUpdate(this.todos)
      }
    } catch (error) {
      console.error('Помилка при оновленні задачі:', error)
    }
  }

  async deleteTodo(id: number): Promise<void> {
    try {
      await TodoModel.delete(id)
      this.todos = this.todos.filter((todo) => todo.id !== id)
      this.onUpdate(this.todos)
    } catch (error) {
      console.error('Помилка при видаленні задачі:', error)
    }
  }
  async deleteAllTodos(): Promise<void> {
    try {
      await TodoModel.deleteAll()
      this.todos = []
      this.onUpdate(this.todos)
    } catch (error) {
      console.error('Помилка при видаленні задач:', error)
    }
  }
}
