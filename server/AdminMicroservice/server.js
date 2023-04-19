import * as dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import ExpressMongoSanitize from 'express-mongo-sanitize';
import rateLimit from 'express-rate-limit';
import logger from './logger/logger.js';
import connectDB from './db/Connection.js';
import studentRouter from './Routes/Student.js';
import issueRouter from './Routes/Issues.js';
import librarianRouter from './Routes/Librarian.js';
import dataRouter from './Routes/Data.js';
import paymentRouter from './Routes/Payment.js';
import ErrorHandler from './Middleware/Error.js';

const app = express();
app.use(cors());

// DB Connection
connectDB();

const morganMiddleware = morgan(
    /**
     * Used to log incoming requests to the server
     */
    function (tokens, req, res) {
        return JSON.stringify({
            method: tokens.method(req, res),
            url: tokens.url(req, res),
            status: Number.parseFloat(tokens.status(req, res)),
            content_length: tokens.res(req, res, 'content-length'),
            response_time: Number.parseFloat(tokens['response-time'](req, res)),
        });
    },
    {
        stream: {
            // Configure Morgan to use our custom logger with the http severity
            write: (message) => {
                const data = JSON.parse(message);
                logger.http(`incoming-request`, data);
            },
        },
    }
)

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 100,
	standardHeaders: true, 
	legacyHeaders: false, 
})

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, console.log(`Server running on ${PORT}`));
logger.info(`AdminMicroservice running on [${PORT}]`);

app.use(express.json());
app.use(ExpressMongoSanitize());
app.use(limiter)

app.use(morganMiddleware);

app.use('/api/admin/student', studentRouter);
app.use('/api/admin/issue', issueRouter);
app.use('/api/admin/librarian', librarianRouter);
app.use('/api/admin/data', dataRouter);
app.use('/api/admin/payment', paymentRouter);

app.use(ErrorHandler);

process.on('unhandlededRejection', (error, data) => {
    logger.error(error.message);
    server.close(() => process.exit(1));
});

