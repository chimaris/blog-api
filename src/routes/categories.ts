import express from "express";
import { CreateCategory, DeleteCategory, GetAllCategory, GetOneCategory, UpdateCategory } from "../controller/categoryController";

const router = express.Router();

router.post("/create-category", CreateCategory);
router.patch("/update-category/:id", UpdateCategory);
router.delete("/delete-category/:id", DeleteCategory);
router.get("/", GetAllCategory);
router.get("/:id", GetOneCategory);

export default router;
