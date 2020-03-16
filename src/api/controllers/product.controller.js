const httpStatus = require('http-status');
const { omit } = require('lodash');
const Product = require('../models/product.model');

/**
 * Load product and append to req.
 * @public
 */
exports.load = async (req, res, next, id) => {
  try {
    console.log('product=====', id);
    const product = await Product.get(id);

    console.log('product=====', product);

    req.locals = { product };
    return next();
  } catch (error) {
    return next(error);
  }
};

/**
 * Create new product
 * @public
 */
exports.create = async (req, res, next) => {
  try {
    console.log('====product create: ', req.body, req.user);
    const product = new Product(req.body);
    const savedProduct = await product.save();
    res.status(httpStatus.CREATED);
    res.json(savedProduct.transform());
  } catch (error) {
    next(error);
  }
};


/**
 * Get product list
 * @public
 */
exports.list = async (req, res, next) => {
  try {
    const products = await Product.list(req.query);
    const transformedProducts = products.map(product => product.transform());
    res.json(transformedProducts);
  } catch (error) {
    next(error);
  }
};

/**
 * Update existing product
 * @public
 */
exports.update = (req, res, next) => {
  const product = Object.assign(req.locals.product, req.body);

  product.save()
    .then(savedProduct => res.json(savedProduct.transform()))
    .catch(e => next(e));
};
