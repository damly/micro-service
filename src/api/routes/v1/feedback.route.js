const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/feedback.controller');
const { authorize, ADMIN, LOGGED_USER } = require('../../middlewares/auth');
const {
  listFeedbacks,
  createFeedback,
  updateFeedback,
} = require('../../validations/feedback.validation');

const router = express.Router();

/**
 * Load poduct when API with feedbackId route parameter is hit
 */
router.param('feedbackId', controller.load);

router
  .route('/')
  /**
   * @api {get} v1/feedbacks List Feedbacks
   * @apiDescription Get a list of feedbacks
   * @apiVersion 1.0.0
   * @apiName ListFeedbacks
   * @apiGroup Feedback
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization   User's access token
   *
   * @apiParam  {Number{1-}}         [page=1]     List page
   * @apiParam  {Number{1-100}}      [perPage=1]  Feedbacks per page
   * @apiParam  {String}             [email]      Feedback's model
   * @apiSuccess {Object[]} feedback List of feedbacks.
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
  .get(authorize(), validate(listFeedbacks), controller.list)
  /**
   * @api {post} v1/feedbacks Create feedback
   * @apiDescription Create a new feedback
   * @apiVersion 1.0.0
   * @apiName CreateFeedback
   * @apiGroup Feedback
   * @apiPermission user
   *
   * @apiHeader {String} Authorization   User's access token
   *
   * @apiParam  {String}             email     Feedback's email
   * @apiParam  {String}             subject     Feedback's subject
   * @apiParam  {String}             content     Feedback's content
   *
   * @apiSuccess (Created 201) {String}  email         Feedback's email
   * @apiSuccess (Created 201) {String}  subject       Feedback's subject
   * @apiSuccess (Created 201) {String}  content       Feedback's content
   * @apiSuccess (Created 201) {Date}    createdAt  Timestamp
   *
   * @apiError (Bad Request 400)   ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401)  Unauthorized     Only authenticated users can create the data
   */
  .post(authorize(), validate(createFeedback), controller.create);

router
  .route('/:feedbackId')
  /**
   * @api {patch} v1/feedbacks/:id Update feedback
   * @apiDescription Update some fields of a feedback document
   * @apiVersion 1.0.0
   * @apiName UpdateFeedback
   * @apiGroup Feedback
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization   User's access token
   *
   * @apiParam  {String}             reply     Feedback's reply message
   *
   * @apiSuccess (Created 201) {String}  email         Feedback's email
   * @apiSuccess (Created 201) {String}  subject       Feedback's subject
   * @apiSuccess (Created 201) {String}  content       Feedback's content
   * @apiSuccess (Created 201) {Date}    createdAt  Timestamp
   *
   * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users can modify the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id or admins can modify the data
   * @apiError (Not Found 404)    NotFound     Feedback does not exist
   */
  .patch(authorize(ADMIN), validate(updateFeedback), controller.update);


module.exports = router;
