import * as dotenv from 'dotenv';
dotenv.config();
import mongoose from "mongoose";

//Connect to MongoDB
const connString = process.env.MONGO_URI;

const connectDB = async () => {
    try {
        await mongoose.connect(connString, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Database connection successful');
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

export default connectDB;