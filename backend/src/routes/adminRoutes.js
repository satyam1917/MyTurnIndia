const express = require('express');
const { signup, signin,reset_password_email_verification,reset_password } = require('../controllers/adminControllers');
const adminRouter = express.Router();

adminRouter.post('/signin',signin);
adminRouter.post('/signup',signup);
adminRouter.post('/reset-password-email-verification',reset_password_email_verification);
adminRouter.post('/reset-password',reset_password);

module.exports = adminRouter;