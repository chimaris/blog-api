import { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";
import { CategoryInstance } from "../model/categoryModel";
import { createCategorySchema } from "../utils/validations/categoryValidation";
import { option } from "../utils/validations/userValidation";

// Create Category
export const CreateCategory = async (req: Request | any, res: Response) => {
	const { name } = req.body;
	const id = uuidv4();

	const verified = req.user;

	const validatedInput = createCategorySchema.validate(req.body, option);
	if (validatedInput.error) {
		return res.status(400).json({
			error: validatedInput.error.details[0].message,
		});
	}

	try {
		const existingCategory = await CategoryInstance.findOne({ where: { name } });
		if (existingCategory) {
			return res.status(409).json({
				message: "Category already exists",
			});
		}

		const newCategory = await CategoryInstance.create({
			id,
			...req.body,
		});

		return res.status(201).json({
			message: "Created Successfully",
			data: newCategory,
		});
	} catch (error) {
		console.error("Error creating category:", error);
		return res.status(500).json({
			error: "Internal Server Error",
		});
	}
};

// Get All Categories
export const GetAllCategory = async (req: Request, res: Response) => {
	try {
		const allCategory = await CategoryInstance.findAndCountAll();

		return res.status(200).json({
			message: "Category Retrieved Successfully",
			count: allCategory.count,
			data: allCategory.rows,
		});
	} catch (error) {
		console.error("Error fetching all categories:", error);
		return res.status(500).json({
			error: "Internal Server Error",
		});
	}
};

// Get One Category
export const GetOneCategory = async (req: Request, res: Response) => {
	// get id of the category to update
	const { id } = req.params;

	try {
		// find the data to update from database
		const category = await CategoryInstance.findOne({ where: { id } });

		if (!category) {
			return res.status(400).json({
				message: "Category does not exist",
			});
		}

		return res.status(200).json({
			message: "Category Retrieved Successfully",
			data: category,
		});
	} catch (error) {
		console.error("Error getting category:", error);
		return res.status(500).json({
			error: "Internal Server Error",
		});
	}
};

// Update a Category
export const UpdateCategory = async (req: Request, res: Response) => {
	// get id of the category to update
	const id = req.params.id;

	// validate req body with joi
	const validatedInput = createCategorySchema.validate(req.body, option);
	if (validatedInput.error) {
		return res.status(400).json({
			err: validatedInput.error.details[0].message,
		});
	}

	try {
		// find the data to update from database and update
		const category = await CategoryInstance.findOne({ where: { id } });

		if (!category) {
			return res.status(400).json({
				message: "Category does not exist",
			});
		}

		const updated = await category.update({ ...req.body });

		return res.status(201).json({
			message: "Updated Successfully",
			updated,
		});
	} catch (error) {
		console.error("Error updating category:", error);
		return res.status(500).json({
			error: "Internal Server Error",
		});
	}
};

// Delete a Category
export const DeleteCategory = async (req: Request, res: Response) => {
	// get id of the organization to update
	const { id } = req.params;

	try {
		// find the data to delete from database
		const category = await CategoryInstance.findOne({ where: { id } });

		if (!category) {
			return res.status(400).json({
				error: "Record not found",
			});
		}

		// DELETE Record
		const deletedRecord = await category.destroy();

		// return result
		return res.status(200).json({
			message: "Deleted Successfully",
			deletedRecord,
		});
	} catch (error) {
		console.error("Error deleting category:", error);
		return res.status(500).json({
			error: "Internal Server Error",
		});
	}
};
