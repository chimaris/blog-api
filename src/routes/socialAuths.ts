import express, { Request, Response, NextFunction } from "express";
import passport from "passport";

const router = express.Router();

// Initiate Twitter login
router.get("/twitter", passport.authenticate("twitter", { scope: ["email", "profile"] }));

// Twitter callback route
router.get("/social-login/twitter/callback", passport.authenticate("twitter", { failureRedirect: "/" }), (req, res) => {
	// Successful authentication logic
	const userProfile = req.user; // req.user should contain user details
	res.send(userProfile);
	res.redirect("/");
});

// Initiate Google login //
router.get("/google", passport.authenticate("google", { scope: ["email", "profile"] }));

// Google callback URL
router.get("/google/callback", passport.authenticate("google", { failureRedirect: "/home", successRedirect: "/" }), (req, res) => {
	// Redirect or respond as needed after successful authentication
	console.log("Google login successful");
});

// // Initiate Facebook login
// router.get("/facebook", passport.authenticate("facebook", { scope: "email" }));

// // Facebook callback URL
// router.get("/facebook/callback", passport.authenticate("facebook", { failureRedirect: "/" }), (req, res) => {
// 	// Redirect or respond as needed after successful authentication
// });

export default router;
