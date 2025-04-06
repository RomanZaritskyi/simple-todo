import {TodoView} from './views/todo-view'

function App() {

  return (
    <>
      <div className="min-h-screen flex items-center justify-center">
        <TodoView />
      </div>
      <footer className="bg-gray-800 text-white text-center py-4">
        <p>© 2023 Todo App. All rights reserved.</p>
        <p>Created by RomanZaritskyi</p>
      </footer>
    </>
  )
}

export default App
