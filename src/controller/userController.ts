import { Request, Response, NextFunction } from "express";
import { loginUserSchema, option, registerUserSchema, resetPasswordSchema } from "../utils/validations/userValidation";
import { UserInstance } from "../model/userModel";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";
import { generateToken } from "../utils/utils";
import { sendResetPasswordToken } from "../utils/services/sendEmails";
import { PostInstance } from "../model/postModel";
import { CategoryInstance } from "../model/categoryModel";

const jwtSecret = process.env.JWT_SECRET as string;

// Register
export const Register = async (req: Request, res: Response, next: NextFunction) => {
	const { email, password } = req.body;
	const id = uuidv4();

	// Validate with Joi
	const validatedInput = registerUserSchema.validate(req.body, option);
	if (validatedInput.error) {
		return res.status(400).json({ error: validatedInput.error.details[0].message });
	}

	try {
		// Check if the user already exists
		const existingUser = await UserInstance.findOne({ where: { email: email } });
		if (existingUser) {
			return res.status(400).json({ error: "Email is already in use" });
		}

		// Hash the password
		const passwordHashed = await bcrypt.hash(password, await bcrypt.genSalt());
		req.body.password = passwordHashed;

		// Save to the database
		const newUser = await UserInstance.create({
			id: id,
			...req.body,
		});

		return res.status(201).json({ message: "User created successfully", data: newUser });
	} catch (error) {
		console.error("Error during registration:", error);
		return res.status(500).json({ error: "Internal server error" });
	}
};

// Login
export const Login = async (req: Request, res: Response, next: NextFunction) => {
	const { email, password } = req.body;

	// Validate with Joi
	const validatedInput = loginUserSchema.validate(req.body, option);

	if (validatedInput.error) {
		return res.status(400).json({ error: validatedInput.error.details[0].message });
	}

	try {
		// Check if the user exists
		const user = await UserInstance.findOne({ where: { email: email } });
		if (!user) {
			return res.status(400).json({ error: "Invalid credentials" });
		}

		// Destructure user id and fullname for token
		const { id, fullname } = user as unknown as { [key: string]: string };

		// Sign a token that will expire in 1 day
		const token = jwt.sign({ id, fullname }, jwtSecret, { expiresIn: "1d" });

		// Save the token in an HTTP-only cookie
		res.cookie("token", token, {
			maxAge: 1800000, // Cookie expires after 30 minutes (in milliseconds)
			httpOnly: true, // Cookie is accessible only via HTTP(S)
		});

		// Authenticate the user password by comparing the hashed one with the user input.
		const validUser = await bcrypt.compare(password, user.dataValues.password);

		if (!validUser) {
			return res.status(400).json({ error: "Invalid credentials" });
		}

		return res.status(200).json({ message: "Login successful", user, token });
	} catch (error) {
		console.error("Error during login:", error);
		return res.status(500).json({ error: "Internal server error" });
	}
};

// lOGOUT
export const Logout = async (req: Request, res: Response, next: NextFunction) => {
	res.clearCookie("token");
	return res.status(200).json({ message: "Logout successful" });
};

// Forget Password
export const ForgetPassword = async (req: Request, res: Response) => {
	const { email } = req.body;

	try {
		const user = await UserInstance.findOne({ where: { email: email } });
		if (!user) {
			return res.status(404).json({ error: "Email not found" });
		}

		let { id, resetPasswordToken } = user as unknown as {
			[key: string]: string;
		};

		// Generate reset password token using JWT
		const resetToken = generateToken(id);

		// Save the reset token to the user's table
		await user.update({ ...req.body, resetPasswordToken: resetToken });

		// Send reset password email to the user
		const result = await sendResetPasswordToken(email, resetToken);
		if (result instanceof Error) {
			return res.status(500).json({ error: "Error sending an email" });
		}

		return res.status(200).json({ message: "Reset password link sent to your email" });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: "Internal server error" });
	}
};

// Reset Password
export const ResetPassword = async (req: Request, res: Response) => {
	const { token } = req.params;
	const { password } = req.body;

	try {
		// Validate with joi
		const validatedInput = resetPasswordSchema.validate(req.body, option);
		if (validatedInput.error) {
			return res.status(400).json({ error: validatedInput.error.details[0].message });
		}

		// Verify the token
		const decodedToken = jwt.verify(token, jwtSecret);

		if (!decodedToken) {
			return res.status(401).json({
				error: "Invalid or expired token",
			});
		}

		// Extract user ID from the token
		const { userId } = decodedToken as unknown as { [key: string]: string };

		// Find the user in the database based on the user ID
		const user = await UserInstance.findOne({ where: { id: userId } });

		if (!user) {
			return res.status(404).json({ error: "Email not found" });
		}

		// Hash the password
		const passwordHashed = await bcrypt.hash(password, await bcrypt.genSalt());
		req.body.password = passwordHashed;

		// Set the new password and clear the reset token fields
		const updated = await user.update({
			...req.body,
			password: passwordHashed,
			resetPasswordToken: "",
		});

		return res.status(200).json({ message: "Password reset successful", updated });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: "Internal server error" });
	}
};

// Get all User
export const getAllUsers = async (req: Request, res: Response) => {
	const allUsers = await UserInstance.findAndCountAll({
		include: [
			{
				model: PostInstance,
				as: "posts",

				include: [
					{
						model: CategoryInstance,
						as: "category",
					},
				],
			},
		],
	});

	return res.status(200).json({
		message: "Users Retrieved Successfully",
		count: allUsers.count,
		data: allUsers.rows,
	});
};

// Get a single User
export const getOneUser = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const user = await UserInstance.findOne({
			where: { id },
			include: [
				{
					model: PostInstance,
					as: "posts",
				},
			],
		});

		if (!user) {
			return res.status(400).json({ message: "User not found" });
		}
		return res.status(200).json({ message: "User retrived successfully", user });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ error: "Internal server error" });
	}
};

// Update a User
export const UpdateUser = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const user = await UserInstance.findOne({ where: { id: id } });

		if (!user) {
			return res.status(400).json({
				msg: "user does not exist",
			});
		}
		const updateUser = await user.update({ ...req.body });

		return res.status(200).json({
			msg: "You have updated a user",
			updateUser,
		});
	} catch (err) {
		console.error(err);
		return res.status(500).json({ error: "Internal server error" });
	}
};

// Delete a User
export const DeleteUser = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const user = await UserInstance.findOne({ where: { id: id } });

		if (!user) {
			return res.status(400).json({
				msg: "user does not exist",
			});
		}
		const deleteuser = await user.destroy();

		return res.status(200).json({
			msg: "You have deleted a user",
			deleteuser,
		});
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: "Internal server error" });
	}
};
