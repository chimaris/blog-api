import Joi from "joi";

export const createCategorySchema = Joi.object().keys({
	name: Joi.string().min(4).max(30).required(),
});
