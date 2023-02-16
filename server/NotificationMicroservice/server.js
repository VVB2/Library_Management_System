import * as dotenv from 'dotenv';
dotenv.config();
import logger from './logger/logger.js';
import connectDB from './db/Connection.js';
import bookReturnController from './Controllers/bookReturnController.js';
import AccountActivatedController from './Controllers/AccountActivatedController.js';
import forgotPassword from './Controllers/ForgotPasswordController.js';
import updatePassword from './Controllers/UpdatePasswordController.js';

// DB Connection
connectDB();

bookReturnController();
AccountActivatedController();
forgotPassword();
updatePassword();

process.on('unhandlededRejection', (error, data) => {
    logger.error(error.message);
    server.close(() => process.exit(1));
});

