import mongoose from "mongoose";
import studentModel from "./studentModel.js";

const paymentSchema = new mongoose.Schema({
    student_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: studentModel
    },
    payed_on: {
        type: Date,
        required: true
    },
    invoice_link: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    transaction_id: {
        type: String,
        required: true
    }
},
    {collection: 'Payments'}
);

const paymentModel = mongoose.model("Payments", paymentSchema);

export default paymentModel;