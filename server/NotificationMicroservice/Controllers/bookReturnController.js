import amqp from 'amqplib/callback_api.js';
import logger from '../logger/logger.js';
import { bootstrapMail } from '../Utils/BootstrapMail.js';

/**
 * Notifies(sending mail) the user about return of book
 */
const bookReturn = async () => {
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
                bootstrapMail('bookReturnMail', { username: data.username,
                    book: data.title,
                    image: data.image,
                    date: data.date,
                    no_of_days: data.no_of_days,
                }, data.email, 'About return book at earliest');
                logger.info(`Send return book mail to [${data.email}]`);
            }, {
                noAck: true
            });
        });
    });
}

export default bookReturn;