const Joi = require('joi');

const expenseValidation = expenseData =>
  Joi.object({
    type: Joi.string().required(),
    category: Joi.string().required(),
    amount: Joi.number().required(),
  }).validate(expenseData, { abortEarly: false });

module.exports = expenseValidation;
