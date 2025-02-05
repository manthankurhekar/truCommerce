const Cart = require("../models/cart.model");
const Product = require("../models/product.model");
const User = require("../models/user.model");
const ApiError = require("../utils/ApiError");
const httpStatus = require("http-status");

const addItemsToCart = async (userId, productId, quantity) => {
  // user nahi present to galat id bheji h add krne ke liye
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(httpStatus.status.NOT_FOUND, "User not found");
  }

  // product nahi h to add hi nahi ho skta
  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(httpStatus.status.NOT_FOUND, "Product not found");
  }

  // if the cart is not already present then build a new cart
  let cart = await Cart.findOne({ userId });
  if (!cart) {
    cart = new Cart({ userId, products: [] });
  }

  // if the product which we want to add is already present
  // then we only need to increase the quantity
  const itemIndex = cart.products.findIndex(
    (item) => item.productId.toString() === productId.toString()
  );
  if (itemIndex > -1) {
    cart.products[itemIndex].quantity += quantity;
  } else {
    cart.products.push({ productId, quantity });
  }

  await cart.save();
  return cart;
};

const removeItemsFromCart = async (userId, productId, quantity) => {
    // Find the cart for the given user
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      throw new ApiError(httpStatus.status.NOT_FOUND, "Cart not found");
    }
  
    // Find the product in the cart
    const itemIndex = cart.products.findIndex(
      (item) => item.productId.toString() === productId.toString()
    );
    
    // product not found
    if (itemIndex === -1) {
      throw new ApiError(httpStatus.status.NOT_FOUND, "Product not found in cart");
    }
  
    // if the given product count is greater than what is present 
    // we can't reduce it
    if(cart.products[itemIndex].quantity < quantity) {
        throw new ApiError(httpStatus.status.BAD_REQUEST, "Provided product quantity exceeds present product quantity");
    }
    // Decrease the quantity or remove the product if quantity is zero or less
    cart.products[itemIndex].quantity -= quantity;
  
    await cart.save();
    return cart;
  };
  
const getCart = async (userId) => {
    // the populate method is used to print the whole details of the product
    // for every corresponding productId
  let cart = await Cart.findOne({ userId }).populate("products.productId");
  if (!cart) {
    cart = new Cart({ userId, products: [] });
    await cart.save();
    return cart;
  }
  return cart;
};

const clearCart = async (userId) => {
  const cart = await Cart.findOne({ userId });
  if (!cart) {
    throw new ApiError(httpStatus.status.NOT_FOUND, "Cart not found");
  }

  cart.products = [];
  await cart.save();
  return cart;
};

module.exports = {
  addItemsToCart,
  removeItemsFromCart,
  getCart,
  clearCart,
};
