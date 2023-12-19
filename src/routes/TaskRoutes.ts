import express from "express";
import {
  createTask,
  deleteTask,
  editTask,
  getTask,
  getAllTasks,
} from "../controllers/TaskController";
import auth from "../middlewares/auth";

const router = express.Router();

router.route("/").get(auth, getAllTasks).post(auth, createTask);

router
  .route("/:id")
  .get(auth, getTask)
  .patch(auth, editTask)
  .delete(auth, deleteTask);

export default router;
