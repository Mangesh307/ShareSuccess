import { Router } from "express";
import {
  changeAvatarController,
  editUserController,
  getAuthorsController,
  getUserController,
  loginController,
  registerController,
} from "../controllers/user.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
const router = Router();

router.post("/register", registerController);
router.post("/login", loginController);
router.get("/:id", getUserController);
router.get("/", getAuthorsController);
router.post("/change-avatar", authMiddleware, changeAvatarController);
router.patch("/edit-user", authMiddleware, editUserController);

export default router;
