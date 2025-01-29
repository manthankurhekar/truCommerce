const ApiError = require('./ApiError');
const logger = require('../config/logger');

const ifDataDontExists = async (object) => { 
  if (!object) {
    logger.error('Product not found');    
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }
}

module.exports = { ifDataExists };