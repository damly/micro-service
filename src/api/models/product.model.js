const mongoose = require('mongoose');
const httpStatus = require('http-status');
const { omitBy, isNil } = require('lodash');
const bcrypt = require('bcryptjs');
const moment = require('moment-timezone');
const uuidv4 = require('uuid/v4');
const APIError = require('../utils/APIError');

/**
 * Product Schema
 * @private
 */
const productSchema = new mongoose.Schema({
  model: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  describe: {
    type: String,
    trim: true,
  },
}, {
  timestamps: true,
});

/**
 * Methods
 */
productSchema.method({
  transform() {
    const transformed = {};
    const fields = ['id', 'model', 'name', 'describe', 'createdAt'];

    fields.forEach((field) => {
      transformed[field] = this[field];
    });

    return transformed;
  }
});

/**
 * Statics
 */
productSchema.statics = {

  /**
   * Get user
   *
   * @param {ObjectId} id - The objectId of product.
   * @returns {Promise<Product, APIError>}
   */
  async get(id) {
    try {
      let product;

      if (mongoose.Types.ObjectId.isValid(id)) {
        product = await this.findById(id)
          .exec();
      }
      if (product) {
        return product;
      }

      throw new APIError({
        message: 'Product does not exist',
        status: httpStatus.NOT_FOUND,
      });
    } catch (error) {
      throw error;
    }
  },

  /**
   * List products in descending order of 'createdAt' timestamp.
   *
   * @param {number} skip - Number of users to be skipped.
   * @param {number} limit - Limit number of products to be returned.
   * @returns {Promise<product[]>}
   */
  list({
    page = 1, perPage = 30, model,
  }) {
    const options = omitBy({ model }, isNil);

    return this.find(options)
      .sort({ createdAt: -1 })
      .skip(perPage * (page - 1))
      .limit(perPage)
      .exec();
  },
};

/**
 * @typedef Product
 */
module.exports = mongoose.model('Product', productSchema);
