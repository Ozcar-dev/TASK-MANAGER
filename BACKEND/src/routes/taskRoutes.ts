import { Router } from "express";
import { getAllTasks, getTask, createTask, updateTask, deleteTask, getTrashedTasks, restoreTask, permanentlyDeleteTask } from "../controllers/taskController";
import authMiddleware from "../middleware/authMiddleware";

const router = Router();

router.use(authMiddleware);

router.get("/", getAllTasks);
router.post("/", createTask);
router.get("/trash", getTrashedTasks);
router.put("/trash/:id/restore", restoreTask);
router.delete("/trash/:id", permanentlyDeleteTask);
router.get("/:id", getTask);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);

export default router;