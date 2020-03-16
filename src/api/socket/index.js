const { redis } = require('../../config/vars');
const Room = require('../models/room.model');
const APIError = require('../utils/APIError');

const redisClient = require('redis').createClient;
const adapter = require('socket.io-redis');
const httpStatus = require('http-status');
const passport = require('passport');

const authorize = socket => new Promise(((resolve, reject) => {
  passport.authenticate(
    'jwt', { session: false },
    (err, user, info) => {
      const error = err || info;

      if (error || !user) {
        reject(error);
      } else {
        resolve(user);
      }
    },
  )(socket.request, socket.request.res);
}));

/**
 * Encapsulates all code for emitting and listening to socket events
 *
 */
const ioEvents = (io) => {
  // Chatroom namespace
  io.of('/v1/chatroom')
    .on('connection', (socket) => {
      // Join a chatroom
      socket.on('join', (roomId) => {
        console.log('join roomId:', roomId);
        Room.findById(roomId, (err, room) => {
          if (room) {
            const { user } = socket.request;
            const users = [];
            let inRoom = false;
            room.connections.forEach((con) => {
              users.push(con.userId);
              if (con.userId === user.id) {
                inRoom = true;
              }
            });

            if (inRoom) {
              socket.join(room.id);
              socket.broadcast.to(room.id)
                .emit('onlineUsers', users);
            } else {
              socket.disconnect();
            }
          } else {
            socket.disconnect();
          }
        });
      });

      // When a socket exits
      socket.on('disconnect', (roomId) => {
        socket.leave(roomId);
      });

      // When a new message arrives
      socket.on('newMessage', (roomId, message) => {
        // No need to emit 'addMessage' to the current socket
        // As the new message will be added manually in 'main.js' file
        // socket.emit('addMessage', message);
        socket.broadcast.to(roomId)
          .emit('addMessage', message);
      });
    });
};

/**
 * Initialize Socket.io
 * Uses Redis as Adapter for Socket.io
 *
 */
const init = (app) => {
  const server = require('http')
    .Server(app);
  const io = require('socket.io')(server);

  // Force Socket.io to ONLY use "websockets"; No Long Polling.
  io.set('transports', ['websocket']);

  const string = redis.uri.substring(9, redis.uri.length); // 'redis://:authpassword@127.0.0.1:6379/4'

  let array = string.split('@');
  // Using Redis
  const password = array[0];
  array = array[1].split('/');
  array = array[0].split(':');
  const port = array[1];
  const host = array[0];
  console.log('------redis', password, port, host);

  // const pubClient = redisClient(port, host, { auth_pass: password });
  // const subClient = redisClient(port, host, {
  //   auth_pass: password,
  //   return_buffers: true,
  // });

  const pubClient = redisClient(port, host);
  const subClient = redisClient(port, host);
  io.adapter(adapter({ pubClient, subClient }));


  // eslint-disable-next-line consistent-return
  io.use(async (socket, next) => {
    socket.request.headers.authorization = `Bearer ${socket.handshake.query.token}`;
    // console.log('--->', socket.request.headers);
    // console.log('+++>', socket.handshake);

    try {
      const user = await authorize(socket);
      socket.request.user = user;
      return next();
    } catch (error) {
      const apiError = new APIError({
        message: error ? error.message : 'Unauthorized',
        status: httpStatus.UNAUTHORIZED,
        stack: error ? error.stack : undefined,
      });
      return next(apiError);
    }
  });

  // Define all Events
  ioEvents(io);

  return server;
};

module.exports = init;
