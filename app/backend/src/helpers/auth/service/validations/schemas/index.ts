import Joi = require('joi');

const logUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

export default logUserSchema;
