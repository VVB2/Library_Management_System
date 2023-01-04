import * as dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import cron from 'node-cron';
import logger from './logger/logger.js';
import connectDB from './db/Connection.js';
import bookNotificationRouter from './Routes/BookNotification.js'

const app = express();
app.use(cors());

// DB Connection
connectDB();

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, console.log(`Server running on ${PORT}`));

app.use(express.json());

app.use('/api/notification/books', bookNotificationRouter);

cron.schedule('0 10 * * *', () => {
    console.log('running every 12 hours');
})

process.on('unhandlededRejection', (error, data) => {
    logger.error(`${(new Error().stack.split("at ")[1].split(" ")[0]).trim()}, ${(new Error().stack.split("at ")[1].split("/").pop().replace(")", ""))}`);
    console.log(error);
    server.close(() => process.exit(1));
});

