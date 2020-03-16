// make bluebird default Promise
Promise = require('bluebird'); // eslint-disable-line no-global-assign
const { port, env } = require('./config/vars');
const logger = require('./config/logger');
const app = require('./config/express');
const mongoose = require('./config/mongoose');
const ioServer = require('./api/socket')(app);

// require('./config/redis');

// open mongoose connection
mongoose.connect();

// listen to requests
ioServer.listen(port, '0.0.0.0', () => logger.info(`server started on port ${port} (${env})`));

/**
 * Exports express
 * @public
 */
module.exports = app;
