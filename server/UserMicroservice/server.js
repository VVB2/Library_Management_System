import * as dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import logger from './logger/logger.js';
import connectDB from './db/Connection.js';
import booksRouter from './Routes/Books.js';
import studentRouter from './Routes/Student.js';
import issueRouter from './Routes/Issues.js';
import ErrorHandler from './Middleware/Error.js';

const app = express();
app.use(cors());

// DB Connection
connectDB();

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, console.log(`Server running on ${PORT}`));

app.use(express.json());

app.use('/api/user/books', booksRouter);
app.use('/api/user/student', studentRouter);
app.use('/api/user/issue', issueRouter);

app.use(ErrorHandler);

process.on('unhandlededRejection', (error, data) => {
    logger.error(`${(new Error().stack.split("at ")[1].split(" ")[0]).trim()}, ${(new Error().stack.split("at ")[1].split("/").pop().replace(")", ""))}`);
    console.log(error);
    server.close(() => process.exit(1));
});

