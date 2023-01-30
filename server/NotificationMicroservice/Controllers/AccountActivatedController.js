import amqp from 'amqplib/callback_api.js';
import { main } from '../Utils/BootstrapMail.js';

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
                const data = msg.content.toString();
                console.log(data);
                main('accountActivatedMail', { url: 'http://localhost:3000' });
            }, {
                noAck: true
            });
        });
    });
}

export default accountActivated;