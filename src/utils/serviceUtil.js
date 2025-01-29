const ApiError = require('../utils/ApiError');

const ifDataExists = async (object) => { 
  if (!object) {
    logger.error('Data not found');
    throw new NotFoundError('Data not found');
  }
  return object;
}