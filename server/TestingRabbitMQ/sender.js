var amqp = require('amqplib/callback_api');

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
            channel.publish(queue, 'test', Buffer.from(msg));
            console.log(" [x] Sent %s: '%s'", 'test', msg);
        });
        setTimeout(function() {
          connection.close();
          process.exit(0)
        }, 500);
});