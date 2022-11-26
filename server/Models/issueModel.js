import mongoose from "mongoose";
import userModel from "./userModel.js";
import librarianModel from "./librarianModel.js";
import booksModel from "./booksModel.js";

const issueSchema = new mongoose.Schema({
    book_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: booksModel
    },
    accession_number: {
        type: Number,
        required: true
    },
    student_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: userModel
    },
    issued_on: {
        type: Date,
        default: Date.now
    },
    return_by: {
        type: Date,
        default: new Date().setDate(new Date().getDate() + 7)
    },
    returned_on: {
        type: Date,
        default: null
    },
    returned_to: {
        type: mongoose.Schema.Types.ObjectId,
        ref: librarianModel,
        default: null
    }
},
    {collection: 'Issues'}
);

const issueModel = mongoose.model("Issues", issueSchema);

export default issueModel;