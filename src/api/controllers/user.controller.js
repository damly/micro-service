const httpStatus = require('http-status');
const { omit } = require('lodash');
const APIError = require('../utils/APIError');
const User = require('../models/user.model');
const Device = require('../models/device.model');

/**
 * Load user and append to req.
 * @public
 */
exports.load = async (req, res, next, id) => {
  try {
    const user = await User.get(id);
    req.locals = { user };
    return next();
  } catch (error) {
    return next(error);
  }
};

/**
 * Get user
 * @public
 */
exports.get = (req, res) => res.json(req.locals.user.transform());

/**
 * Get logged in user info
 * @public
 */
exports.loggedIn = (req, res) => res.json(req.user.transform());

/**
 * Create new user
 * @public
 */
exports.create = async (req, res, next) => {
  try {
    const user = new User(req.body);
    const savedUser = await user.save();
    res.status(httpStatus.CREATED);
    res.json(savedUser.transform());
  } catch (error) {
    next(User.checkDuplicateEmail(error));
  }
};

/**
 * Replace existing user
 * @public
 */
exports.replace = async (req, res, next) => {
  try {
    const { user } = req.locals;
    const newUser = new User(req.body);
    const ommitRole = user.role !== 'admin' ? 'role' : '';
    const newUserObject = omit(newUser.toObject(), '_id', ommitRole);

    await user.updateOne(newUserObject, {
      override: true,
      upsert: true,
    });
    const savedUser = await User.findById(user._id);

    res.json(savedUser.transform());
  } catch (error) {
    next(User.checkDuplicateEmail(error));
  }
};

/**
 * Update existing user
 * @public
 */
exports.update = (req, res, next) => {
  const ommitRole = req.locals.user.role !== 'admin' ? 'role' : '';
  const updatedUser = omit(req.body, ommitRole);
  const user = Object.assign(req.locals.user, updatedUser);

  user.save()
    .then(savedUser => res.json(savedUser.transform()))
    .catch(e => next(User.checkDuplicateEmail(e)));
};

/**
 * Get user list
 * @public
 */
exports.list = async (req, res, next) => {
  try {
    const users = await User.list(req.query);
    const transformedUsers = users.map(user => user.transform());
    res.json(transformedUsers);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete user
 * @public
 */
exports.remove = (req, res, next) => {
  const { user } = req.locals;

  user.remove()
    .then(() => res.status(httpStatus.NO_CONTENT)
      .end())
    .catch(e => next(e));
};


/**
 * List user's device
 * @public
 */
exports.bindingList = async (req, res, next) => {
  try {
    const { user } = req;
    const ids = [];
    user.devices.forEach((dev) => {
      ids.push(dev.deviceId);
    });

    const devices = await Device.findByIds(ids);
    const transformedDevices = devices.map(dev => dev.transform());
    res.json(transformedDevices);
  } catch (error) {
    next(error);
  }
};

/**
 * add device for user
 * @public
 */
exports.binding = async (req, res, next) => {
  try {
    const { deviceId } = req.body;
    const { user } = req;

    const device = await Device.get(deviceId);
    if (!device) {
      throw new APIError({
        status: httpStatus.NOT_FOUND,
        message: 'Device not found',
      });
    }

    const array = [];
    let need = true;
    user.devices.forEach((dev) => {
      array.push(dev.deviceId);
      if (dev.deviceId === deviceId) {
        need = false;
      }
    });

    if (need && device) {
      array.push(deviceId);
      user.devices.push({ deviceId });
      await user.save();
    }

    const devices = await Device.findByIds(array);
    const transformedDevices = devices.map(dev => dev.transform());
    res.json(transformedDevices);
  } catch (error) {
    next(error);
  }
};

/**
 * delete device for user
 * @public
 */
exports.unbinding = async (req, res, next) => {
  try {
    const { deviceId } = req.query;
    const { user } = req;

    const device = await Device.get(deviceId);
    if (!device) {
      throw new APIError({
        status: httpStatus.NOT_FOUND,
        message: 'Device not found',
      });
    }

    let target = -1;
    user.devices.forEach((dev, index) => {
      if (deviceId === dev.deviceId) {
        target = index;
      }
    });

    if (target !== -1) {
      user.devices.id(user.devices[target]._id)
        .remove();
      await user.save();
    }

    res.status(httpStatus.NO_CONTENT)
      .end();
  } catch (error) {
    next(error);
  }
};
