const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/activity.controller');
const { authorize, ADMIN, LOGGED_USER } = require('../../middlewares/auth');
const {
  listActivities,
  createActivity,
  updateActivity,
} = require('../../validations/activity.validation');

const router = express.Router();

/**
 * Load poduct when API with activityId route parameter is hit
 */
router.param('activityId', controller.load);

router
  .route('/')
  /**
   * @api {get} v1/activities List Activities
   * @apiDescription Get a list of activities
   * @apiVersion 1.0.0
   * @apiName ListActivities
   * @apiGroup Activity
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization   User's access token
   *
   * @apiParam  {Number{1-}}         [page=1]     List page
   * @apiParam  {Number{1-100}}      [perPage=1]  Activities per page
   * @apiParam  {String}             [key]      Activity's key
   *
   * @apiSuccess {Object[]} activity List of activities.
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   */
  .get(authorize(), validate(listActivities), controller.list)
  /**
   * @api {post} v1/activities Create activity
   * @apiDescription Create a new activity
   * @apiVersion 1.0.0
   * @apiName CreateActivity
   * @apiGroup Activity
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization   User's access token
   *
   * @apiParam  {String}             key     Activity's key
   * @apiParam  {Object}             value     Activity's value
   * @apiParam  {String}             deviceId     Activity's deviceId
   *
   * @apiSuccess (No Content 204)  Successfully create
   *
   * @apiError (Bad Request 400)   ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401)  Unauthorized     Only authenticated users can create the data
   */
  .post(authorize(), validate(createActivity), controller.create);

router
  .route('/:activityId')
  /**
   * @api {patch} v1/activities/:id Update Activity
   * @apiDescription Update some fields of a activity document
   * @apiVersion 1.0.0
   * @apiName UpdateActivity
   * @apiGroup Activity
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization   User's access token
   *
   * @apiParam  {String}             key     Activity's model
   * @apiParam  {Object}             value     Activity's value
   * @apiParam  {String}             deviceId     Activity's deviceId
   *
   * @apiSuccess (No Content 204)  Successfully update
   *
   * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users can modify the data
   * @apiError (Not Found 404)    NotFound     Activity does not exist
   */
  .patch(authorize(), validate(updateActivity), controller.update)
  /**
   * @api {patch} v1/Activity/:id Delete Activity
   * @apiDescription Delete a activity for user
   * @apiVersion 1.0.0
   * @apiName DeleteActivity
   * @apiGroup Activity
   * @apiPermission user
   *
   * @apiHeader {String} Authorization   User's access token
   *
   * @apiSuccess (No Content 204)  Successfully deleted
   *
   * @apiError (Unauthorized 401) Unauthorized  Only authenticated users can delete the data
   * @apiError (Forbidden 403)    Forbidden     Only user with same id can delete the data
   * @apiError (Not Found 404)    NotFound      User does not exist
   */
  .delete(authorize(), controller.remove);

module.exports = router;
