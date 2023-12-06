import Joi from "joi";

// Joi options
export const option = {
	abortEarly: false,
	errors: {
		wrap: {
			label: "",
		},
	},
};

// Register validation
export const registerUserSchema = Joi.object().keys({
	username: Joi.string().min(4).max(30).required().messages({
		"string.empty": "Username is required",
		"string.min": "Username should have a minimum length of {#limit}",
		"string.max": "Username should have a maximum length of {#limit}",
	}),
	email: Joi.string().email().required().messages({
		"string.empty": "Email is required",
		"string.email": "Invalid email format",
	}),
	password: Joi.string().min(3).required().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
	confirmPassword: Joi.any().equal(Joi.ref("password")).label("Confirm password").required().messages({ "any.only": "{{#label}} does not match" }),
});

// Login validation
export const loginUserSchema = Joi.object().keys({
	email: Joi.string().email().required().messages({
		"string.empty": "Email is required",
		"string.email": "Invalid email format",
	}),
	password: Joi.string().min(3).required().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
});

// Reset password validation
export const resetPasswordSchema = Joi.object({
	password: Joi.string().min(3).required().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
	confirmPassword: Joi.any().equal(Joi.ref("password")).required().label("Confirm password").messages({
		"any.only": "Passwords do not match",
		"any.required": "Password confirmation is required",
	}),
});
