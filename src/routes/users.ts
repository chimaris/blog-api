import express from "express";
import {
	DeleteUser,
	ForgetPassword,
	Login,
	Logout,
	Register,
	ResetPassword,
	UpdateUser,
	getAllUsers,
	getOneUser,
} from "../controller/userController";

const router = express.Router();

/* User's endpoints. */
router.post("/register", Register);
router.post("/login", Login);
router.get("/logout", Logout);
router.post("/forget-password", ForgetPassword);
router.patch("/reset-password/:token", ResetPassword);
router.put("/update-user/:id", UpdateUser);
router.delete("/delete-user/:id", DeleteUser);
router.get("/", getAllUsers);
router.get("/:id", getOneUser);

export default router;
