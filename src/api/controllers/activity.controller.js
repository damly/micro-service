const httpStatus = require('http-status');
const { omit } = require('lodash');
const APIError = require('../utils/APIError');
const Activity = require('../models/activity.model');

/**
 * Load activity and append to req.
 * @public
 */
exports.load = async (req, res, next, id) => {
  try {
    const activity = await Activity.get(id);

    req.locals = { activity };
    return next();
  } catch (error) {
    return next(error);
  }
};

/**
 * Create new activity
 * @public
 */
exports.create = async (req, res, next) => {
  try {
    req.body.userId = req.user.id;
    const activity = new Activity(req.body);
    await activity.save();
    res.status(httpStatus.NO_CONTENT)
      .end();
  } catch (error) {
    next(error);
  }
};


/**
 * Get activity list
 * @public
 */
exports.list = async (req, res, next) => {
  try {
    const options = req.query;
    if (req.user.role !== 'admin') {
      options.userId = req.user.id;
    }
    const activities = await Activity.list(options);
    const transformedActivities = activities.map(activity => activity.transform());
    res.json(transformedActivities);
  } catch (error) {
    next(error);
  }
};

/**
 * Update existing activity
 * @public
 */
exports.update = async (req, res, next) => {
  const activity = Object.assign(req.locals.activity, req.body);

  try {
    await activity.save();
    res.status(httpStatus.NO_CONTENT)
      .end();
  } catch (error) {
    next(error);
  }
};

/**
 * Delete activity
 * @public
 */
exports.remove = (req, res, next) => {
  const { user } = req;
  const { activity } = req.locals;
  if (user.id.toString() === activity.userId.toString()) {
    activity.remove()
      .then(() => res.status(httpStatus.NO_CONTENT)
        .end())
      .catch(e => next(e));
  } else {
    res.status(httpStatus.FORBIDDEN)
      .end();
  }
};
