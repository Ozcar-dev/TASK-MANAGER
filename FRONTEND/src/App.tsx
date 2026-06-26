import EditTask from "./Components/EditTask"
import HomePage from "./Components/HomePage"
import Login from "./Components/Login"
import MyTasks from "./Components/MyTasks"
import NewTask from "./Components/NewTask"
import { Routes, Route } from 'react-router-dom'
import ProtectedRoute from "./Components/ProtectedRoute"
import ForgotPassword from "./Components/ForgotPassword"
import ResetPassword from "./Components/ResetPassword"
import Trash from "./Components/Trash"


function App() {

  return (
    <>
    <Routes>
      <Route path="/" element={<HomePage/>} />
      <Route path="/my-tasks" element={<ProtectedRoute><MyTasks/></ProtectedRoute>}/>
      <Route path="/new-task" element={<ProtectedRoute><NewTask/></ProtectedRoute>}/>
      <Route path="/tasks/edit/:id" element={<ProtectedRoute><EditTask/></ProtectedRoute>}/>
      <Route path="/trash" element={<ProtectedRoute><Trash/></ProtectedRoute>}/>
      <Route path="/login" element={<Login/>}/>
      <Route path="/forgot-password" element={<ForgotPassword/>}/>
      <Route path="/reset-password/:token" element={<ResetPassword/>}/>
    </Routes>
    </>
  )
}

export default App
