import express from 'express';
import isAuthenticated from '../Middleware/Auth.js';
import { paymentInfo } from '../Controllers/paymentController.js';

const paymentRouter = express.Router();

//@route - /api/user/payment/get-info
paymentRouter.get('/get-info', isAuthenticated, paymentInfo);

export default paymentRouter;