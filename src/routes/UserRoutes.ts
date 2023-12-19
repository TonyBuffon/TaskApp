import express from "express";
import {
  signup,
  deleteUser,
  getMe,
  login,
  updateMe,
} from "../controllers/UserController";
import auth from "../middlewares/auth";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);

router
  .route("/me")
  .patch(auth, updateMe)
  .get(auth, getMe)
  .delete(auth, deleteUser);

export default router;
