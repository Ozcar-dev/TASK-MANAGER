import NavBar from "./NavBar"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom";
import { fetchAllTasks, deleteTask, type ITask } from "../api/taskService";
import BeatLoader from "react-spinners/BeatLoader";

const MyTasks = () => {
  const [tasks, setTasks] = useState<ITask[]>([])
  const [loading, setLoading] = useState(false)
  const [navigating, setNavigating] = useState(false)
  const [activeFilter, setActiveFilter] = useState<"All" | "Urgent" | "Important" | "Completed">("All")
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true)
      try {
        const data = await fetchAllTasks()
        setTasks(data)
      } catch (error) {
        console.error("Failed to fetch tasks:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchTasks()
  }, [])

  const urgentCount = tasks.filter(task => task.category === "Urgent").length
  const importantCount = tasks.filter(task => task.category === "Important").length
  const completedCount = tasks.filter(task => task.completed === true).length
  const allCount = tasks.length

  const filteredTasks = tasks.filter(task => {
    if (activeFilter === "Urgent") return task.category === "Urgent"
    if (activeFilter === "Important") return task.category === "Important"
    if (activeFilter === "Completed") return task.completed === true
    return true
  })

  const navigate = useNavigate();

  const handleNavigate = (path: string) => {
    setNavigating(true);
    setTimeout(() => {
      navigate(path);
      setNavigating(false);
    }, 800);
  }

  const handleEdit = (id: string): void => {
    handleNavigate(`/tasks/edit/${id}`);
  };

  const handleDeleteTask = async (id: string) => {
    try {
      await deleteTask(id);
      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== id));
      setShowDeleteModal(true);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      {navigating && (
        <div className="fixed inset-0 bg-white/70 flex items-center justify-center z-100">
          <BeatLoader color="#7c3aed" />
        </div>
      )}
      <div className="mx-auto container">
        <NavBar/>
        <div className="mx-auto container bg-white rounded-3xl px-4 sm:px-6 md:px-12 w-full pt-17 md:pt-20">

          {showDeleteModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
              <div className="bg-white rounded-2xl p-6 max-w-sm w-full text-center shadow-xl animate-in fade-in zoom-in duration-200">
                <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">✓</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Deleted</h3>
                <p className="text-gray-500 text-sm mb-6">Your task has been deleted successfully.</p>
                <button onClick={() => setShowDeleteModal(false)} className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-xl transition-all">OK</button>
              </div>
            </div>
          )}

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-5 gap-4 md:gap-0">
            <div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900">My Tasks</h2>
              <p className="text-gray-500 leading-normal md:leading-12 mt-1">Stay on top of your tasks and never miss a deadline.</p>
            </div>
            <button onClick={() => handleNavigate('/new-task')} className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold w-full md:w-auto text-center">
              + Add New Task
            </button>
          </div>

          <div className="md:flex flex-row gap-3 pb-3 mb-8 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap grid grid-cols-2">
            <button onClick={() => setActiveFilter("All")} className={`flex items-center gap-2 md:gap-3 border px-4 md:px-5 py-2 md:py-3 rounded-xl font-medium whitespace-nowrap text-sm md:text-base ${activeFilter === "All" ? "border-2 border-purple-300 bg-purple-50 text-purple-600" : "border-gray-200"}`}>
              All Tasks
              <span className={`px-2 py-0.5 md:py-1 rounded-full text-xs md:text-sm ${activeFilter === "All" ? "bg-purple-500 text-white" : "bg-gray-100 text-gray-600"}`}>{allCount}</span>
            </button>
            <button onClick={() => setActiveFilter("Urgent")} className={`flex items-center gap-2 md:gap-3 border px-4 md:px-5 py-2 md:py-3 rounded-xl whitespace-nowrap text-sm md:text-base ${activeFilter === "Urgent" ? "border-2 border-purple-300 bg-purple-50" : "border-gray-200"}`}>
              <span className="text-red-500 font-medium">Urgent</span>
              <span className="bg-red-100 text-red-500 px-2 py-0.5 md:py-1 rounded-full text-xs md:text-sm">{urgentCount}</span>
            </button>
            <button onClick={() => setActiveFilter("Important")} className={`flex items-center gap-2 md:gap-3 border px-4 md:px-5 py-2 md:py-3 rounded-xl whitespace-nowrap text-sm md:text-base ${activeFilter === "Important" ? "border-2 border-purple-300 bg-purple-50" : "border-gray-200"}`}>
              <span className="text-green-500 font-medium">Important</span>
              <span className="bg-green-100 text-green-500 px-2 py-0.5 md:py-1 rounded-full text-xs md:text-sm">{importantCount}</span>
            </button>
            <button onClick={() => setActiveFilter("Completed")} className={`flex items-center gap-2 md:gap-3 border px-4 md:px-5 py-2 md:py-3 rounded-xl whitespace-nowrap text-sm md:text-base ${activeFilter === "Completed" ? "border-2 border-purple-300 bg-purple-50" : "border-gray-200"}`}>
              <span className="font-medium text-gray-700">Completed</span>
              <span className="bg-gray-100 text-gray-600 px-2 py-0.5 md:py-1 rounded-full text-xs md:text-sm">{completedCount}</span>
            </button>
          </div>

          <div className="space-y-6">
            {loading ? (
              <p className="text-gray-500 text-center py-10">Loading tasks...</p>
            ) : filteredTasks.length === 0 ? (
              <p className="text-gray-400 text-center py-10">No tasks found for this category.</p>
            ) : (
              filteredTasks.map((task) => (
                <div className={`bg-white border border-l-4 rounded-2xl p-4 md:py-4 md:px-6 shadow-sm w-full ${task.completed ? "border-l-gray-400 opacity-75" : task.category === "Urgent" ? "border-l-red-500" : task.category === "Important" ? "border-l-green-500" : "border-l-gray-300"}`} key={task._id}>
                  <div className="flex justify-between items-center mb-1">
                    <p className={`font-semibold text-sm md:text-base ${task.completed ? "text-gray-400 line-through" : task.category === "Urgent" ? "text-red-500" : task.category === "Important" ? "text-green-500" : "text-gray-500"}`}>
                      {task.completed ? "✓ Completed" : `+ ${task.category}`}
                    </p>
                    <div className="flex items-center gap-2 md:gap-3">
                      <button onClick={() => handleEdit(task._id)} className="bg-purple-600 hover:bg-purple-700 text-white px-4 md:px-5 py-1.5 rounded-lg text-sm md:text-base">Edit</button>
                      <button onClick={() => handleDeleteTask(task._id)} className="border border-purple-300 text-purple-600 px-3 py-1.5 rounded-lg hover:bg-purple-50 text-sm md:text-base">Delete</button>
                    </div>
                  </div>
                  <div className="flex flex-col justify-between items-start gap-2">
                    <div className="w-full">
                      <h3 className={`text-xl md:text-2xl font-semibold text-gray-900 ${task.completed ? "line-through text-gray-400" : ""}`}>{task.title}</h3>
                      <p className="text-gray-500 mt-1 text-sm md:text-md">{task.description}</p>
                    </div>
                    {task.dueDate && (
                      <div className="w-full border-t md:border-0 pt-2 md:pt-0">
                        <span className="text-gray-500 text-sm md:text-base">{task.dueDate}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MyTasks