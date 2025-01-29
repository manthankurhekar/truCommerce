const httpStatus = require('http-status');
const { User } = require('../models');
const ApiError = require('../utils/ApiError');

const createUser = async (userBody) => {
  if (await User.isEmailTaken(userBody.email)) {
    logger.error('Email already taken, user.service');
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  logger.info('User created, user.service');
  const user = await User.create(userBody);
  return user;
};

const getUserByEmail = async (email) => {
  return User.findOne({ email });
};

const getUserById = async (id) => {
  return User.findById(id);
};

const updateUserById = async (userId, updateBody) => {
  const user = await getUserById(userId);
  if (!user) {
    logger.error('User not found, user.service');
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (updateBody.email && (await User.isEmailTaken(updateBody.email, userId))) {
    logger.error('Email already taken, user.service');
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  Object.assign(user, updateBody);
  await user.save();
  logger.info('User updated, user.service');
  return user;
};

const deleteUserById = async (userId) => {
  const user = await getUserById(userId);
  if (!user) {
    logger.error('User not found, user.service');
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  logger.info('User deleted, user.service');
  await user.remove();
  return user;
};

module.exports = {
  createUser,
  getUserByEmail,
  getUserById,
  updateUserById,
  deleteUserById,
};