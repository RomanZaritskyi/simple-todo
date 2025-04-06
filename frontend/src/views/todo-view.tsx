import { useEffect, useState } from "react";
import { Todo, TodoCreate } from "../models/todo-model";
import { TodoController } from "../controllers/todo-controller";

export function TodoView() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState("");
  const controller = new TodoController(setTodos);

  useEffect(() => {
    controller.loadTodos();
  }, []);

  const handleAdd = async () => {
    if (title.trim() === "") return;
    const newTodo: TodoCreate = { title };
    await controller.addTodo(newTodo);
    setTitle("");
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Todo List</h1>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border px-2 py-1 flex-1"
          placeholder="Нова задача..."
        />
        <button onClick={handleAdd} className="bg-blue-500 text-white px-4 py-1 rounded">
          Додати
        </button>
      </div>

      <ul className="space-y-2">
        {todos.map((todo) => (
          <li key={todo.id} className="flex items-center gap-2">
            <input type="checkbox" checked={todo.completed} readOnly />
            <span>{todo.title}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
