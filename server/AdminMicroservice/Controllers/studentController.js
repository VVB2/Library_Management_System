import amqp from 'amqplib/callback_api.js';
import logger from '../logger/logger.js';
import studentModel from '../Models/studentModel.js';

export const getAllStudentRecords = async (req, res) => {
    try {
        const students = await studentModel.find().sort({ 'authorized': 1 });
        res.status(200).json({'data': students});
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const createBulkStudents = async (req, res) => { 
    try {
        for (let data in req.body) {
            await insertUsers(req.body[data]);
            logger.info(`Successfully authorized student with email ${req.body[data].email}`);
        }
        res.status(200).json({ 'message': 'done' });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

async function insertUsers(user) {
    try {
        await studentModel.updateOne( {email: user.email}, { $set: { authorized: true }} );
        insertUsertoQueue(user.email);
    } catch (error) {
        logger.error(error.message)
        console.log({ message: error.message });
    }
}

function insertUsertoQueue(email) {
    amqp.connect('amqp://localhost:5672', function(error0, connection) {

        if (error0) {
            throw error0;
        }

        connection.createChannel(function(error1, channel) {
            if (error1) {
                throw error1;
            }

            var queue = 'accountActivated';

            channel.assertQueue(queue, {
                durable: true
            });

            channel.sendToQueue(queue, Buffer.from(email));
        });

        setTimeout(function() {
            connection.close();
        }, 500);

    });
}