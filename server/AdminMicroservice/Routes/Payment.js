import express from 'express';
import isAuthenticated from '../Middleware/Auth.js';
import { paymentInfo } from '../Controllers/paymentController.js';

const paymentRouter = express.Router();

//@route - /api/admin/payment/payment-info
paymentRouter.get('/payment-info', isAuthenticated, paymentInfo);

export default paymentRouter;