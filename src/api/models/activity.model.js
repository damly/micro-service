const mongoose = require('mongoose');
const httpStatus = require('http-status');
const { omitBy, isNil } = require('lodash');
const APIError = require('../utils/APIError');

/**
 * Activity Schema
 * @private
 */
const activitySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  deviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Device',
  },
  key: {
    type: String,
    required: true,
    trim: true,
  },
  value: {
    type: Object,
    required: true,
  },
}, {
  timestamps: true,
});

/**
 * Methods
 */
activitySchema.method({
  transform() {
    const transformed = {};
    const fields = ['id', 'deviceId', 'key', 'value', 'createdAt'];

    fields.forEach((field) => {
      transformed[field] = this[field];
    });

    return transformed;
  },
});

/**
 * Statics
 */
activitySchema.statics = {

  /**
   * Get user
   *
   * @param {ObjectId} id - The objectId of activity.
   * @returns {Promise<Activity, APIError>}
   */
  async get(id) {
    try {
      let activity;

      if (mongoose.Types.ObjectId.isValid(id)) {
        activity = await this.findById(id)
          .exec();
      }
      if (activity) {
        return activity;
      }

      throw new APIError({
        message: 'Activity does not exist',
        status: httpStatus.NOT_FOUND,
      });
    } catch (error) {
      throw error;
    }
  },

  /**
   * List activities in descending order of 'createdAt' timestamp.
   *
   * @param {number} skip - Number of users to be skipped.
   * @param {number} limit - Limit number of activities to be returned.
   * @returns {Promise<activity[]>}
   */
  list({
    page = 1, perPage = 30, key, userId, deviceId,
  }) {
    const options = omitBy({
      key,
      userId,
      deviceId,
    }, isNil);

    return this.find(options)
      .sort({ createdAt: -1 })
      .skip(perPage * (page - 1))
      .limit(perPage)
      .exec();
  },
};

/**
 * @typedef Activity
 */
module.exports = mongoose.model('Activity', activitySchema);
