const Joi = require('joi');

module.exports = {

  // GET /v1/activities
  listActivities: {
    query: {
      page: Joi.number()
        .min(1),
      perPage: Joi.number()
        .min(1)
        .max(100),
    },
  },

  // POST /v1/activities
  createActivity: {
    body: {
      deviceId: Joi.string(),
      key: Joi.string()
        .required(),
      value: Joi.required(),
    },
  },

  // PATCH /v1/activities/:activityId
  updateActivity: {
    body: {
      deviceId: Joi.string(),
      key: Joi.string()
        .required(),
      value: Joi.required(),
    },
    params: {
      activityId: Joi.string()
        .regex(/^[a-fA-F0-9]{24}$/)
        .required(),
    },
  },
};
