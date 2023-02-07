import * as dotenv from 'dotenv';
dotenv.config();
import logger from './logger/logger.js';
import connectDB from './db/Connection.js';
import bookReturnController from './Controllers/bookReturnController.js';
import AccountActivatedController from './Controllers/AccountActivatedController.js';
import forgotPassword from './Controllers/ForgotPasswordController.js';

// DB Connection
connectDB();

bookReturnController();
AccountActivatedController();
forgotPassword();

process.on('unhandlededRejection', (error, data) => {
    logger.error(
      `${(new Error().stack.split("at ")[1].split(" ")[0]).trim()}, ${(new Error().stack.split("at ")[1].split("/").pop().replace(")", "")).trim()}`
    );
    console.log(error);
    server.close(() => process.exit(1));
});

