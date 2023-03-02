import amqp from 'amqplib/callback_api.js';
import logger from '../logger/logger.js'
import { bootstrapMail } from '../Utils/BootstrapMail.js';

/**
 * Send mails to the users accounts which have been activated
 */
const accountActivated = async () => {
    amqp.connect(process.env.RABBITMQ_URI, function(error0, connection) {
        if (error0) {
            throw error0;
        }
        connection.createChannel(function(error1, channel) {
            if (error1) {
                throw error1;
            }

            var queue = 'AuthorizedUserQueue';

            channel.assertQueue(queue, {
                durable: true,
                
            });

            console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);

            channel.consume(queue, async function(msg) {
                const data = JSON.parse(msg.content.toString());
                bootstrapMail('accountActivatedMail', { url: process.env.FRONTEND_URL }, data.email, 'Your account has been authorized');
                logger.info(`Send account activated mail to [${data.email}]`);
            }, {
                noAck: true
            });
        });
    });
}

export default accountActivated;