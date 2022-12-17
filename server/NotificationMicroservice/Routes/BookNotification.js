import express from 'express';
import { createBookNotification } from '../Controllers/bookAvailableNotificationController.js';

const bookNotificationRouter = express.Router();

//@route - /api/notification/books/book-available-notification
bookNotificationRouter.post('/book-available-notification', createBookNotification);

export default bookNotificationRouter;