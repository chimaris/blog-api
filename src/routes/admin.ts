import express from "express";
import { handleAdminEvents } from "../controller/adminController";
import { Server } from "socket.io";

const router = express.Router();

router.get("/dashboard", (req, res) => {
	res.render("dashboard");
});

export const initializeSocketIO = (io: Server) => {
	io.on("connection", (socket) => {
		console.log("Admin connected");
		handleAdminEvents(socket);
	});
};

export default router;
