const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/device.controller');
const { authorize, ADMIN, LOGGED_USER } = require('../../middlewares/auth');
const {
  listDevices,
  createDevice,
  updateDevice,
} = require('../../validations/device.validation');

const router = express.Router();

/**
 * Load poduct when API with deviceId route parameter is hit
 */
router.param('deviceId', controller.load);

router
  .route('/')
  /**
   * @api {get} v1/devices List Devices
   * @apiDescription Get a list of devices
   * @apiVersion 1.0.0
   * @apiName ListDevices
   * @apiGroup Device
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization   User's access token
   *
   * @apiParam  {Number{1-}}         [page=1]     List page
   * @apiParam  {Number{1-100}}      [perPage=1]  Devices per page
   * @apiParam  {String}             [uuid]       Device's uuid
   * @apiParam  {String}             [productId]  Device's productId
   * @apiParam  {Boolean}             [status]      Device's model
   * @apiSuccess {Object[]} product List of devices.
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
  .get(authorize(ADMIN), validate(listDevices), controller.list)
  /**
   * @api {post} v1/devices Create device
   * @apiDescription Create a new device
   * @apiVersion 1.0.0
   * @apiName CreateDevice
   * @apiGroup Device
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization   User's access token
   *
   * @apiParam  {String}             uuid     Device's uuid
   * @apiParam  {String}             productId     Device's productId
   * @apiParam  {Boolean}            status     Device's status
   *
   * @apiSuccess (Created 201) {String}  uuid         Device's uuid
   * @apiSuccess (Created 201) {String}  productId       Device's productId
   * @apiSuccess (Created 201) {String}  status       Device's status
   * @apiSuccess (Created 201) {Date}    createdAt  Timestamp
   *
   * @apiError (Bad Request 400)   ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401)  Unauthorized     Only authenticated users can create the data
   */
  .post(authorize(ADMIN), validate(createDevice), controller.create);

router
  .route('/:deviceId')
  /**
   * @api {patch} v1/devices/:id Update Device
   * @apiDescription Update some fields of a device document
   * @apiVersion 1.0.0
   * @apiName UpdateDevice
   * @apiGroup Device
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization   User's access token
   *
   * @apiParam  {String}             uuid     Device's uuid
   * @apiParam  {String}             productId     Device's productId
   * @apiParam  {Boolean}            status     Device's status
   *
   * @apiSuccess (Created 201) {String}  uuid         Device's uuid
   * @apiSuccess (Created 201) {String}  productId       Device's productId
   * @apiSuccess (Created 201) {String}  status       Device's status
   * @apiSuccess (Created 201) {Date}    createdAt  Timestamp
   *
   * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users can modify the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id or admins can modify the data
   * @apiError (Not Found 404)    NotFound     Device does not exist
   */
  .patch(authorize(ADMIN), validate(updateDevice), controller.update);


module.exports = router;
