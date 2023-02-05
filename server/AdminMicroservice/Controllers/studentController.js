import amqp from 'amqplib/callback_api.js';
import logger from '../logger/logger.js';
import studentModel from '../Models/studentModel.js';

export const getAllStudentRecords = async (req, res) => {
    /**
     * Returns data about all the students
     * @return {json} students - A JSON data containing about the students
     */
    try {
        const students = await studentModel.find().sort({ 'authorized': 1 });
        return res.status(200).json({ students });
    } catch (error) {
        logger.error(error.message);
        return res.status(500).json({ success: false, error: error.message });
    }
}

export const createBulkStudents = async (req, res) => { 
    /**
     * Activates the students account for issuing books
     * @param {Array} students - An array of all the students whose accounts need to be activated
     * @return {json} message - Informing about successful activation of students accounts
     */
    try {
        for (const data in req.body) {
            await insertUsers(req.body[data]);
            logger.info(`Successfully authorized student with email ${req.body[data].email}`);
        }
        return res.status(200).json({ 'message': 'done' });
    } catch (error) {
        logger.error(error.message);
        return res.status(500).json({ success: false, error: error.message });
    }
}

export const removeStudent = async (req, res) => {
    /**
     * Returns data about all the students
     * @param {string} email - Email of student whose account needs to be deactivated 
     * @return {json} students - A JSON data containing about the students
     */
    try {
        await studentModel.deleteOne({ email: req.body.email });
        logger.info(`[${req.body.email}] account deleted`)
        return res.status(201).message({ message: 'Done!' });
    } catch (error) {
        logger.error(error.message);
        return res.status(500).json({ success: false, error: error.message });
    }
}

async function insertUsers(student) {
    /**
     * Helper function to authorize students
     */
    try {
        await studentModel.updateOne( {email: student.email}, { $set: { authorized: true }} );
        insertUsertoQueue(student.email);
    } catch (error) {
        logger.error(error.message);
    }
}

function insertUsertoQueue(email) {
    /**
     * Helper function to send out the notification email to queue
     */
    amqp.connect(process.env.RABBITMQ_URI, function(error0, connection) {
        if (error0) {
            throw error0;
        }
        connection.createChannel(function(error1, channel) {
            if (error1) {
                throw error1;
            }
            var queue = 'AuthorizedUserQueue';
            var msg = {
                email,
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