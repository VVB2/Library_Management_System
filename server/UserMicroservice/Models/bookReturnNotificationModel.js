import mongoose from "mongoose";
import studentModel from "./studentModel.js";
import booksModel from "./booksModel.js";

const bookNotificationSchema = new mongoose.Schema({
    book_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: booksModel
    },
    send_on: {
        type: Date,
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
    {collection: 'Book_Return_Notification'}
);

const bookNotificationModel = mongoose.model("Book_Return_Notification", bookNotificationSchema);

export default bookNotificationModel;