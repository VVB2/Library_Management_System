import amqp from 'amqplib/callback_api.js';
import issueModel from "../Models/issueModel.js";
import watchListModel from "../Models/watchListModel.js";
import studentModel from "../Models/studentModel.js";
import booksModel from '../Models/booksModel.js';

export const updateIssue = async (param, date) => {
    await issueModel.findOneAndUpdate(
        { "accession_number": param.accession_number }, 
        { "returned_on": date, "returned_to": param.returned_to },
        { "sort": { "issued_on": -1 } }
    );
}

export const findStudent = async (param) => {
    return issueModel.find(
        { "accession_number": param },
    ).sort({"issued_on": -1}).limit(1);
}

export const checkWatchList = async (param) => {
    const bookInfo = await booksModel.find({ "accession_books_list": { "$all" : [param.accession_number] }});
    const watchLists = await watchListModel.find({ "book_id": bookInfo[0]._id });
    for(const watchList in watchLists) {
        const student = await studentModel.findById(watchLists[watchList].student_id);
        addToQueue(student.email, student.name, { url : bookInfo[0].book_detail[0].image_url, title: bookInfo[0].book_detail[0].title });
        await watchListModel.findOneAndDelete({ book_id: bookInfo[0]._id });
    }
}

function addToQueue(email, username, bookInfo) {
    console.log(email, username, bookInfo);
    amqp.connect(process.env.RABBITMQ_URI, function(error0, connection) {
        if (error0) {
            throw error0;
        }
        connection.createChannel(function(error1, channel) {
            if (error1) {
                throw error1;
            }
            var queue = username;
            var msg = {
                email,
                username,
                bookInfo
            };

            channel.assertQueue(queue, {
                durable: true
            });

            channel.sendToQueue(queue, Buffer.from(JSON.stringify(msg)));
            console.log(`[x] Sent to ${queue}`);
        });

        connection.createChannel(function(error1, channel) {
            if (error1) {
                throw error1;
            }
            var queue = 'WatchListQueue';
            var msg = {
                email,
                username,
                bookInfo
            };

            channel.assertQueue(queue, {
                durable: true
            });

            channel.sendToQueue(queue, Buffer.from(JSON.stringify(msg)));
            console.log(`[x] Sent to ${queue}`);
        });
        setTimeout(function() {
            connection.close();
        }, 500);
    });
}