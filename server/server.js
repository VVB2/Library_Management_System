import express from 'express';
import cors from 'cors';
import connectDB from './db/Connection.js';
import router from './Routes/Books.js';

const app = express();
app.use(cors());

//DB Connection
connectDB();

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, console.log(`Server running on ${PORT}`));

app.use(express.json());

app.use('/api/books', router);

process.on('unhandlededRejection', (error, data) => {
    console.log(error);
    server.close(() => process.exit(1));
});

