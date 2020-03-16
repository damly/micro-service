const httpStatus = require('http-status');
const { omit } = require('lodash');
const Room = require('../models/room.model');
const User = require('../models/user.model');


async function getRoom(room) {
  const users = [];

  room.connections.forEach((conn) => {
    users.push(conn.userId);
  });

  const owner = await User.get(room.userId);

  const userList = await User.find({ _id: { $in: users } });
  userList.forEach((user, i) => {
    userList[i] = user.transform();
  });

  return {
    owner: owner.transform(),
    title: room.title,
    users: userList,
    createdAt: room.createAt,
  };
}

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
 * Get chat room's users
 * @public
 */
exports.get = async (req, res) => {
  const { room } = req.locals;
  const transformedRoom = await getRoom(room);
  res.json(transformedRoom);
};

exports.addUser = async (req, res, next) => {
  const { room } = req.locals;
  const userId = req.user.id;

  let need = true;

  room.connections.forEach((conn) => {
    if (userId === conn.userId) {
      need = false;
    }
  });

  if (need) {
    const conn = {
      userId,
    };
    room.connections.push(conn);
    room.save()
      .then(async (savedRoom) => {
        const transformedRoom = await getRoom(savedRoom)
        res.json(transformedRoom);
      })
      .catch(e => next(e));
  } else {
    const transformedRoom = await getRoom(room)
    res.json(transformedRoom);
  }
};

exports.removeUser = async (req, res, next) => {
  const { room } = req.locals;
  const userId = req.user.id;
  let target = -1;
  room.connections.forEach((conn, index) => {
    if (userId === conn.userId) {
      target = index;
    }
  });

  if (target !== -1) {
    room.connections.id(room.connections[target]._id)
      .remove();
    room.save()
      .then(() => res.status(httpStatus.NO_CONTENT)
        .end())
      .catch(e => next(e));
  } else {
    res.status(httpStatus.NO_CONTENT)
      .end();
  }
};
