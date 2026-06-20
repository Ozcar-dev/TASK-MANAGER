import { Response } from "express";
import Task from "../models/task";
import { AuthRequest } from "../middleware/authMiddleware";

// GET ALL TASKS
export const getAllTasks = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const tasks = await Task.find({ createdBy: req.user?._id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: tasks.length,
      tasks,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET SINGLE TASK
export const getTask = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const task = await Task.findOne({ _id: req.params.id, createdBy: req.user?._id });

    if (!task) {
      res.status(404).json({ success: false, message: "Task not found" });
      return;
    }

    res.status(200).json({ success: true, task });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// CREATE TASK
export const createTask = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { title, description, dueDate, category, completed } = req.body;

    const existingTitle = await Task.findOne({ title, createdBy: req.user?._id });
    if (existingTitle) {
      res.status(400).json({ success: false, message: "Task title already exists" });
      return;
    }

    const task = await Task.create({
      title,
      description,
      dueDate: new Date(dueDate),
      category,
      completed: completed === "true" || completed === true || false,
      createdBy: req.user?._id,
    });

    res.status(201).json({
      success: true,
      message: "Task created successfully",
      task,
    });
  } catch (error) {
    console.error("Create task error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// UPDATE TASK
export const updateTask = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const task = await Task.findOne({ _id: req.params.id, createdBy: req.user?._id });

    if (!task) {
      res.status(404).json({ success: false, message: "Task not found" });
      return;
    }

    const { title, description, dueDate, category, completed } = req.body;

    const updateData: Record<string, unknown> = {};

    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (dueDate !== undefined) updateData.dueDate = new Date(dueDate);
    if (category !== undefined) updateData.category = category;
    if (completed !== undefined) {
      updateData.completed = completed === "true" || completed === true;
    }

    const updated = await Task.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { returnDocument: "after", runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "Task updated successfully",
      task: updated,
    });
  } catch (error) {
    console.error("Update task error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      ...(process.env.NODE_ENV === "development" && {
        error: (error as Error).message,
      }),
    });
  }
};

// DELETE TASK
export const deleteTask = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, createdBy: req.user?._id });

    if (!task) {
      res.status(404).json({ success: false, message: "Task not found" });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    console.error("Delete task error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};