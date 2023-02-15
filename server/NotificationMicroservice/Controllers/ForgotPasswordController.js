import amqp from 'amqplib/callback_api.js';
import logger from '../logger/logger.js';
import { bootstrapMail } from '../Utils/BootstrapMail.js';

/**
 * Sends mail about the link from which to reset password 
 */
const forgotPassword = async () => {
    amqp.connect(process.env.RABBITMQ_URI, function(error0, connection) {
        if (error0) {
            throw error0;
        }
        connection.createChannel(function(error1, channel) {
            if (error1) {
                throw error1;
            }

            var queue = 'ForgotPasswordQueue';

            channel.assertQueue(queue, {
                durable: true
            });

            console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);

            channel.consume(queue, async function(msg) {
                const data = JSON.parse(msg.content.toString());
                bootstrapMail('forgotPasswordMail', { username: data.username, link: data.link }, data.email, 'Password reset email');
                logger.info(`Send password reset mail to ${data.email}`);
            }, {
                noAck: true
            });
        });
    });
}

export default forgotPassword;