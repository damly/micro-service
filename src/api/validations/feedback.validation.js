const Joi = require('joi');

module.exports = {

  // GET /v1/feedbacks
  listFeedbacks: {
    query: {
      page: Joi.number().min(1),
      perPage: Joi.number().min(1).max(100),
    },
  },

  // POST /v1/feedbacks
  createFeedback: {
    body: {
      email: Joi.string().email().required(),
      subject: Joi.string().required(),
      content: Joi.string(),
    },
  },

  // PATCH /v1/feedbacks/:feedbackId
  updateFeedback: {
    body: {
      reply: Joi.string(),
    },
    params: {
      feedbackId: Joi.string()
        .regex(/^[a-fA-F0-9]{24}$/)
        .required(),
    },
  },
};
