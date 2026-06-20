import { useNavigate } from "react-router-dom"
import { useState } from "react";
import logo from '../assets/logo.png'
import profile from '../assets/profile.jpg'
import { useAuth } from "../context/AuthContext";

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const handleProtectedRoute = (path: string) => {
    if (!isAuthenticated) {
      setShowModal(true);
    } else {
      navigate(path);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div>
      {/* AUTH MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl px-10 py-10 flex flex-col items-center gap-4 w-80">
            <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center">
              <div className="w-11 h-11 rounded-full bg-purple-400 flex items-center justify-center">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="8" r="4"/>
                  <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
                </svg>
              </div>
            </div>
            <h2 className="text-xl font-bold text-gray-800">Login Required</h2>
            <p className="text-sm text-gray-500 text-center">You need to be logged in to access this page.</p>
            <button
              onClick={() => { setShowModal(false); navigate('/login'); }}
              className="bg-purple-500 text-white font-semibold px-8 py-2.5 rounded-full hover:bg-purple-600 transition-colors w-full"
            >
              Go to Login
            </button>
            <button
              onClick={() => setShowModal(false)}
              className="text-gray-400 text-sm hover:text-gray-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <nav className="mx-auto container flex items-center justify-between px-6 md:px-15 py-3 md:py-2 bg-indigo-100 fixed top-0 left-0 right-0 z-50">
        <div className="flex items-center">
          <img src={logo} alt="LOGO"/>
          <h1 className="text-2xl font-bold text-purple-700">TaskDuty</h1>
        </div>

        <div className="hidden md:flex items-center gap-10">
          {isAuthenticated ? (
            <button onClick={() => handleProtectedRoute('/new-task')} className="text-gray-700 hover:text-purple-600 font-medium">New Task</button>
          ) : (
            <button onClick={() => navigate('/login')} className="text-gray-700 hover:text-purple-600 font-medium">Login</button>
          )}

          <button onClick={() => handleProtectedRoute('/my-tasks')} className="text-gray-700 hover:text-purple-600 font-medium">All Tasks</button>

          {isAuthenticated && (
            <button onClick={handleLogout} className="text-gray-700 hover:text-red-600 font-medium">Logout</button>
          )}

          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <span className="text-gray-700 font-medium text-sm">Hi, {user?.name}</span>
            )}
            <img className="w-8 h-8 rounded-full border-2 border-purple-400" src={profile} alt="profile"/>
          </div>
        </div>

        <div className="md:hidden flex items-center">
          <button onClick={() => setIsOpen(!isOpen)} className="text-purple-700 focus:outline-none">
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

            {isAuthenticated ? (
              <button onClick={() => { handleProtectedRoute('/new-task'); setIsOpen(false); }} className="text-gray-700 hover:text-purple-600 font-medium w-full text-center py-2">New Task</button>
            ) : (
              <button onClick={() => { navigate('/login'); setIsOpen(false); }} className="text-gray-700 hover:text-purple-600 font-medium w-full text-center py-2">Login</button>
            )}

            <button onClick={() => { handleProtectedRoute('/my-tasks'); setIsOpen(false); }} className="text-gray-700 hover:text-purple-600 font-medium w-full text-center py-2">All Tasks</button>

            {isAuthenticated && (
              <button onClick={() => { handleLogout(); setIsOpen(false); }} className="text-red-600 hover:text-red-700 font-medium w-full text-center py-2">Logout</button>
            )}

            <div className="flex items-center gap-2 mt-2">
              {isAuthenticated && (
                <span className="text-gray-700 font-medium text-sm">Hi, {user?.name}</span>
              )}
              <img className="w-12 h-12 rounded-full border-2 border-purple-400" src={profile} alt="profile"/>
            </div>
          </div>
        )}
      </nav>
    </div>
  );
};

export default NavBar;