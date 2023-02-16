import * as dotenv from 'dotenv';
dotenv.config();
import Stripe from "stripe";
import logger from '../logger/logger.js';
import studentModel from '../Models/studentModel.js';

export const payFine = async (req, res) => {
  const student_info = await studentModel.findById(req.body.student_id);
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  stripe.customers.create({
    email: student_info.email,
    source: 'tok_mastercard',
    name: student_info.name,
  })
  .then((customer) => {
    return stripe.charges.create({
        amount: (student_info.fine_pending + 5) * 100,     
        description: 'Late book return fine',
        currency: 'INR',
        customer: customer.id
    });
  })
  .then(async (charge) => {
    logger.info(`Payment of [${student_info.fine_pending}] done by [${student_info.name}]`);
    const receiptDetails = {
      amount: student_info.fine_pending,
      date: charge.created,
      brand: charge.payment_method_details.card.brand,
      last4: charge.payment_method_details.card.last4
    }
    addToQueue(student_info.email, student_info.name, student_info.fine_pending, receiptDetails);
    await studentModel.findByIdAndUpdate(req.body.student_id, { fine_pending: 0 });
    return res.status(201).json({ success: true, message: 'Success', charge });
  })
  .catch((error) => {
    logger.error(error.message);
    return res.status(500).json({ success: false, error: error.message });       
  });
}

function addToQueue(email, username, fine, receiptDetails) {
  amqp.connect(process.env.RABBITMQ_URI, function(error0, connection) {
    if (error0) {
        throw error0;
    }
    connection.createChannel(function(error1, channel) {
        if (error1) {
            throw error1;
        }
        var queue = 'PaymentDoneQueue';
        var msg = {
            email,
            username, 
            fine, 
            receiptDetails
        };

        channel.assertQueue(queue, {
            durable: true
        });

        channel.sendToQueue(queue, Buffer.from(JSON.stringify(msg)));
        console.log(`[x] Sent ${JSON.stringify(msg)}`);
    });
    setTimeout(function() {
        connection.close();
    }, 500);
  });
}