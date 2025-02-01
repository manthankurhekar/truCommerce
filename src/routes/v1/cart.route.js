const express = require('express');
const validate = require('../../middlewares/validate');
const cartController = require('../../controllers/cart.controller');
const cartValidation = require('../../validations/cart.validation');
const auth = require('../../middlewares/auth');

const router = express.Router();

router 
   .route('/')
   .post(auth(), validate(cartValidation.addItemsToCart), cartController.addItemsToCart)
   .delete(auth(), validate(cartValidation.removeItemsFromCart), cartController.removeItemsFromCart);

router
    .route('/:userId')
    .get(auth(), validate(cartValidation.getCart), cartController.getCart)
    .delete(auth(), validate(cartValidation.clearCart), cartController.clearCart);

module.exports = router;