import mongoose from "mongoose";
import moment from "moment/moment.js";
import studentModel from "./studentModel.js";
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
        ref: studentModel
    },
    issued_on: {
        type: String,
        default: moment().format("DD/MM/YYYY")
    },
    return_by: {
        type: String,
        default: moment().add(7, 'days').format('DD/MM/YYYY')
    },
    returned_on: {
        type: String,
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