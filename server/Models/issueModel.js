import mongoose from "mongoose";
import userModel from "./userModel";
import librarianModel from "./librarianModel";

const issueSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    isbn: {
        type: String,
        required: true
    },
    accession_number: {
        type: String,
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
        default: Date.setDate(new Date().getDate() + 7)
    },
    returned_on: {
        type: Date,
        default: null
    },
    returned_to: {
        type: mongoose.Schema.Types.ObjectId,
        ref: librarianModel
    }
},
    {collection: 'Issues'}
);

const issueModel = mongoose.model("Issues", issueSchema);

export default issueModel;