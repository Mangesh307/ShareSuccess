import { Router } from "express";
import {
  createPostController,
  getAllPostsController,
  getPostController,
  getPostsByCategoryController,
  getUserPostsController,
  editPostController,
  deletePostController,
} from "../controllers/post.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
const router = Router();

router.post("/", authMiddleware, createPostController);
router.get("/", getAllPostsController);
router.get("/:id", getPostController);
router.patch("/:id", authMiddleware, editPostController);
router.delete("/:id", authMiddleware, deletePostController);
router.get("/categories/:category", getPostsByCategoryController);
router.get("/users/:id", getUserPostsController);

export default router;
