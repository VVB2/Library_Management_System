import express from 'express';
import { processPayment } from '../Controllers/paymentController.js';

const paymentRouter = express.Router();

//@route - /api/payment/processPayment
paymentRouter.post('/processPayment', processPayment);

export default paymentRouter;