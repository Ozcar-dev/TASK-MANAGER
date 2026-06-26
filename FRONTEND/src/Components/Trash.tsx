import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchTrashedTasks, restoreTask, permanentlyDeleteTask, type ITask } from "../api/taskService";
import NavBar from "./NavBar";

const Trash = () => {
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionId, setActionId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [restoreModal, setRestoreModal] = useState(false)

  const navigate = useNavigate();

  useEffect(() => {
    const getTrashedTasks = async () => {
      setLoading(true);
      try {
        const data = await fetchTrashedTasks();
        setTasks(data);
      } catch (error) {
        console.error("Failed to fetch trashed tasks:", error);
      } finally {
        setLoading(false);
      }
    };
    getTrashedTasks();
  }, []);

  const handleRestore = async (id: string) => {
    try {
      setActionId(id);
      await restoreTask(id);
      setTasks((prev) => prev.filter((task) => task._id !== id));
      setRestoreModal(true)
    } catch (error) {
      console.error("Failed to restore task:", error);
    } finally {
      setActionId(null);
    }
  };

  const handlePermanentDelete = async (id: string) => {
    try {
      setActionId(id);
      await permanentlyDeleteTask(id);
      setTasks((prev) => prev.filter((task) => task._id !== id));
      setShowDeleteModal(true);
    } catch (error) {
      console.error("Failed to permanently delete task:", error);
    } finally {
      setActionId(null);
    }
  };

  return (
    <div>
      <NavBar />
      {/* Delete Success Confirmation Modal PopUp */}
          {showDeleteModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
              <div className="bg-white rounded-2xl p-6 max-w-sm w-full text-center shadow-xl animate-in fade-in zoom-in duration-200">
                <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                  ✓
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Task Deleted</h3>
                <p className="text-gray-500 text-sm mb-6">Your task has been permanently deleted</p>
                <button onClick={() => setShowDeleteModal(false)} className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-xl transition-all">
                  OK
                </button>
              </div>
            </div>
          )}

      {/* Restore Success Confirmation Modal PopUp */}
          {restoreModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
              <div className="bg-white rounded-2xl p-6 max-w-sm w-full text-center shadow-xl animate-in fade-in zoom-in duration-200">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                  ✓
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Task Restored</h3>
                <p className="text-gray-500 text-sm mb-6">Your task has been retrieved</p>
                <button onClick={() => setRestoreModal(false)} className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-xl transition-all">
                  OK
                </button>
              </div>
            </div>
          )}

      <div className="mx-auto container px-6 md:px-15 pt-24 pb-10">

        <div className="flex justify-between items-center pb-5">
          <div>
            <h2 className="text-4xl font-bold text-gray-900">Trash</h2>
            <p className="text-gray-500">Tasks you've deleted. Restore them or remove them forever.</p>
          </div>

          <button onClick={() => navigate('/my-tasks')} className="text-violet-600 hover:text-violet-800 font-medium">
            ← Back to tasks
          </button>
        </div>

        <div className="space-y-6">
          {loading ? (
            <p className="text-gray-500 text-center py-10">Loading trash...</p>
          ) : tasks.length === 0 ? (
            <p className="text-gray-500 text-center py-10">Trash is empty.</p>
          ) : (
            tasks.map((task) => (
              <div className="bg-white border rounded-2xl p-6 shadow-sm" key={task._id}>
                <p className={`font-semibold mb-3 ${
                  task.category === "Urgent"
                    ? "text-red-500"
                    : task.category === "Important"
                    ? "text-green-500"
                    : "text-gray-500"
                }`}>
                  {task.category}
                </p>

                <div className="flex justify-between items-center flex-wrap gap-4">
                  <div className="max-w-xl">
                    <h3 className="text-2xl font-bold text-gray-900">{task.title}</h3>
                    <p className="text-gray-500 mt-2">{task.description}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleRestore(task._id)}
                      disabled={actionId === task._id}
                      className="bg-violet-600 hover:bg-violet-700 text-white px-5 py-2 rounded-lg disabled:opacity-60"
                    >
                      Restore
                    </button>
                    <button
                      onClick={() => handlePermanentDelete(task._id)}
                      disabled={actionId === task._id}
                      className="border border-red-300 text-red-600 px-3 py-2 rounded-lg hover:bg-red-50 disabled:opacity-60">
                      Permanently Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Trash;