import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { PostInstance } from "../model/postModel";
import { createPostSchema, updatePostSchema } from "../utils/validations/postValidation";
import { option } from "../utils/validations/userValidation";
import { UserInstance } from "../model/userModel";
import { CategoryInstance } from "../model/categoryModel";

// Create Post
export const CreatePost = async (req: Request | any, res: Response) => {
	const uuid = uuidv4();

	const { id } = req.user;

	const validatedInput = createPostSchema.validate(req.body, option);
	if (validatedInput.error) {
		return res.status(400).json({
			error: validatedInput.error.details[0].message,
		});
	}

	try {
		// const existingPost = await PostInstance.findOne({ where: { name } });
		// if (existingPost) {
		// 	return res.status(409).json({
		// 		message: "Post already exists",
		// 	});
		// }

		const newPost = await PostInstance.create({
			id: uuid,
			authorId: id,
			...req.body,
		});

		return res.status(201).json({
			message: "Created Successfully",
			data: newPost,
		});
	} catch (error) {
		console.error("Error creating Post:", error);
		return res.status(500).json({
			error: "Internal Server Error",
		});
	}
};

// Get All Post
export const GetAllPost = async (req: Request, res: Response) => {
	try {
		const allPost = await PostInstance.findAndCountAll({
			include: [
				{
					model: UserInstance,
					as: "author",
				},
				{
					model: CategoryInstance,
					as: "category",
				},
			],
		});

		return res.status(200).json({
			message: "Post Retrieved Successfully",
			count: allPost.count,
			data: allPost.rows,
		});
	} catch (error) {
		console.error("Error fetching all categories:", error);
		return res.status(500).json({
			error: "Internal Server Error",
		});
	}
};

// Get One Post
export const GetOnePost = async (req: Request, res: Response) => {
	const { id } = req.params;

	try {
		// find the data to update from database
		const post = await PostInstance.findOne({ where: { id }, include: [{ model: UserInstance, as: "author" }] });

		if (!post) {
			return res.status(400).json({
				message: "Post does not exist",
			});
		}

		return res.status(200).json({
			message: "Post Retrieved Successfully",
			data: post,
		});
	} catch (error) {
		console.error("Error getting post:", error);
		return res.status(500).json({
			error: "Internal Server Error",
		});
	}
};

// Update a Post
export const UpdatePost = async (req: Request, res: Response) => {
	// get id of the post to update
	const id = req.params.id;

	// validate req body with joi
	const validatedInput = updatePostSchema.validate(req.body, option);
	if (validatedInput.error) {
		return res.status(400).json({
			err: validatedInput.error.details[0].message,
		});
	}

	try {
		// find the data to update from database and update
		const post = await PostInstance.findOne({ where: { id } });

		if (!post) {
			return res.status(400).json({
				message: "Post does not exist",
			});
		}

		const updated = await post.update({ ...req.body });

		return res.status(201).json({
			message: "Updated Successfully",
			updated,
		});
	} catch (error) {
		console.error("Error updating post:", error);
		return res.status(500).json({
			error: "Internal Server Error",
		});
	}
};

// Delete a Post
export const DeletePost = async (req: Request, res: Response) => {
	// get id of the post to delete
	const { id } = req.params;

	try {
		// find the data to delete from database
		const post = await PostInstance.findOne({ where: { id } });

		if (!post) {
			return res.status(400).json({
				error: "Record not found",
			});
		}

		// DELETE Record
		const deletedRecord = await post.destroy();

		// return result
		return res.status(200).json({
			message: "Deleted Successfully",
			deletedRecord,
		});
	} catch (error) {
		console.error("Error deleting post:", error);
		return res.status(500).json({
			error: "Internal Server Error",
		});
	}
};
