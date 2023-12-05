import jwt from "jsonwebtoken";

const jwtSecret = process.env.JWT_SECRET as string;

// Generate token
export const generateToken = (userId: string) => {
	const token = jwt.sign({ userId }, jwtSecret, { expiresIn: "1d" });
	return token;
};
