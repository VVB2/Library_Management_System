import * as dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import cron from 'node-cron';
import morgan from 'morgan';
import logger from './logger/logger.js';
import connectDB from './db/Connection.js';
import booksRouter from './Routes/Books.js';
import studentRouter from './Routes/Student.js';
import issueRouter from './Routes/Issues.js';
import ErrorHandler from './Middleware/Error.js';
// import { checkReturnBooks } from './Utils/CrobJobHelper.js';

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

// Check for book to be returned
const job = cron.schedule("0 10 * * * ", async () => {
    logger.info('Checking to send Book Return Mail');
    // await checkReturnBooks();
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, console.log(`Server running on ${PORT}`));
logger.info(`UserMicroservice running on [${PORT}]`)

app.use(express.json());
app.use(morganMiddleware);

app.use('/api/user/books', booksRouter);
app.use('/api/user/student', studentRouter);
app.use('/api/user/issue', issueRouter);
  
job.start();

app.use(ErrorHandler);

process.on('unhandlededRejection', (error, data) => {
    logger.error(error.message);
    server.close(() => process.exit(1));
});

