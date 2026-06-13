import { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "./NavBar";
import { createTask } from "../api/taskService";

type Tag = "Urgent" | "Important" | "Completed";

export interface NewTaskFormValues {
  title: string;
  description: string;
  tags: Tag[];
}

interface NewTaskPageProps {
  onSave?: (values: NewTaskFormValues) => void;
  onBack?: () => void;
  onAllTasks?: () => void;
}

const ALL_TAGS: Tag[] = ["Urgent", "Important", "Completed"];

const getMinDate = () => {
  const d = new Date();
  return d.toISOString().split("T")[0];
};

const NewTask = ({ onSave }: NewTaskPageProps) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [tags, setTags] = useState<Tag[]>(["Urgent"]);
    const [tagsOpen, setTagsOpen] = useState(false);
    
    const [titleError, setTitleError] = useState("");
    const [descriptionError, setDescriptionError] = useState("");
    const [dueDateError, setDueDateError] = useState("");
    const [showModal, setShowModal] = useState(false);

    const navigate = useNavigate()

    const toggleTag = (tag: Tag) => {
        setTags([tag]);
        setTagsOpen(false);
    };

  const handleDone = async () => {
    let isValid = true;

    if (!title.trim()) {
      setTitleError("Task title is required.");
      isValid = false;
    } else {
      setTitleError("");
    }

    if (!description.trim()) {
      setDescriptionError("Description is required.");
      isValid = false;
    } else {
      setDescriptionError("");
    }

    if (!dueDate) {
      setDueDateError("Due date is required.");
      isValid = false;
    } else {
      setDueDateError("");
    }

    if (isValid) {
      try {
        const resolvedCategory: "Urgent" | "Important" | "Completed" = tags.includes("Urgent") 
          ? "Urgent" 
          : tags.includes("Completed") 
          ? "Completed" 
          : "Important";

        await createTask({
          title: title.trim(),
          description: description.trim(),
          dueDate,
          category: resolvedCategory,
          completed: tags.includes("Completed")
        });

        onSave?.({ title: title.trim(), description: description.trim(), tags });
        setShowModal(true);
      } catch (error) {
        console.error(error);
        setTitleError("Failed to save task to the server. Please try again.");
      }
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    navigate('/my-tasks');
  };

  return (
    <div>
      <NavBar/>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full text-center shadow-xl animate-in fade-in zoom-in duration-200">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
              ✓
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Successful</h3>
            <p className="text-gray-500 text-sm mb-6">Your task has been added successfully.</p>
            <button
              onClick={handleModalClose}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-xl transition-all"
            >
              OK
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-col lg:flex-row max-w-7xl mx-auto items-center lg:items-start px-4 sm:px-6 md:px-12 lg:px-0 gap-6 lg:gap-0">

        {/* Image — hidden on mobile, visible on desktop */}
        <div className="hidden w-4/12 justify-center lg:block">
          <img className="w-full h-auto lg:max-w-none pt-25" src="/src/assets/Sharp_no_bg.png" alt="Pin"/>
        </div>

        <div className="flex flex-col gap-3 w-full lg:w-8/12 px-2 sm:px-4 md:px-6 lg:px-15 py-4 lg:py-20 mt-16 md:mt-20 lg:mt-0">

          <button
            onClick={() => navigate('/my-tasks')}
            className="flex items-center justify-start gap-1.5 text-violet-500 md:text-lg text-md font-medium hover:text-violet-800 transition-colors self-start"
          >
            ← Back to tasks
          </button>

          <h1 className="md:text-3xl text-2xl font-bold text-violet-500">New Task</h1>

          {/* Task Title */}
          <div className="w-full">
            <div className={`relative border rounded-md bg-white px-3 py-3 mt-2 ${titleError ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-300'}`}>
              <label className={`absolute -top-3.5 left-3 bg-white px-1 text-md ${titleError ? 'text-red-500' : 'text-gray-400'}`}>
                Task Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if(e.target.value.trim()) setTitleError("");
                }}
                placeholder="E.g Project Defense, Assignment ..."
                className="w-full text-sm text-gray-700 placeholder-gray-300 outline-none bg-transparent py-1"
              />
            </div>
            {titleError && <p className="text-red-500 text-xs mt-1 font-medium pl-1">{titleError}</p>}
          </div>

          {/* Description */}
          <div className="w-full">
            <div className={`relative border rounded-md bg-white px-3 py-3 mt-4 ${descriptionError ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-300'}`}>
              <label className={`absolute -top-3.5 left-3 bg-white px-1 text-md ${descriptionError ? 'text-red-500' : 'text-gray-400'}`}>
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  if(e.target.value.trim()) setDescriptionError("");
                }}
                placeholder="Briefly describe your task..."
                rows={6}
                className="w-full text-sm text-gray-700 placeholder-gray-300 outline-none bg-transparent resize-none py-1 leading-relaxed"
              />
            </div>
            {descriptionError && <p className="text-red-500 text-xs mt-1 font-medium pl-1">{descriptionError}</p>}
          </div>

          {/* Due Date */}
          <div className="w-full">
            <div className={`relative border rounded-md bg-white px-3 py-3 mt-2 ${dueDateError ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-300'}`}>
              <label className={`absolute -top-3.5 left-3 bg-white px-1 text-md ${dueDateError ? 'text-red-500' : 'text-gray-400'}`}>
                Due Date
              </label>
              <input
                type="date"
                min={getMinDate()}
                value={dueDate}
                onChange={(e) => {
                  setDueDate(e.target.value);
                  if(e.target.value) setDueDateError("");
                }}
                className="w-full text-sm text-gray-700 outline-none bg-transparent py-1"
              />
            </div>
            {dueDateError && <p className="text-red-500 text-xs mt-1 font-medium pl-1">{dueDateError}</p>}
          </div>

          {/* Tags */}
          <div className="relative mt-2">
            <div
              className="relative border border-gray-300 rounded-md bg-white px-3 py-5 cursor-pointer"
              onClick={() => setTagsOpen((o) => !o)}
            >
              <label className="absolute -top-3.5 left-3 bg-white px-1 text-md text-gray-400 pointer-events-none">
                Tags
              </label>
              <div className="flex items-center justify-between">
                <div className="flex gap-2 flex-wrap max-w-[90%]">
                  {tags.length === 0 && (
                    <span className="text-sm text-gray-300">Select tags…</span>
                  )}
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs font-medium px-2.5 py-0.5 rounded bg-gray-200 text-gray-600 whitespace-nowrap">
                      {tag}
                    </span>
                  ))}
                </div>
                <img className="w-4 h-4 rounded-full object-cover shrink-0" src="/src/assets/dropfig.png" alt="Drop down"/>
              </div>
            </div>

            {tagsOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setTagsOpen(false)}
                />
                <div className="absolute z-20 top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg overflow-hidden">
                  {ALL_TAGS.map((tag) => (
                    <div
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className="flex items-center justify-between px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
                    >
                      <span>{tag}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          <button
            onClick={handleDone}
            className="w-full bg-violet-600 hover:bg-violet-700 active:scale-[0.99] text-white font-semibold text-base py-4 rounded-xl transition-all mt-4">
            Done
          </button>

          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="text-center text-sm text-violet-600 hover:text-violet-800 transition-colors mt-2">
            Back To Top
          </button>
        </div>
      </div>
    </div>
  );
}

export default NewTask;