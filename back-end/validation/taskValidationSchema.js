const Joi = require("joi");

//Validation Schema to validate against request's body
const taskValidationSchema = Joi.object({
  title: Joi.string().required(),//@title must be a string and not null
  description: Joi.string().allow("").max(255),
  dueDate: Joi.date().iso().allow(null),//@dueDate is optional Date object formated to iso string ;example: "2024-02-05T00:00:00.000Z"
  status: Joi.string()//@status must be a string 
    .valid("To Do", "In Progress", "Done")//Valid Strings to accept
    .default("To Do")//@status is set to "To Do" by default
    .required(),//@status is mandatory 
  order: Joi.number().required(),//@order is a number and required
}).options({ abortEarly: false });
module.exports = taskValidationSchema;
