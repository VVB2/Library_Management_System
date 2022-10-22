import mongoose from "mongoose";
import userModel from "./userModel";

const issueSchema = new mongoose.Schema({
    accession_number: {
        type: String,
        required: true
    },
    reader_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: userModel
    },
    issued_date: {
        type: Date,
        required: false,
        default: new Date.now()
    },
    return_date: {
        type: Date,
        required: false,
        default: new Date().setDate(new Date().getDate() + 7)
    },
},
    {collection: 'Issues'}
);

const issueModel = mongoose.model("Issues", issueSchema);

export default issueModel;