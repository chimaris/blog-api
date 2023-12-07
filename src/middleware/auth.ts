import jwt, { TokenExpiredError } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { UserInstance } from "../model/userModel";

export const Auth = async (req: Request | any, res: Response, next: NextFunction) => {
	// find the token from the header
	const authorization = req.headers.authorization;

	if (!authorization) {
		return res.status(401).json({ error: "Kindly sign in as a user" });
	}

	// slice out the bearer from the beginning
	const token = authorization?.slice(7);

	try {
		// verify the token
		const verified = jwt.verify(token, process.env.JWT_SECRET as string);

		// get the token id
		const { id } = verified as unknown as { [key: string]: string };
		const user = await UserInstance.findOne({ where: { id } });

		if (!user) {
			return res.status(400).json({
				error: "Please sign in as a user",
			});
		}

		// pass to the next function or middleware
		req.user = verified;
		next();
	} catch (error) {
		// Check if the error is a TokenExpiredError
		if (error instanceof TokenExpiredError) {
			return res.status(401).json({
				error: "Token has expired",
			});
		}

		// Handle other verification errors
		return res.status(401).json({
			error: "Invalid Token",
		});
	}
};
