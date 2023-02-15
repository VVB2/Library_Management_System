import mongoose from "mongoose";
import studentModel from "./studentModel.js";

const tokenSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: studentModel
    },
    token: {
        type: String,
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now,
        expires: 3600
    },
}, 
    {collection: 'Tokens'}
);

const tokenModel = mongoose.model("Tokens", tokenSchema);

export default tokenModel;