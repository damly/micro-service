const express = require('express');
const userRoutes = require('./user.route');
const authRoutes = require('./auth.route');
const roomRoutes = require('./room.route');
const productRoutes = require('./product.route');
const deviceRoutes = require('./device.route');
const feedbackRoutes = require('./feedback.route');
const chatRoutes = require('./chat.route');
const activityRoutes = require('./activity.route');

const router = express.Router();

/**
 * GET v1/status
 */
router.get('/status', (req, res) => res.send('OK'));

/**
 * GET v1/docs
 */
router.use('/docs', express.static('docs'));

router.use('/users', userRoutes);
router.use('/auth', authRoutes);
router.use('/rooms', roomRoutes);
router.use('/products', productRoutes);
router.use('/devices', deviceRoutes);
router.use('/feedbacks', feedbackRoutes);
router.use('/activities', activityRoutes);
router.use('/chats', chatRoutes);

module.exports = router;
