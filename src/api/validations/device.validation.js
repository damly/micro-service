const Joi = require('joi');

module.exports = {

  // GET /v1/devices
  listDevices: {
    query: {
      page: Joi.number()
        .min(1),
      perPage: Joi.number()
        .min(1)
        .max(100),
    },
  },

  // POST /v1/devices
  createDevice: {
    body: {
      uuid: Joi.string()
        .required(),
      productId: Joi.string(),
      status: Joi.boolean(),
    },
  },

  // PATCH /v1/devices/:deviceId
  updateDevice: {
    body: {
      status: Joi.boolean(),
      productId: Joi.string(),
    },
    params: {
      deviceId: Joi.string()
        .regex(/^[a-fA-F0-9]{24}$/)
        .required(),
    },
  },
};
