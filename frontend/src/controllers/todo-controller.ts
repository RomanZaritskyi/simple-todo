import { Todo, TodoCreate, TodoModel } from "../models/todo-model";

export class TodoController {
  private todos: Todo[] = [];
  private onUpdate: (todos: Todo[]) => void;

  constructor(onUpdate: (todos: Todo[]) => void) {
    this.onUpdate = onUpdate;
  }

  async loadTodos(): Promise<void> {
    try {
      this.todos = await TodoModel.getAll();
      this.onUpdate(this.todos);
    } catch (error) {
      console.error("Помилка при завантаженні задач:", error);
    }
  }


  async addTodo(todoData: TodoCreate): Promise<void> {
    try {
      const newTodo = await TodoModel.create(todoData);
      this.todos.push(newTodo);
      this.onUpdate(this.todos);
    } catch (error) {
      console.error("Помилка при створенні задачі:", error);
    }
  }
}
