const httpStatus = require('http-status');
const { omit } = require('lodash');
const Device = require('../models/device.model');

/**
 * Load device and append to req.
 * @public
 */
exports.load = async (req, res, next, id) => {
  try {
    const device = await Device.get(id);
    req.locals = { device };
    return next();
  } catch (error) {
    return next(error);
  }
};

/**
 * Create new device
 * @public
 */
exports.create = async (req, res, next) => {
  try {
    console.log('====device create: ', req.body, req.user);
    const device = new Device(req.body);
    const savedDevice = await device.save();
    res.status(httpStatus.CREATED);
    res.json(savedDevice.transform());
  } catch (error) {
    next(error);
  }
};


/**
 * Get device list
 * @public
 */
exports.list = async (req, res, next) => {
  try {
    const devices = await Device.list(req.query);
    const transformedDevices = devices.map(device => device.transform());
    res.json(transformedDevices);
  } catch (error) {
    next(error);
  }
};

/**
 * Update existing device
 * @public
 */
exports.update = (req, res, next) => {
  const device = Object.assign(req.locals.device, req.body);

  device.save()
    .then(savedDevice => res.json(savedDevice.transform()))
    .catch(e => next(e));
};
