import * as dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import logger from './logger/logger.js';
import connectDB from './db/Connection.js';
import booksRouter from './Routes/Books.js';
import studentRouter from './Routes/Student.js';
import issueRouter from './Routes/Issues.js';
import librarianRouter from './Routes/Librarian.js';
import dataRouter from './Routes/Data.js';

const app = express();
app.use(cors());

// DB Connection
connectDB();

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, console.log(`Server running on ${PORT}`));

app.use(express.json());

app.use('/api/admin/books', booksRouter);
app.use('/api/admin/student', studentRouter);
app.use('/api/admin/issue', issueRouter);
app.use('/api/admin/librarian', librarianRouter);
app.use('/api/admin/data', dataRouter);

process.on('unhandlededRejection', (error, data) => {
    logger.error(error.message);
    console.log(error);
    server.close(() => process.exit(1));
});

