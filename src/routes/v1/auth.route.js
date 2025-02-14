const express = require("express");
const validate = require("../../middlewares/validate");
const authValidation = require("../../validations/auth.validation");
const authController = require("../../controllers/auth.controller");
// const auth = require('../../middlewares/auth');
const ifSessionPresent = require("../../middlewares/ifSessionPresent");

const router = express.Router();

router.post(
  "/register",
  validate(authValidation.register),
  authController.register
);
router.post(
  "/login",
  ifSessionPresent(1),
  validate(authValidation.login),
  authController.login
);
router.post("/logout", ifSessionPresent(0), authController.logout);
// router.post('/refresh-tokens', validate(authValidation.refreshTokens), authController.refreshTokens);

module.exports = router;
