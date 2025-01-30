const ApiError = require('./ApiError');
const logger = require('../config/logger');

const ifUserDontExists = async (user) => {
    if (!user) {
        logger.error('User not found, user.service');
        throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }
};