const httpStatus = require('http-status');
const { Product } = require('../models');
const { ifDataDontExists } = require('../utils/serviceUtil');

const createProduct = async (productBody) => {
  const product = await Product.create(productBody);
  return product;
};

const getProductById = async (id) => {
  const product = await Product.findById(id);
  ifDataDontExists(product);
  return product;
};

const updateProductById = async (productId, updateBody) => {
  const product = await getProductById(productId);
  ifDataDontExists(product);
  Object.assign(product, updateBody);
  await product.save();
  return product;
};

const deleteProductById = async (productId) => {
  const product = await getProductById(productId);
  ifDataDontExists(product);
  await product.remove();
  return product;
};

module.exports = {
  createProduct,
  queryProducts,
  getProductById,
  updateProductById,
  deleteProductById,
};