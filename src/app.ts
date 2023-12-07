import http from "http";
import createError from "http-errors";
import express, { Request, Response, NextFunction } from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import cors from "cors";
import "./controller/socialMediaAuth";

import indexRouter from "./routes/index";
import usersRouter from "./routes/users";
import categoryRouter from "./routes/categories";
import postRouter from "./routes/posts";
import socialAuth from "./routes/socialAuths";
import adminRouter from "./routes/admin";

import db from "./config/db.config";
import passport from "passport";
import session from "express-session";
import io from "socket.io";
import { initializeSocketIO } from "./routes/admin";

const app = express();
const server = http.createServer(app);
const socketIO = new io.Server(server);

// Initialize Socket.IO for admin dashboard
initializeSocketIO(socketIO);

// Attach Socket.IO instance to the app
app.set("socketio", socketIO);

db.sync()
	.then(() => {
		console.log("Database connected successfully!!");
		socketIO.on("connection", (socket) => {
			console.log("Client connected successfully!!");
		});
	})
	.catch((err: createError.HttpError) => {
		console.log(err);
	});

// view engine setup
app.set("views", path.join(__dirname, "..", "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(
	session({
		secret: "keyboard cat",
		resave: false,
		saveUninitialized: true,
		cookie: { secure: false },
	})
);

// Initialize Passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use("/", indexRouter);
app.use("/api/v1/user", usersRouter);
app.use("/api/v1/category", categoryRouter);
app.use("/api/v1/post", postRouter);

app.use("/", socialAuth);
app.use("/admin", adminRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use((err: createError.HttpError, req: Request, res: Response, next: NextFunction) => {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get("env") === "development" ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render("error");
});

export default app;
