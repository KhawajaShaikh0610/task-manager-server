const Joi = require("joi");

const registerUserSchema = Joi.object({
  username: Joi.string().min(3).max(30).required().messages({
    "string.empty": "Username is required",
    "string.min": "Username should be at least 3 characters",
    "string.max": "Username should not exceed 30 characters",
  }),
  email: Joi.string().email().required().messages({
    "string.empty": "Email is required",
    "string.email": "Email must be a valid email address",
  }),
  password: Joi.string().min(6).max(128).required().messages({
    "string.empty": "Password is required",
    "string.min": "Password should be at least 6 characters",
    "string.max": "Password should not exceed 128 characters",
  }),
});

module.exports = { registerUserSchema };
