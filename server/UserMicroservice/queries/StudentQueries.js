import amqp from 'amqplib/callback_api.js';
import studentModel from "../Models/studentModel.js";

export const noOfBooksTaken = async (student_id) => {
    return await studentModel.find({"_id": student_id}, {"books_taken": 1, "_id": 0, "name": 1});
}

export const increaseTotalBooksTakenCount = async (student_id, count) => {
    await studentModel.updateOne({
        "_id": student_id
    },{ 
        "$inc": { "books_taken": count }
    })
}

export const checkAuthorized = async (student_id) => {
    return await studentModel.findById(student_id);
}

export const resetPasswordQueue = async ({ link, email, username }) => {
    amqp.connect(process.env.RABBITMQ_URI, function(error0, connection) {
        if (error0) {
            throw error0;
        }
        connection.createChannel(function(error1, channel) {
            if (error1) {
                throw error1;
            }
            const queue = 'ForgotPasswordQueue';
            const msg = {
                email: email,
                username: username,
                link
            }

            channel.assertQueue(queue, {
                durable: true
            });

            channel.sendToQueue(queue, Buffer.from(JSON.stringify(msg)));
            console.log(`[x] Sent to ${username}`);
        });

        setTimeout(function() {
            connection.close();
        }, 500);
    });
}

export const updatePasswordQueue = async ({ link, email, username }) => {
    amqp.connect(process.env.RABBITMQ_URI, function(error0, connection) {
        if (error0) {
            throw error0;
        }
        connection.createChannel(function(error1, channel) {
            if (error1) {
                throw error1;
            }
            const queue = 'UpdatePasswordQueue';
            const msg = {
                email: email,
                username: username,
            }

            channel.assertQueue(queue, {
                durable: true
            });

            channel.sendToQueue(queue, Buffer.from(JSON.stringify(msg)));
            console.log(`[x] Sent to ${username}`);
        });

        setTimeout(function() {
            connection.close();
        }, 500);
    });
}