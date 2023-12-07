import express from "express";
import { CreateCategory, DeleteCategory, GetAllCategory, GetOneCategory, UpdateCategory } from "../controller/categoryController";
import { Auth } from "../middleware/auth";

const router = express.Router();

router.post("/create-category", Auth, CreateCategory);
router.patch("/update-category/:id", Auth, UpdateCategory);
router.delete("/delete-category/:id", Auth, DeleteCategory);
router.get("/", GetAllCategory);
router.get("/:id", GetOneCategory);

export default router;
