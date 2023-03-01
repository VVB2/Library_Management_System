import amqp from 'amqplib/callback_api.js';
import logger from '../logger/logger.js';
import { bootstrapMail } from '../Utils/BootstrapMail.js';

/**
 * Sends mail informing about book availability 
 */
const watchList = async () => {
    amqp.connect(process.env.RABBITMQ_URI, function(error0, connection) {
        if (error0) {
            throw error0;
        }
        connection.createChannel(function(error1, channel) {
            if (error1) {
                throw error1;
            }

            var queue = 'WatchListQueue';

            channel.assertQueue(queue, {
                durable: true
            });

            console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);

            channel.consume(queue, async function(msg) {
                const data = JSON.parse(msg.content.toString());
                bootstrapMail('watchListMail', { username: data.username, url: data.bookInfo.url, title: data.bookInfo.title }, data.email, 'Book is available');
                logger.info(`Send watch list mail to [${data.email}]`);
            }, {
                noAck: true
            });
        });
    });
}

export default watchList;