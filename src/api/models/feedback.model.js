const mongoose = require('mongoose');
const httpStatus = require('http-status');
const { omitBy, isNil } = require('lodash');
const bcrypt = require('bcryptjs');
const moment = require('moment-timezone');
const uuidv4 = require('uuid/v4');
const APIError = require('../utils/APIError');

/**
 * Feedback Schema
 * @private
 */
const feedbackSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
  },
  subject: {
    type: String,
    required: true,
    trim: true,
  },
  content: {
    type: String,
    required: true,
    trim: true,
  },
  reply: {
    type: String,
    trim: true,
  },
  replyUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  appName: {
    type: String,
    trim: true,
  },
  appVersion: {
    type: String,
    trim: true,
  },
  deviceOs: {
    type: String,
    trim: true,
  },
  deviceLocaleCode: {
    type: String,
    trim: true,
  },
  deviceBuildId: {
    type: String,
    trim: true,
  },
  deviceBuildNumber: {
    type: String,
    trim: true,
  },
  deviceId: {
    type: String,
    trim: true,
  },
  deviceName: {
    type: String,
    trim: true,
  },
  deviceTotalMemory: {
    type: Number,
  },
  deviceTotalDiskCapacity: {
    type: Number,
  },
  deviceSystemName: {
    type: String,
    trim: true,
  },
  deiceSystemVersion: {
    type: String,
    trim: true,
  },
  deviceBrand: {
    type: String,
    trim: true,
  },
  deviceBundleId: {
    type: String,
    trim: true,
  },
  deviceCarrier: {
    type: String,
    trim: true,
  },
  deviceUniqueId: {
    type: String,
    trim: true,
  },
}, {
  timestamps: true,
});

/**
 * Methods
 */
feedbackSchema.method({
  transform() {
    const transformed = this;
    const fields = ['id', 'email', 'subject', 'content', 'reply', 'createdAt'];

    fields.forEach((field) => {
      transformed[field] = this[field];
    });

    return transformed;
  },
});

/**
 * Statics
 */
feedbackSchema.statics = {

  /**
   * Get user
   *
   * @param {ObjectId} id - The objectId of feedback.
   * @returns {Promise<Feedback, APIError>}
   */
  async get(id) {
    try {
      let feedback;

      if (mongoose.Types.ObjectId.isValid(id)) {
        feedback = await this.findById(id)
          .exec();
      }
      if (feedback) {
        return feedback;
      }

      throw new APIError({
        message: 'Feedback does not exist',
        status: httpStatus.NOT_FOUND,
      });
    } catch (error) {
      throw error;
    }
  },

  /**
   * List feedbacks in descending order of 'createdAt' timestamp.
   *
   * @param {number} skip - Number of users to be skipped.
   * @param {number} limit - Limit number of feedbacks to be returned.
   * @returns {Promise<feedback[]>}
   */
  list({
    page = 1, perPage = 30, email,
  }) {
    const options = omitBy({ email }, isNil);

    return this.find(options)
      .sort({ createdAt: -1 })
      .skip(perPage * (page - 1))
      .limit(perPage)
      .exec();
  },
};

/**
 * @typedef Feedback
 */
module.exports = mongoose.model('Feedback', feedbackSchema);
