const httpStatus = require('http-status');
const { omit } = require('lodash');
const Feedback = require('../models/feedback.model');

/**
 * Load feedback and append to req.
 * @public
 */
exports.load = async (req, res, next, id) => {
  try {
    const feedback = await Feedback.get(id);
    req.locals = { feedback };
    return next();
  } catch (error) {
    return next(error);
  }
};

/**
 * Create new feedback
 * @public
 */
exports.create = async (req, res, next) => {
  try {
    const feedback = new Feedback(req.body);
    await feedback.save();
    res.status(httpStatus.CREATED);
    res.json({ message: 'success' });
  } catch (error) {
    next(error);
  }
};

/**
 * Get feedback list
 * @public
 */
exports.list = async (req, res, next) => {
  try {
    const feedbacks = await Feedback.list(req.query);
    const transformedFeedbacks = feedbacks.map(feedback => feedback.transform());
    res.json(transformedFeedbacks);
  } catch (error) {
    next(error);
  }
};

/**
 * Update existing feedback
 * @public
 */
exports.update = (req, res, next) => {
  const feedback = Object.assign(req.locals.feedback, req.body);
  feedback.replyUserId = req.user.id;
  feedback.save()
    .then(savedFeedback => res.json(savedFeedback.transform()))
    .catch(e => next(e));
};
