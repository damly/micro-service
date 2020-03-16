const Joi = require('joi');

module.exports = {

  // GET /v1/products
  listProducts: {
    query: {
      page: Joi.number()
        .min(1),
      perPage: Joi.number()
        .min(1)
        .max(100),
    },
  },

  // POST /v1/products
  createProduct: {
    body: {
      model: Joi.string()
        .required(),
      name: Joi.string(),
      describe: Joi.string(),
    },
  },

  // PATCH /v1/products/:productId
  updateProduct: {
    body: {
      model: Joi.string(),
      name: Joi.string(),
      describe: Joi.string(),
    },
    params: {
      productId: Joi.string()
        .regex(/^[a-fA-F0-9]{24}$/)
        .required(),
    },
  },
};
