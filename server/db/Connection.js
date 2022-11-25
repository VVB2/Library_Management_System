import * as dotenv from 'dotenv';
dotenv.config();
import mongoose from "mongoose";
import logger from '../logger/logger.js';

//Connect to MongoDB
const connString = process.env.MONGO_URI;

const connectDB = async () => {
    try {
        await mongoose.connect(connString, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Database connection successful');
    } catch (err) {
        logger.error(err)
        // console.log(err);
        process.exit(1);
    }
};

export default connectDB;