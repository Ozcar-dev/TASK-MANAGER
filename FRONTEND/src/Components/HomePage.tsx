import NavBar from './NavBar'
import { useNavigate } from "react-router-dom";
import heroImg from '../assets/Hero img.png'
import { useState } from 'react';
import BeatLoader from "react-spinners/BeatLoader";

const HomePage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleNavigate = (path: string) => {
    setLoading(true);
    setTimeout(() => {
      navigate(path);
      setLoading(false);
    }, 800);
  }

  return (
    <div className="flex flex-col items-center justify-center">
      {loading && (
        <div className="fixed inset-0 bg-white/70 flex items-center justify-center z-100">
          <BeatLoader color="#7c3aed" />
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
              <button onClick={() => handleNavigate('/my-tasks')} className="bg-purple-600 hover:bg-purple-900 text-white px-8 py-3 rounded-lg font-semibold transition duration-500 w-full sm:w-auto">
                Go to My Tasks
              </button>
              <button onClick={() => handleNavigate('/new-task')} className="bg-purple-600 hover:bg-purple-900 text-white px-8 py-3 rounded-lg font-semibold transition duration-500 w-full sm:w-auto">
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
  )
}

export default HomePage