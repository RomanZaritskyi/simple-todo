import { Todo, TodoCreate, TodoModel } from '../models/todo-model'

export class TodoController {
  private todos: Todo[] = []
  private onUpdate: (todos: Todo[]) => void
  private commit() {
    this.onUpdate(this.todos)
  }
  private async safeCall(
    action: () => Promise<void>,
    rollback?: () => void,
  ): Promise<void> {
    try {
      await action()
    } catch (e) {
      if (rollback) rollback()
      this.commit()
      throw e
    }
  }

  constructor(onUpdate: (todos: Todo[]) => void) {
    this.onUpdate = onUpdate
  }

  async loadTodos(): Promise<void> {
    try {
      this.todos = await TodoModel.getAll()
      this.commit()
    } catch (error) {
      throw new Error(`Помилка при завантаженні задач: ${error}`)
    }
  }

  optimisticAddTodo(fakeTodo: Todo) {
    this.todos = [...this.todos, fakeTodo]
    this.commit()
  }

  async addTodo(todoData: TodoCreate): Promise<void> {
    const fakeTodo: Todo = {
      id: Date.now(),
      title: todoData.title,
      completed: false,
    }

    this.todos.push(fakeTodo)
    this.commit()

    await this.safeCall(
      async () => {
        const realTodo = await TodoModel.create(todoData)
        this.todos = this.todos.filter((t) => t.id !== fakeTodo.id)
        this.todos.push(realTodo)
      },
      () => {
        this.todos = this.todos.filter((t) => t.id !== fakeTodo.id)
      },
    )

    this.commit()
  }

  optimisticToggleCompleted(id: number, newCompleted: boolean) {
    this.todos = this.todos.map((t) =>
      t.id === id ? { ...t, completed: newCompleted } : t,
    )
    this.commit()
  }

  async updateCompleted(id: number, newCompleted: boolean) {
    await this.safeCall(
      async () => {
        this.optimisticToggleCompleted(id, newCompleted)
        await TodoModel.update(id, { completed: newCompleted })
      },
      () => {
        this.optimisticToggleCompleted(id, !newCompleted)
      },
    )
  }

  optimisticUpdateTodoTitle(id: number, newTitle: string) {
    this.todos = this.todos.map((t) =>
      t.id === id ? { ...t, title: newTitle } : t,
    )
    this.commit()
  }

  async updateTitle(id: number, newTitle: string): Promise<void> {
    await this.safeCall(
      async () => {
        this.optimisticUpdateTodoTitle(id, newTitle)
        await TodoModel.update(id, { title: newTitle })
      },
      () => {
        this.todos = this.todos.map((t) =>
          t.id === id ? { ...t, title: newTitle } : t,
        )
      },
    )
  }

  optimisticDeleteTodo(id: number) {
    this.todos = this.todos.filter((t) => t.id !== id)
    this.commit()
  }

  async deleteTodo(id: number): Promise<void> {
    const index = this.todos.findIndex((t) => t.id === id)
    const deletedTodo = this.todos[index]

    if (index === -1 || !deletedTodo) return

    await this.safeCall(
      async () => {
        this.optimisticDeleteTodo(id)
        await TodoModel.delete(id)
      },
      () => {
        const before = this.todos.slice(0, index)
        const after = this.todos.slice(index)
        this.todos = [...before, deletedTodo, ...after]
      },
    )
  }

  async deleteAllTodos(): Promise<void> {
    const previousTodos = [...this.todos]

    this.safeCall(
      async () => {
        this.todos = []
        this.commit()
      },
      () => {
        this.todos = previousTodos
      },
    )

    this.todos = []
    this.commit()
  }
}
