import mongoose from "mongoose";
import studentModel from "./studentModel.js";
import booksModel from "./booksModel.js";

const bookNotificationSchema = new mongoose.Schema({
    book_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: booksModel
    },
    send_on: {
        type: date,
        default: new Date(new Date().setDate(new Date().getDate() + 6))
    },
    student_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: studentModel
    },
    is_seen: {
        type: Boolean,
        default: false
    }
},
    {collection: 'Book_Available'}
);

const bookNotificationModel = mongoose.model("Issues", bookNotificationSchema);

export default bookNotificationModel;