const httpStatus = require('http-status');
const { omit } = require('lodash');
const Room = require('../models/room.model');

/**
 * Load room and append to req.
 * @public
 */
exports.load = async (req, res, next, id) => {
  try {
    const room = await Room.get(id);
    req.locals = { room };
    return next();
  } catch (error) {
    return next(error);
  }
};

/**
 * Create new room
 * @public
 */
exports.create = async (req, res, next) => {
  try {
    req.body.userId = req.user.id;
    const room = new Room(req.body);
    const savedRoom = await room.save();
    res.status(httpStatus.CREATED);
    res.json(savedRoom.transform());
  } catch (error) {
    next(error);
  }
};


/**
 * Get room list
 * @public
 */
exports.list = async (req, res, next) => {
  try {
    const rooms = await Room.list(req.query);
    const transformedRooms = rooms.map(room => room.transform());
    res.json(transformedRooms);
  } catch (error) {
    next(error);
  }
};

/**
 * Update existing room
 * @public
 */
exports.update = (req, res, next) => {
  const room = Object.assign(req.locals.room, req.body);

  room.save()
    .then(savedRoom => res.json(savedRoom.transform()))
    .catch(e => next(e));
};
