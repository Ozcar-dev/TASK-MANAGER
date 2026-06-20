import { Router } from "express";
import { getAllTasks, getTask, createTask, updateTask, deleteTask } from "../controllers/taskController";
import authMiddleware from "../middleware/authMiddleware";

const router = Router();

router.use(authMiddleware);

router.get("/", getAllTasks);
router.post("/", createTask);
router.get("/:id", getTask);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);

export default router;