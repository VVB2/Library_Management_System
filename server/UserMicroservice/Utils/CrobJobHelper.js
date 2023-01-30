import amqp from 'amqplib/callback_api.js';
import moment from 'moment/moment.js';
import issueModel from "../Models/issueModel.js";
import studentModel from '../Models/studentModel.js';
import booksModel from '../Models/booksModel.js';

export const checkReturnBooks = async () => {
    const issues = await issueModel.find();
    for (const issue in issues) {
        const currDate = moment();
        const returnDate = moment(issues[issue].return_by, 'DD/MM/YYYY');
        if (returnDate.diff(currDate, 'days') <= 2) {
            const studentInfo = await studentModel.findById(issues[issue].student_id, {email: 1, name: 1});
            const bookInfo = await booksModel.find({ "accession_books_list": { "$all" : [issues[issue].accession_number] }});
            sendToQueue({
                username: studentInfo.name,
                title: bookInfo[0].book_detail.title,
                date: issues[issue].return_by,
                no_of_days: returnDate.diff(currDate, 'days'),
                email: studentInfo.email
             });
        }
    }
    return 'Done'
}

function sendToQueue(data) {
    amqp.connect(process.env.RABBITMQ_URI, function(error0, connection) {
        if (error0) {
            throw error0;
        }
        connection.createChannel(function(error1, channel) {
            if (error1) {
            throw error1;
            }
            var queue = 'BookReturnedQueue';
            var msg = {
                username: data.username,
                title: data.title,
                date: data.date,
                no_of_days: data.no_of_days,
                email: data.email, 
            };

            channel.assertQueue(queue, {
                durable: true
            });

            channel.sendToQueue(queue, Buffer.from(JSON.stringify(msg)));
            console.log(`[x] Sent ${msg}`);
        });
        setTimeout(function() {
            connection.close();
        }, 500);
    });
}