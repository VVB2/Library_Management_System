#!/usr/bin/env node

var amqp = require('amqplib/callback_api');

amqp.connect(process.env.MONGO_URI, function(error0, connection) {
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

        channel.consume(queue, function(msg) {
            console.log(" [x] Received %s", msg.content.toString());
        }, {
            noAck: true
        });

        channel.assertQueue('bookAvailable', {
            durable: true
        });

        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", 'test');

        channel.consume('bookAvailable', function(msg) {
            console.log(" [x] Received %s", msg.content.toString());
        }, {
            noAck: true
        });
    });
    // setTimeout(function() {
    //     connection.close();
    //     process.exit(0)
    // }, 500);
});