const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const productValidation = require('../../validations/product.validation');
const productController = require('../../controllers/product.controller');

const router = express.Router();

router
.route('/')
.get(productController.getProducts) // get Products
.post(validate(productValidation.createProduct), productController.createProduct); // create product

router
.route('/:productId')
.get(validate(productValidation.getProductById), productController.getProductById) // get product by Id
.put(validate(productValidation.updateProductById), productController.updateProductById) // update product by Id
.delete(validate(productValidation.deleteProductById), productController.deleteProductById); // delete product by Id

module.exports = router;

