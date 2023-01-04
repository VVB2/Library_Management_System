import amqp from 'amqplib/callback_api.js';
import booksModel from "../Models/booksModel.js";

export const countBooks = async () => {
    return await booksModel.countDocuments();
}

export const booksAutocomplete = async (param) => {
    return await booksModel.distinct(param);
}

export const watchListQuery = async (param) => {
    amqp.connect(process.env.RABBITMQ_URI, function(error0, connection) {
        if (error0) {
            throw error0;
        }
        connection.createChannel(function(error1, channel) {
            if (error1) {
            throw error1;
            }
            var queue = 'WatchListQueue';
            var msg = {
                book_id: param.book_id,
                student_id: param.student_id, 
            };

            channel.assertQueue(queue, {
                durable: true
            });

            channel.sendToQueue(queue, Buffer.from(JSON.stringify(msg)));
            console.log(" [x] Sent %s", msg);
        });
        setTimeout(function() {
            connection.close();
        }, 500);
    });
}

export const booksSearchByParams = async (param) => {
    const queryObj = {};
    const usp = new URLSearchParams(param);
    for (const [key, value] of usp) {
        queryObj[`book_detail.${key}`] = value
    }
    return await booksModel.find(queryObj);
}

export const booksPagination = async (param, bookLimit) => {
    return await booksModel.find().limit(bookLimit).skip((param-1)*bookLimit);
}

export const isBookAvailable = async (param) => {
    return await booksModel.find({ "available_books": { "$all" : [param] }});
}

export const updateAvailableBook = async (param, process) => {
    const book = await booksModel.find({ "accession_books_list": { "$all" : [param.accession_number] }});
    await booksModel.updateOne({
        "_id": book[0]._id
    }, {
        [process]: { "available_books": param.accession_number }
    });
}