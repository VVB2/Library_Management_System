var amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost:5672', function(error0, connection) {
  if (error0) {
    throw error0;
  }
  connection.createChannel(function(error1, channel) {
    if (error1) {
      throw error1;
    }
    var queue = 'hello';
    var msg = 'Hello world';

    channel.assertQueue(queue, {
      durable: false
    });

    channel.sendToQueue(queue, Buffer.from(msg));
    console.log(" [x] Sent %s", msg);

    channel.assertQueue('test', {
      durable: false
    });

    channel.sendToQueue('test', Buffer.from('Testing new queue'));
    console.log(" [x] Sent %s", 'Testing new queue');
  });
  
  setTimeout(function() {
    connection.close();
    process.exit(0)
    }, 500);
});