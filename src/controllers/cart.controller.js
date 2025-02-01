const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const cartService = require('../services/cart.service');

const addItemsToCart = catchAsync(async (req, res) => {
  const { productId, quantity } = req.body;
  const cart = await cartService.addItemsToCart(req.user.sub, productId, quantity);
  res.status(httpStatus.status.OK).send(cart);
});

const removeItemsFromCart = catchAsync(async (req, res) => {
  const { productId, quantity } = req.body;
  const cart = await cartService.removeItemsFromCart(req.user.sub, productId, quantity);
  res.status(httpStatus.status.OK).send(cart);
});

const getCart = catchAsync(async (req, res) => {
  const cart = await cartService.getCart(req.user.sub);
  res.status(httpStatus.status.OK).send(cart);
});

const clearCart = catchAsync(async (req, res) => {
  const cart = await cartService.clearCart(req.user.sub);
  res.status(httpStatus.status.NO_CONTENT).send();
});

module.exports = {
  addItemsToCart,
  removeItemsFromCart,
  getCart,
  clearCart,
};