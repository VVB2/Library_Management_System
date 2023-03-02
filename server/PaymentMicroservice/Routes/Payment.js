import express from 'express';
import { payFine } from '../Controllers/paymentController.js';

const paymentRouter = express.Router();

//@route - /api/payment/pay-fine
paymentRouter.post('/pay-fine', payFine);

export default paymentRouter;