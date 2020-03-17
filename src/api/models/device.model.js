const mongoose = require('mongoose');
const httpStatus = require('http-status');
const { omitBy, isNil } = require('lodash');
const bcrypt = require('bcryptjs');
const moment = require('moment-timezone');
const uuidv4 = require('uuid/v4');
const APIError = require('../utils/APIError');
const Product = require('./product.model');

/**
 * Device Schema
 * @private
 */
const deviceSchema = new mongoose.Schema({
  uuid: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
  },
  status: {
    type: Boolean,
    required: true,
    default: true,
  },
}, {
  timestamps: true,
});

/**
 * Methods
 */
deviceSchema.method({
  transform() {
    const transformed = {};
    const fields = ['id', 'uuid', 'status', 'createdAt'];

    fields.forEach((field) => {
      transformed[field] = this[field];
    });

    transformed.product = this.productId.transform();

    return transformed;
  },
});

/**
 * Statics
 */
deviceSchema.statics = {

  /**
   * Get user
   *
   * @param {ObjectId} id - The objectId of device.
   * @returns {Promise<Device, APIError>}
   */
  async get(id) {
    try {
      let device;

      if (mongoose.Types.ObjectId.isValid(id)) {
        device = await this.findById(id)
          .populate({
            path: 'productId',
            model: Product,
          })
          .exec();
      }
      if (device) {
        return device;
      }

      throw new APIError({
        message: 'device does not exist',
        status: httpStatus.NOT_FOUND,
      });
    } catch (error) {
      throw error;
    }
  },

  /**
   * List devices in descending order of 'createdAt' timestamp.
   *
   * @param {number} skip - Number of users to be skipped.
   * @param {number} limit - Limit number of devices to be returned.
   * @returns {Promise<device[]>}
   */
  list({
    page = 1, perPage = 30, uuid, productId, status,
  }) {
    const options = omitBy({
      uuid,
      productId,
      status,
    }, isNil);

    return this.find(options)
      .populate({
        path: 'productId',
        model: Product,
      })
      .sort({ createdAt: -1 })
      .skip(perPage * (page - 1))
      .limit(perPage)
      .exec();
  },

  findByIds(ids) {
    return this.find({ _id: { $in: ids } })
      .populate({
        path: 'productId',
        model: Product,
      })
      .sort({ createdAt: -1 })
      .exec();
  },
};

/**
 * @typedef device
 */
module.exports = mongoose.model('Device', deviceSchema);
