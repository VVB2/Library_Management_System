import amqp from 'amqplib/callback_api';
import logger from "../logger/logger.js";
import { updateAvailableBook } from "../queries/BookQueries.js";
import { increaseTotalBooksTakenCount } from "../queries/StudentQueries.js";
import { updateIssue, findStudent } from "../queries/IssueQueries.js";

export const returnBook = async (req,res) => {
    /**
     * Returns books
     * @param {int} accession_number - Accession number of the book
     * @param {ObjectId} book_id - Object Id of the book
     * @param {ObjectId} returned_to - Object Id of the librarian
     * @return {json} message - Successful return book
     */
    try {
        const today = new Date();
        const student_id = await findStudent(req.body.accession_number);
        await updateAvailableBook(req.body, "$push");
        await increaseTotalBooksTakenCount(student_id[0].student_id, -1);
        await updateIssue(req.body, today);
        sendNotification(student_id[0].student_id);
        logger.info(`Book with accession number '${req.body.accession_number}' returned on ${today.toLocaleDateString('en-GB')} to ${req.body.returned_to}`);
        res.status(200).json({ message: 'Book successfully returned' });
    } catch (error) {
        logger.error(error.message);
    }
}

function sendNotification(id) {
    amqp.connect('amqp://localhost', function(error0, connection) {
        if (error0) {
            throw error0;
        }
        connection.createChannel(function(error1, channel) {
            if (error1) {
                throw error1;
            }
            const queue = 'returnSuccess'
            var args = process.argv.slice(2);
            var msg = args.slice(1).join(' ') || 'Hello World!';

            channel.assertExchange(queue, 'direct', {
                durable: true
            });
            channel.publish(queue, id, Buffer.from(msg));
            console.log(" [x] Sent %s: '%s'", id, msg);
        });
        connection.close();
    });
}