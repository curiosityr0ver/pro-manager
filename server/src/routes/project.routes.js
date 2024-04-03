import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { addProject, deleteTask, editTask, getSingleTask, getTasksByDuration, updateTaskState } from "../controllers/project.controller.js";

const router = Router();

//Auth Required
router.post('/', addProject);
router.put('/:projectId', verifyJWT, editTask);
router.delete('/:projectId', verifyJWT, deleteTask);
router.patch('/state/:projectId', verifyJWT, updateTaskState);
router.get('/', verifyJWT, getTasksByDuration);

//Public Call
router.get('/:projectId', getSingleTask);

export default router;