import amqp from 'amqplib/callback_api.js';
import logger from "../logger/logger.js";
import { updateAvailableBook } from "../queries/BookQueries.js";
import { increaseTotalBooksTakenCount } from "../queries/StudentQueries.js";
import { updateIssue, findStudent } from "../queries/IssueQueries.js";

/**
 * Returns books
 * @param {int} accession_number - Accession number of the book
 * @param {ObjectId} book_id - Object Id of the book
 * @param {ObjectId} returned_to - Object Id of the librarian
 * @return {json} message - Successful return book
 */
export const returnBook = async (req,res) => {
    try {
        const today = new Date();
        const student_id = await findStudent(req.body.accession_number);
        const book = await updateAvailableBook(req.body, "$push");
        await increaseTotalBooksTakenCount(student_id[0].student_id, -1);
        await updateIssue(req.body, today);
        await pushToQueue(book[0].book_detail[0].title, student_id[0].student_id);
        logger.info(`Book with accession number '${req.body.accession_number}' returned on ${today.toLocaleDateString('en-GB')} to ${req.body.returned_to}`);
        return res.status(200).json({ message: 'Book successfully returned' });
    } catch (error) {
        logger.error(error.message);
        return res.status(500).json({ success: false, error: error.message });
    }
}

/**
 * Adds book which are returned to queue
 * @param {ObjectId} book_id - Object Id of the book
 * @param {ObjectId} student_id - Object Id of the student
 */
async function pushToQueue(book_id, student_id) {
    amqp.connect(process.env.RABBITMQ_URI, function(error0, connection) {
        if (error0) {
            throw error0;
        }
        connection.createChannel(function(error1, channel) {
            if (error1) {
                throw error1;
            }
            var queue = 'BookReturnedQueue';
            var msg = {
                book_id,
                student_id
            };

            channel.assertQueue(queue, {
                durable: true
            });

            channel.sendToQueue(queue, Buffer.from(JSON.stringify(msg)));
            console.log(" [x] Sent %s", msg);
        });
        setTimeout(function() {
            connection.close();
        }, 500);
    });
}