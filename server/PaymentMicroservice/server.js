import * as dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import logger from './logger/logger.js';
import connectDB from './db/Connection.js';
import paymentRouter from './Routes/Payment.js';
import ErrorHandler from './Middleware/Error.js';

const app = express();
app.use(cors());

// DB Connection
connectDB();

/**
 * Used to log incoming requests to the server
 */
const morganMiddleware = morgan(
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

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, console.log(`Server running on ${PORT}`));
logger.info(`PaymentMicroservice running on [${PORT}]`)

app.use(express.json());
app.use(morganMiddleware);

app.use(express.json());

app.use('/api/payment', paymentRouter);

app.use(ErrorHandler);

process.on('unhandlededRejection', (error, data) => {
    logger.error(error.message);
    server.close(() => process.exit(1));
});

