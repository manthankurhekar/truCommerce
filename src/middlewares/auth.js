const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const jwt = require('jsonwebtoken');
const logger = require('../config/logger');
const config = require('../config/config');
const catchAsync = require("../utils/catchAsync");
const Token = require('../models/token.model');

const auth = () => catchAsync(async (req, res, next) => {
    const authHeader = req.headers["authorization"];
    if(!authHeader || !authHeader.startsWith("Bearer")) {
      throw new ApiError(httpStatus.status.BAD_REQUEST, "Authorization header with jwt missing");
    }
    const token = authHeader.split(" ")[1]; // bearer token
    logger.info(token);
    const payload = await jwt.verify(token, config.jwt.secret);
    req.user = payload;
    logger.info(typeof(req.user.sub));
    next();
});

module.exports = auth;
