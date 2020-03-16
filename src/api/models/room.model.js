const mongoose = require('mongoose');
const httpStatus = require('http-status');
const { omitBy, isNil } = require('lodash');
const bcrypt = require('bcryptjs');
const moment = require('moment-timezone');
const uuidv4 = require('uuid/v4');
const APIError = require('../utils/APIError');

/**
 * Room Schema
 * @private
 */
const roomSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  connections: {
    type: [{
      userId: String,
    }],
  },
}, {
  timestamps: true,
});

/**
 * Methods
 */
roomSchema.method({
  transform() {
    const transformed = {};
    const fields = ['id', 'title', 'userId', 'connections', 'createdAt'];

    fields.forEach((field) => {
      transformed[field] = this[field];
    });

    return transformed;
  },
});

/**
 * Statics
 */
roomSchema.statics = {

  /**
   * Get room
   *
   * @param {ObjectId} id - The objectId of room.
   * @returns {Promise<Room, APIError>}
   */
  async get(id) {
    try {
      let room;

      if (mongoose.Types.ObjectId.isValid(id)) {
        room = await this.findById(id)
          .exec();
      }
      if (room) {
        return room;
      }

      throw new APIError({
        message: 'Room does not exist',
        status: httpStatus.NOT_FOUND,
      });
    } catch (error) {
      throw error;
    }
  },
  /**
   * List rooms in descending order of 'createdAt' timestamp.
   *
   * @param {number} skip - Number of users to be skipped.
   * @param {number} limit - Limit number of rooms to be returned.
   * @returns {Promise<Room[]>}
   */
  list({
    page = 1, perPage = 30, userId, title,
  }) {
    const options = omitBy({
      userId,
      title,
    }, isNil);

    return this.find(options)
      .sort({ createdAt: -1 })
      .skip(perPage * (page - 1))
      .limit(perPage)
      .exec();
  },
};

/**
 * @typedef Room
 */
module.exports = mongoose.model('Room', roomSchema);
