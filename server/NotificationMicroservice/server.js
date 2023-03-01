import * as dotenv from 'dotenv';
dotenv.config();
import logger from './logger/logger.js';
import connectDB from './db/Connection.js';
import bookReturn from './Controllers/BookReturnController.js';
import accountActivated from './Controllers/AccountActivatedController.js';
import forgotPassword from './Controllers/ForgotPasswordController.js';
import updatePassword from './Controllers/UpdatePasswordController.js';
import watchList from './Controllers/WatchListController.js';
import paymentDone from './Controllers/PaymentDoneController.js';

// DB Connection
connectDB();

bookReturn();
accountActivated();
forgotPassword();
updatePassword();
watchList();
paymentDone();

process.on('unhandlededRejection', (error, data) => {
    logger.error(error.message);
    server.close(() => process.exit(1));
});

