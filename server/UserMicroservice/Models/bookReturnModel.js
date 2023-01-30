import mongoose from "mongoose";
import studentModel from "./studentModel.js";
import booksModel from "./booksModel.js";

const bookReturnSchema = new mongoose.Schema({
    accession_number: {
        type: Number,
        required: true
    },
    student_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: studentModel
    },
    return_by: {
        type: Date,
        default: new Date().setDate(new Date().getDate() + 7)
    },
},
    {collection: 'Book Return'}
);

const bookReturnModel = mongoose.model("BookReturn", bookReturnSchema);

export default bookReturnModel;