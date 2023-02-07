import amqp from 'amqplib/callback_api.js';
import studentModel from '../Models/studentModel.js';

const bookReturnController = async () => {
    amqp.connect(process.env.RABBITMQ_URI, function(error0, connection) {
        if (error0) {
            throw error0;
        }
        connection.createChannel(function(error1, channel) {
            if (error1) {
                throw error1;
            }

            var queue = 'BookReturnedQueue';

            channel.assertQueue(queue, {
                durable: true
            });

            console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);

            channel.consume(queue, async function(msg) {
                const data = JSON.parse(msg.content.toString());
                const studentInfo = await studentModel.findById(data.student_id, {email: 1, name: 1});
                console.log(studentInfo);
            }, {
                noAck: true
            });
        });
    });
}

export default bookReturnController;