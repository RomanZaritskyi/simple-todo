import { TodoView } from './views/todo-view'

function App() {
  return (
    <>
      <header className="flex justify-between items-center p-3 w-full bg-gray-800 text-white">
        <h2 className="text-2xl font-bold">TODO Simple</h2>
      </header>
      <main className="flex flex-col flex-grow justify-between p-4">
        <TodoView />
      </main>

      <footer className="w-full bg-gray-800 text-white text-center py-4">
        <p>© 2023 Todo App. All rights reserved.</p>
        <p>Created by RomanZaritskyi</p>
      </footer>
    </>
  )
}

export default App
