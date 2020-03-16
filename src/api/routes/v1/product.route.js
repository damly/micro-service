const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/product.controller');
const { authorize, ADMIN, LOGGED_USER } = require('../../middlewares/auth');
const {
  listProducts,
  createProduct,
  updateProduct,
} = require('../../validations/product.validation');

const router = express.Router();

/**
 * Load poduct when API with productId route parameter is hit
 */
router.param('productId', controller.load);

router
  .route('/')
  /**
   * @api {get} v1/products List Products
   * @apiDescription Get a list of products
   * @apiVersion 1.0.0
   * @apiName ListProducts
   * @apiGroup Product
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization   User's access token
   *
   * @apiParam  {Number{1-}}         [page=1]     List page
   * @apiParam  {Number{1-100}}      [perPage=1]  Products per page
   * @apiParam  {String}             [model]      Product's model
   *
   * @apiSuccess {Object[]} product List of products.
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
  .get(authorize(ADMIN), validate(listProducts), controller.list)
  /**
   * @api {post} v1/products Create product
   * @apiDescription Create a new product
   * @apiVersion 1.0.0
   * @apiName CreateProduct
   * @apiGroup Product
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization   User's access token
   *
   * @apiParam  {String}             model     Product's model
   * @apiParam  {String}             name     Product's name
   * @apiParam  {String}             describe     Product's describe
   *
   * @apiSuccess (Created 201) {String}  model         Product's model
   * @apiSuccess (Created 201) {String}  name       Product's name
   * @apiSuccess (Created 201) {String}  describe       Product's describe
   * @apiSuccess (Created 201) {Date}    createdAt  Timestamp
   *
   * @apiError (Bad Request 400)   ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401)  Unauthorized     Only authenticated users can create the data
   */
  .post(authorize(ADMIN), validate(createProduct), controller.create);

router
  .route('/:productId')
  /**
   * @api {patch} v1/products/:id Update Product
   * @apiDescription Update some fields of a product document
   * @apiVersion 1.0.0
   * @apiName UpdateProduct
   * @apiGroup Product
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization   User's access token
   *
   * @apiParam  {String}             model     Product's model
   * @apiParam  {String}             name     Product's name
   * @apiParam  {String}             describe     Product's describe
   *
   * @apiSuccess (Created 201) {String}  model         Product's model
   * @apiSuccess (Created 201) {String}  name       Product's name
   * @apiSuccess (Created 201) {String}  describe       Product's describe
   * @apiSuccess (Created 201) {Date}    createdAt  Timestamp
   *
   * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users can modify the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id or admins can modify the data
   * @apiError (Not Found 404)    NotFound     Product does not exist
   */
  .patch(authorize(ADMIN), validate(updateProduct), controller.update);


module.exports = router;
