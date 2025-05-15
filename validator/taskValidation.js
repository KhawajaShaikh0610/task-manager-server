const Joi = require("joi");
const { default: mongoose } = require("mongoose");

const taskSchema = Joi.object({
  title: Joi.string().min(3).max(100).required().messages({
    "string.empty": "Title is required",
    "string.min": "Title should be at least 3 characters",
    "string.max": "Title should not exceed 100 characters",
  }),
  description: Joi.string().max(500).allow("").messages({
    "string.max": "Description should not exceed 500 characters",
  }),
  status: Joi.string()
    .valid("pending", "in-progress", "completed", "hold")
    .required()
    .messages({
      "any.only":
        "Status must be one of 'pending', 'in-progress', or 'completed' or 'hold'",
      "string.empty": "Status is required",
    }),
  userId: Joi.string().required().messages({
    "any.required": "User ID is required",
  }),
});

module.exports = { taskSchema };
