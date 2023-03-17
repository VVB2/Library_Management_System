import amqp from 'amqplib/callback_api.js';
import logger from '../logger/logger.js';
import { bootstrapMail } from '../Utils/BootstrapMail.js';

/**
 * Sends mail informing about successful update of users password 
 */
const updatePassword = async () => {
    amqp.connect(process.env.RABBITMQ_URI, function(error0, connection) {
        if (error0) {
            throw error0;
        }
        connection.createChannel(function(error1, channel) {
            if (error1) {
                throw error1;
            }

            const queue = 'UpdatePasswordQueue';

            channel.assertQueue(queue, {
                durable: true
            });

            console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);

            channel.consume(queue, async function(msg) {
                const data = JSON.parse(msg.content.toString());
                bootstrapMail('passwordUpdateMail', { username: data.username }, data.email, 'Password Updated Successfully');
                logger.info(`Send password update mail to [${data.email}]`);
            }, {
                noAck: true
            });
        });
    });
}

export default updatePassword;