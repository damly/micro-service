const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/room.controller');
const { authorize, ADMIN, LOGGED_USER } = require('../../middlewares/auth');
const {
  listRooms,
  createRoom,
  updateRoom,
} = require('../../validations/room.validation');

const router = express.Router();

/**
 * Load room when API with roomId route parameter is hit
 */
router.param('roomId', controller.load);

router
  .route('/')
  /**
   * @api {get} v1/rooms List Rooms
   * @apiDescription Get a list of rooms
   * @apiVersion 1.0.0
   * @apiName ListRooms
   * @apiGroup Room
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization   User's access token
   *
   * @apiParam  {Number{1-}}         [page=1]     List page
   * @apiParam  {Number{1-100}}      [perPage=1]  Rooms per page
   * @apiParam  {String}             [title]       room's title
   * @apiParam  {String}             [userId]       room's userId
   *
   * @apiSuccess {Object[]} rooms List of rooms.
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
  .get(authorize(ADMIN), validate(listRooms), controller.list)
  /**
   * @api {post} v1/rooms Create room
   * @apiDescription Create a new room
   * @apiVersion 1.0.0
   * @apiName CreateRoom
   * @apiGroup Room
   * @apiPermission user
   *
   * @apiHeader {String} Authorization   User's access token
   *
   * @apiParam  {String}             title     Room's title
   * @apiParam  {String}             userId     Room owner's id
   *
   * @apiSuccess (Created 201) {String}  id         Room's id
   * @apiSuccess (Created 201) {String}  userId       Room's owner
   * @apiSuccess (Created 201) {Date}    createdAt  Timestamp
   *
   * @apiError (Bad Request 400)   ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401)  Unauthorized     Only authenticated users can create the data
   */
  .post(authorize(), validate(createRoom), controller.create);

router
  .route('/:roomId')
  /**
   * @api {patch} v1/rooms/:id Update Room
   * @apiDescription Update some fields of a room document
   * @apiVersion 1.0.0
   * @apiName UpdateRoom
   * @apiGroup Room
   * @apiPermission user
   *
   * @apiHeader {String} Authorization   User's access token
   *
   * @apiParam  {String}             title     Room's title
   *
   * @apiSuccess {String}  id         Room's id
   * @apiSuccess {String}  title       Room's title
   * @apiSuccess {Date}    createdAt  Timestamp
   *
   * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users can modify the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id or admins can modify the data
   * @apiError (Not Found 404)    NotFound     Room does not exist
   */
  .patch(authorize(), validate(updateRoom), controller.update);


module.exports = router;
