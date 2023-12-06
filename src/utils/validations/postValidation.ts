import Joi from "joi";

// Create post validation
export const createPostSchema = Joi.object().keys({
	title: Joi.string().required(),
	content: Joi.string().required(),
	categoryId: Joi.string(),
});

// Update post validation
export const updatePostSchema = Joi.object().keys({
	title: Joi.string(),
	content: Joi.string(),
	categoryId: Joi.string(),
});
