const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/chat.controller');
const { authorize, LOGGED_USER } = require('../../middlewares/auth');
const router = express.Router();

/**
 * Load room when API with roomId route parameter is hit
 */
router.param('roomId', controller.load);

router
  .route('/:roomId')
  /**
   * @api {get} v1/rooms Get Room's users
   * @apiDescription Get a users list of room
   * @apiVersion 1.0.0
   * @apiName ListRooms
   * @apiGroup Chat
   * @apiPermission user
   *
   * @apiHeader {String} Authorization   User's access token
   *
   * @apiSuccess (Created 201) {String}  id         Room's id
   * @apiSuccess (Created 201) {String}  userId       Room's owner
   * @apiSuccess (Created 201) {Object[]}  users       Room's users
   * @apiSuccess (Created 201) {Date}    createdAt  Timestamp
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
  .get(authorize(), controller.get)
  /**
   * @api {post} v1/chat/:id Join room
   * @apiDescription Join a new room
   * @apiVersion 1.0.0
   * @apiName JoinRoom
   * @apiGroup Chat
   * @apiPermission user
   *
   * @apiHeader {String} Authorization   User's access token
   *
   * @apiSuccess (Created 201) {String}  id         Room's id
   * @apiSuccess (Created 201) {String}  userId       Room's owner
   * @apiSuccess (Created 201) {Object[]}  users       Room's users
   * @apiSuccess (Created 201) {Date}    createdAt  Timestamp
   *
   * @apiError (Bad Request 400)   ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401)  Unauthorized     Only authenticated users can create the data
   */
  .post(authorize(), controller.addUser)
  /**
   * @api {patch} v1/chat/:id Leave room
   * @apiDescription Leave a room
   * @apiVersion 1.0.0
   * @apiName LeaveRoom
   * @apiGroup Chat
   * @apiPermission user
   *
   * @apiHeader {String} Authorization   User's access token
   *
   * @apiSuccess (No Content 204)  Successfully leave room
   *
   * @apiError (Unauthorized 401) Unauthorized  Only authenticated users can delete the data
   * @apiError (Forbidden 403)    Forbidden     Only user with same id or admins can delete the data
   * @apiError (Not Found 404)    NotFound      User does not exist
   */
  .delete(authorize(), controller.removeUser);


module.exports = router;
