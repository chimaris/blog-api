import express from "express";
import { CreatePost, DeletePost, GetAllPost, GetOnePost, UpdatePost } from "../controller/postController";
import { Auth } from "../middleware/auth";

const router = express.Router();

router.post("/create-post", Auth, CreatePost);
router.patch("/update-post/:id", Auth, UpdatePost);
router.delete("/delete-post/:id", Auth, DeletePost);
router.get("/", GetAllPost);
router.get("/:id", GetOnePost);

export default router;
