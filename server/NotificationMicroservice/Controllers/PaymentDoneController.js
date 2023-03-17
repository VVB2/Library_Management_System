import amqp from 'amqplib/callback_api.js';
import moment from 'moment';
import logger from '../logger/logger.js';
import { bootstrapMail } from '../Utils/BootstrapMail.js';

/**
 * Sends mail informing about payment sucessfully done
 */
const paymentDone = async () => {
    amqp.connect(process.env.RABBITMQ_URI, function(error0, connection) {
        if (error0) {
            throw error0;
        }
        connection.createChannel(function(error1, channel) {
            if (error1) {
                throw error1;
            }

            const queue = 'PaymentDoneQueue';

            channel.assertQueue(queue, {
                durable: true
            });

            console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);

            channel.consume(queue, async function(msg) {
                const data = JSON.parse(msg.content.toString());
                bootstrapMail('paymentDoneMail', { username: data.username, amount: `${data.amount}`, date: moment.unix(data.receiptDetails.date).format("MMM DD, YYYY, hh:mm:ss A"), last4: data.receiptDetails.last4 }, data.email, 'Payment done Successfully!');
                logger.info(`Send watch list mail to [${data.email}]`);
            }, {
                noAck: true
            });
        });
    });
}

export default paymentDone;