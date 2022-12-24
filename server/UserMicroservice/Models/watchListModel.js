import mongoose from "mongoose";
import studentModel from "./studentModel.js";
import booksModel from "./booksModel.js";

const watchListSchema = new mongoose.Schema({
    book_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: booksModel
    },
    student_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: studentModel
    },
},
    {collection: 'WatchLists'}
);

const watchListModel = mongoose.model("WatchLists", watchListSchema);

export default watchListModel;