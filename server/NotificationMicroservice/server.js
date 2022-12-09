import * as dotenv from 'dotenv';
dotenv.config();
import { createServer } from "http";
import express from 'express';
import { Server } from "socket.io";
import cors from 'cors';
import logger from './logger/logger.js';
import connectDB from './db/Connection.js';
import booksRouter from './Routes/Books.js';
import studentRouter from './Routes/Student.js';
import issueRouter from './Routes/Issues.js';

const app = express();
app.use(cors());
app.use(express.json());
const httpServer = createServer(app);

// DB Connection
connectDB();

const PORT = process.env.PORT || 5000;

const io = new Server(httpServer, { /* options */ });

io.on("connection", (socket) => {
    console.log('user connected');
});

httpServer.listen(PORT, console.log(`Notification server running on ${PORT}`));

app.use('/api/user/books', booksRouter);
app.use('/api/user/student', studentRouter);
app.use('/api/user/issue', issueRouter);

process.on('unhandlededRejection', (error, data) => {
    logger.error(error.message);
    console.log(error);
    server.close(() => process.exit(1));
});
