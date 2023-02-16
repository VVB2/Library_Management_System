import mongoose from "mongoose";
import studentModel from "./studentModel.js";
import booksModel from "./booksModel.js";

const watchListSchema = new mongoose.Schema({
    student_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: studentModel
    },
    book_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: booksModel
    }
}, 
    {collection: 'WatchLists'}
);

const watchListModel = mongoose.model("WatchLists", watchListSchema);

export default watchListModel;