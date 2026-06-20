import NavBar from './NavBar'
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import heroImg from '../assets/Hero img.png'
import { useAuth } from "../context/AuthContext";

const HomePage = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const { isAuthenticated } = useAuth();

  const handleProtectedRoute = (path: string) => {
    if (!isAuthenticated) {
      setShowModal(true);
    } else {
      navigate(path);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">

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

      <div className="mx-auto container px-4 sm:px-6 md:px-10 lg:px-12">
        <NavBar/>

        <section className="flex flex-col-reverse md:flex-row items-center justify-between w-full pt-18 md:pt-16 lg:pt-20 gap-0 md:gap-0">
          <div className="w-full md:w-6/12 flex flex-col items-center md:items-start text-center md:text-left gap-5">
            <h2 className="text-4xl sm:text-5xl md:text-5xl lg:text-7xl tracking-wide font-bold text-[#1E2939] leading-snug">
              Stay on top of everything with<span className="block text-purple-600 mt-2">TaskDuty</span>
            </h2>
            <p className="text-[#6A7282] text-base md:text-md lg:text-lg leading-relaxed">
              Capture, prioritize, and track everything you need to do — without the clutter.
            </p>
            <div className="flex flex-col sm:flex-row gap-5 w-full sm:w-auto">
              <button
                onClick={() => handleProtectedRoute('/my-tasks')}
                className="bg-purple-600 hover:bg-purple-900 text-white px-8 py-3 rounded-lg font-semibold transition duration-500 w-full sm:w-auto"
              >
                Go to My Tasks
              </button>
              <button
                onClick={() => handleProtectedRoute('/new-task')}
                className="bg-purple-600 hover:bg-purple-900 text-white px-8 py-3 rounded-lg font-semibold transition duration-500 w-full sm:w-auto"
              >
                + Add a task
              </button>
            </div>
          </div>

          <div className="flex items-center justify-center w-full sm:w-8/12 md:w-5/12 mb-6 md:mb-0">
            <img className="w-full h-auto" src={heroImg} alt="Hero Img"/>
          </div>
        </section>
      </div>
    </div>
  );
};

export default HomePage;