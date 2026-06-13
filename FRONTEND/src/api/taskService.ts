import api from "./axios";

export interface ITask {
  _id: string;
  title: string;
  description: string;
  dueDate: string;
  category: "Important" | "Completed" | "Urgent";
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskPayload {
  title: string;
  description: string;
  dueDate: string;
  category: "Urgent" | "Important" | "Completed";
  completed?: boolean;
}

// GET all tasks
export const fetchAllTasks = async (): Promise<ITask[]> => {
  const response = await api.get("/tasks");
  return response.data.tasks;
};

// GET single task
export const fetchTask = async (id: string): Promise<ITask> => {
  const response = await api.get(`/tasks/${id}`);
  return response.data.task;
};

// POST create task
export const createTask = async (payload: CreateTaskPayload): Promise<ITask> => {
  const response = await api.post("/tasks", payload);
  return response.data.task;
};

// PUT update task
export const updateTask = async (id: string, payload: Partial<CreateTaskPayload>): Promise<ITask> => {
  const response = await api.put(`/tasks/${id}`, payload);
  return response.data.task;
};

// DELETE task
export const deleteTask = async (id: string): Promise<void> => {
  await api.delete(`/tasks/${id}`);
};