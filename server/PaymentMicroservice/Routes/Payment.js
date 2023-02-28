import express from 'express';
import isAuthenticated from '../Middleware/Auth.js';
import { payFine } from '../Controllers/paymentController.js';

const paymentRouter = express.Router();

//@route - /api/payment/pay-fine
paymentRouter.post('/pay-fine', isAuthenticated, payFine);

export default paymentRouter;