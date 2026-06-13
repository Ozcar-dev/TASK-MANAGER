import EditTask from "./Components/EditTask"
import HomePage from "./Components/HomePage"
import MyTasks from "./Components/MyTasks"
import NewTask from "./Components/NewTask"
import { Routes, Route } from 'react-router-dom'


function App() {

  return (
    <>
    <Routes>
      <Route path="/" element={<HomePage/>} />
      <Route path="/my-tasks" element={<MyTasks/>}/>
      <Route path="/new-task" element={<NewTask/>}/>
      <Route path="/tasks/edit/:id" element={<EditTask/>} />
    </Routes>
    </>
  )
}

export default App
