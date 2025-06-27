const express=require('express');
const {createOrder, verifyPayment, verifyEventPayment}=require('../controllers/razorpayController');
const userAuth = require('../middleware/userAuth');
const paymentRouter=express.Router();

paymentRouter.post('/create',userAuth,createOrder);
paymentRouter.post('/verify',userAuth,verifyPayment);
paymentRouter.post('/verify-event',userAuth,verifyEventPayment);

module.exports=paymentRouter;