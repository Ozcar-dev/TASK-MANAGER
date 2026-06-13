import { useNavigate } from "react-router-dom"
import { useState } from "react";
import logo from '../assets/logo.png'
import profile from '../assets/profile.jpg'

const NavBar = () => {

  const [isOpen, setIsOpen] = useState(false);

  const navigate = useNavigate()
  return (
      <div>
        <nav className="mx-auto container flex items-center justify-between px-6 md:px-15 py-3 md:py-2 bg-indigo-100 fixed top-0 left-0 right-0 z-50">
          <div className="flex items-center">
              <img src={logo} alt="LOGO"/>
              <h1 className="text-2xl font-bold text-purple-700">TaskDuty</h1>
          </div>

          <div className="hidden md:flex items-center gap-10">
              <button onClick={() => navigate('/new-task')} className="text-gray-700 hover:text-purple-600 font-medium">New Task</button>
              <button onClick={() => navigate('/my-tasks')} className="text-gray-700 hover:text-purple-600 font-medium">All Tasks</button>
              <img className="w-8 h-8 rounded-full border-2 border-purple-400" src={profile} alt="profile"/>
          </div>

          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsOpen(!isOpen)} 
              className="text-purple-700 focus:outline-none">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {isOpen && (
            <div className="absolute top-full left-0 right-0 bg-indigo-100 flex flex-col items-center gap-5 py-6 border-t border-indigo-200 shadow-md md:hidden">
              <button onClick={() => { navigate('/new-task'); setIsOpen(false); }} className="text-gray-700 hover:text-purple-600 font-medium w-full text-center py-2">New Task</button>
              <button onClick={() => { navigate('/my-tasks'); setIsOpen(false); }} className="text-gray-700 hover:text-purple-600 font-medium w-full text-center py-2">All Tasks</button>
              <img className="w-12 h-12 rounded-full border-2 border-purple-400 mt-2" src={profile} alt="profile"/>
            </div>
          )}
        </nav>
      </div>
  )
}

export default NavBar