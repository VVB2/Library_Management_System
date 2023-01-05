import logger from '../logger/logger.js';
import bookNotificationModel from '../Models/bookNotificationModel.js';

export const createBookNotification = async (req, res) => { 
    /**
     * Creates
     * @param {book_id} email - ID of book to watch for
     * @param {student_id} password - Student ID who requested for notification
     * @return {json} message - Book Available Notification successfully created
     */
    try {
        createNotification(req.body);
        logger.info(`Book Available Notification for ${req.body.book_id} was created`);
        res.status(200).json({ message: 'Book Available Notification successfully created' });
    } catch (error) {
        logger.error(
      `${(new Error().stack.split("at ")[1].split(" ")[0]).trim()}, ${(new Error().stack.split("at ")[1].split("/").pop().replace(")", "")).trim()}`
    );
        res.status(404).json({ message: error.message });
    }
}

function createNotification(notification) {
    try {
        bookNotificationModel.create({
            book_id: notification.book_id,
            student_id: notification.student_id
        })
    } catch (error) {
        logger.error(
      `${(new Error().stack.split("at ")[1].split(" ")[0]).trim()}, ${(new Error().stack.split("at ")[1].split("/").pop().replace(")", "")).trim()}`
    );
        console.log({ message: error.message });
    }
}