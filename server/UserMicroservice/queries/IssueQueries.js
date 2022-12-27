import amqp from 'amqplib/callback_api.js';
import issueModel from "../Models/issueModel.js";

export const createIssueAndBookReturnNotification = async (param) => {
    await issueModel.create({
        book_id: param.book_id,
        accession_number: param.accession_number,
        student_id: param.student_id,
    });
    amqp.connect(process.env.RABBITMQ_URI, function(error0, connection) {
        if (error0) {
            throw error0;
        }
        connection.createChannel(function(error1, channel) {
            if (error1) {
            throw error1;
            }
            var queue = 'ReturnNotificationQueue';
            var msg = {
                book_id: param.book_id,
                accession_number: param.accession_number,
                student_id: param.student_id, 
                return_by: new Date(new Date().setDate(new Date().getDate() + 6))
            };

            channel.assertQueue(queue, {
                durable: true
            });
            channel.sendToQueue(queue, Buffer.from(JSON.stringify(msg)), {
                persistent: true
            });

            console.log(" [x] Sent %s", msg);
        });
        setTimeout(function() {
            connection.close();
        }, 500);
    });
}
