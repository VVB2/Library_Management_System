import amqp from 'amqplib/callback_api.js';
import logger from "../logger/logger.js";
import { updateAvailableBook } from "../queries/BookQueries.js";
import { increaseTotalBooksTakenCount } from "../queries/StudentQueries.js";
import { updateIssue, findStudent } from "../queries/IssueQueries.js";
import { checkBookNotification } from '../queries/NotificationQuery.js';

export const returnBook = async (req,res) => {
    /**
     * Returns books
     * @param {int} accession_number - Accession number of the book
     * @param {ObjectId} book_id - Object Id of the book
     * @param {ObjectId} returned_to - Object Id of the librarian
     * @return {json} message - Successful return book
     */
    console.log(req.body);
    try {
        const today = new Date();
        const student_id = await findStudent(req.body.accession_number);
        await updateAvailableBook(req.body, "$push");
        await increaseTotalBooksTakenCount(student_id[0].student_id, -1);
        await updateIssue(req.body, today);
        const students = await checkBookNotification(req.body.book_id);
        if (students.length > 0)
            sendNotification(students);
        logger.info(`Book with accession number '${req.body.accession_number}' returned on ${today.toLocaleDateString('en-GB')} to ${req.body.returned_to}`);
        res.status(200).json({ message: 'Book successfully returned' });
    } catch (error) {
        logger.error(error.message);
    }
}

function sendNotification(students) {
    amqp.connect('amqp://localhost:5672', function(error0, connection) {
        if (error0) {
            throw error0;
        }
        connection.createChannel(function(error1, channel) {
            if (error1) {
                throw error1;
            }

            const bookAvailableQueue = 'bookAvailable';
            const emailNotificationQueue = 'emailNotification';

            channel.assertQueue(bookAvailableQueue, {
                durable: true
            });

            channel.sendToQueue(bookAvailableQueue, Buffer.from(JSON.stringify(students)));
            console.log(" [x] Sent '%s'", JSON.stringify(students));

            channel.assertQueue(emailNotificationQueue, {
                durable: true
            });

            channel.sendToQueue(emailNotificationQueue, Buffer.from(JSON.stringify(students)));
            console.log(" [x] Sent '%s' to '%s'", JSON.stringify(students), emailNotificationQueue);
        });
        setTimeout(function() {
            connection.close();
        }, 500);
    });
}