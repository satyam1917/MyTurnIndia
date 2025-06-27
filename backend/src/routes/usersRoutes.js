const express = require('express');
const { signup, signin, verify_email, reset_password_email_verification, reset_password, getUserDeatils, google, uploadProfileImage, updateProfile, sendEmail } = require('../controllers/usersControllers');
const { verify } = require('jsonwebtoken');
const userAuth = require('../middleware/userAuth');
const {upload}=require('../multer/multerConfig');
const usersRouter = express.Router();

usersRouter.post('/signup', signup);
usersRouter.post('/signin', signin);
usersRouter.post('/verify-email', verify_email);
usersRouter.post('/reset-password-email-verification', reset_password_email_verification);
usersRouter.post('/reset-password', reset_password);
usersRouter.get('/user-details', userAuth, getUserDeatils);
usersRouter.post('/google',google);
usersRouter.post('/upload-profile-image',userAuth,upload.single('profileImage'),uploadProfileImage);
usersRouter.put("/upload-profile",userAuth,updateProfile);
usersRouter.post('/send-email',sendEmail);

module.exports = usersRouter;