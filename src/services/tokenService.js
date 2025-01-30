const jwt = require("jsonwebtoken");
const moment = require("moment");
const config = require("../config/config");
const userService = require("./user.service");
const { Token } = require("../models");
const ApiError = require("../utils/ApiError");
const { tokenTypes } = require("../config/tokens");

// ye function basically userId, expiry and (access or refresh) type and secret leke
// jwt token generate karega
const generateToken = (userId, expires, type, secret) => {
  const payload = {
    sub: userId,
    iat: moment().unix(),
    exp: expires.unix(),
    type,
  };
  return jwt.sign(payload, secret);
};

// ye function jwt token ko save karega database me because refresh token must be
// saved in database so that access token firse reset ho pae
const saveToken = async (token, userId, expires, type, blacklisted = false) => {
  try {
    const tokenDoc = await Token.create({
      token,
      user: userId,
      expires: expires.toDate(),
      type,
      blacklisted,
    });
    return tokenDoc;
  } catch (err) {
    logger.error("Internal Server error, Token not created successfully...", err);
    throw new Error("Internal Server error, Token not saved successfully");
  }
};

// access token ko verify krke bhej rahe ho user ko uska payload
const verifyAccessToken = async (token) => {
    try {
        const payload = await jwt.verify(token, config.jwt.accessSecret);
        return payload; 
    } catch(err) {
        logger.error('Access Token not verified successfully...', err);
        throw new Error("Access Token not verified successfully...");
    } 
};

// refresh token ko verify kr rhe h exist krta h ki nahi database me
const verifyRefreshToken = async (token, type) => {
    const payload = jwt.verify(token, config.jwt.refreshSecret);
    const tokenDoc = await Token.findOne({
      token,
      type,
      user: payload.sub,
      blacklisted: false,
    });
    if (!tokenDoc) {
      throw new Error("Token not found");
    }
    return tokenDoc;
};

// ye function check krna kyuki access and refresh alag h
// access localStorage me stored rahega, not in db. refresh db me store hoga
const generateAuthTokens = async (user) => {
  const accessTokenExpires = moment().add( config.jwt.accessExpirationMinutes, "minutes" );
  const accessToken = generateToken( user.id, accessTokenExpires, tokenTypes.ACCESS );
  const refreshTokenExpires = moment().add(config.jwt.refreshExpirationDays, "days");
  const refreshToken = generateToken( user.id, refreshTokenExpires, tokenTypes.REFRESH );
  await saveToken( refreshToken, user.id, refreshTokenExpires, tokenTypes.REFRESH );

  return {
    access: {       
      token: accessToken,
      expires: accessTokenExpires.toDate(),
    },
    refresh: {
      token: refreshToken,
      expires: refreshTokenExpires.toDate(),
    },
  };
};

module.exports = {
  generateToken,
  saveToken,
  verifyToken,
  generateAuthTokens,
};
