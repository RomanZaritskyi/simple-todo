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

  optimisticAddTodo(fakeTodo: Todo) {
    this.todos = [...this.todos, fakeTodo]
    this.onUpdate(this.todos)
  }

  async addTodo(todoData: TodoCreate): Promise<void> {
    const fakeTodo: Todo = {
      id: Date.now(),
      title: todoData.title,
      completed: false,
    }
    this.optimisticAddTodo(fakeTodo)

    try {
      const realTodo = await TodoModel.create(todoData)

      this.todos = this.todos.filter((t) => t.id !== fakeTodo.id)
      this.todos = [...this.todos, realTodo]
      this.onUpdate(this.todos)
    } catch (error) {
      this.todos = this.todos.filter((t) => t.id !== fakeTodo.id)
      this.onUpdate(this.todos)
      throw new Error(`Помилка при створенні задачі:, ${error}`)
    }
  }

  optimisticToggleCompleted(id: number, newCompleted: boolean) {
    this.todos = this.todos.map((t) =>
      t.id === id ? { ...t, completed: newCompleted } : t,
    )
    this.onUpdate(this.todos)
  }

  async updateCompleted(id: number, newCompleted: boolean) {
    this.optimisticToggleCompleted(id, newCompleted)

    try {
      await TodoModel.update(id, { completed: newCompleted })
    } catch (error) {
      this.optimisticToggleCompleted(id, !newCompleted)
      throw `Помилка при оновленні статусу задачі ${error}`
    }
  }

  optimisticUpdateTodoTitle(id: number, newTitle: string) {
    this.todos = this.todos.map((t) =>
      t.id === id ? { ...t, title: newTitle } : t,
    )
    this.onUpdate(this.todos)
  }

  async updateTitle(id: number, newTitle: string): Promise<void> {
    this.optimisticUpdateTodoTitle(id, newTitle)
    try {
      await TodoModel.update(id, { title: newTitle })
    } catch (error) {
      this.todos = this.todos.map((t) =>
        t.id === id ? { ...t, title: newTitle } : t,
      )
      this.onUpdate(this.todos)
      throw new Error(`Помилка при редагуванні: ${error}`)
    }
  }

  optimisticDeleteTodo(id: number) {
    this.todos = this.todos.filter((t) => t.id !== id)
    this.onUpdate(this.todos)
  }

  async deleteTodo(id: number): Promise<void> {
    const index = this.todos.findIndex((t) => t.id === id)
    const deletedTodo = this.todos[index]

    if (index === -1 || !deletedTodo) return

    this.optimisticDeleteTodo(id)

    try {
      await TodoModel.delete(id)
    } catch (e) {
      const before = this.todos.slice(0, index)
      const after = this.todos.slice(index)
      this.todos = [...before, deletedTodo, ...after]
      this.onUpdate(this.todos)
      throw new Error(`Помилка при видаленні: ${e}`)
    }
  }

  async deleteAllTodos(): Promise<void> {
    const previousTodos = [...this.todos]

    this.todos = []
    this.onUpdate(this.todos)

    try {
      await TodoModel.deleteAll()
    } catch (e) {
      this.todos = previousTodos
      this.onUpdate(this.todos)
      throw new Error(`Помилка при видаленні всіх ${e}`)
    }
  }
}
