import * as dotenv from 'dotenv';
dotenv.config();
import logger from './logger/logger.js';
import express from 'express';
import cors from 'cors';
import connectDB from './db/Connection.js';
import booksRouter from './Routes/Books.js';
import userRouter from './Routes/User.js';
import issueRouter from './Routes/Issues.js';

const app = express();
app.use(cors());

//DB Connection
connectDB();

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, console.log(`Server running on ${PORT}`));

app.use(express.json());

app.use('/api/books', booksRouter);
app.use('/api/user', userRouter);
app.use('/api/issue', issueRouter);

process.on('unhandlededRejection', (error, data) => {
    logger.error(error.message);
    console.log(error);
    server.close(() => process.exit(1));
});

