import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const studentSchema = mongoose.Schema({
    authorized: {
        type: Boolean,
        default: false
    },
    grno: {
        type: String,
        required: [true, 'Please provide a GR Number'],
        unique: true,
        trim: true,
        lowercase: true,
    },
    email: {
        type: String,
        required: [true, 'Please provide an Email address'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [
            /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please provide a valid Email address',
        ],
    },
    created_on: {
        type: Date,
        default: new Date()
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minLength: 6,
        select: false,
    },
    name: {
        type: String,
        required: [true, 'Please provide a username'],
        trim: true,
    },
    address: {
        type: String,
        required: true
    },
    phone_number: {
        type: String,
        required: false,
        match: [
            /((\+*)((0[ -]*)*|((91 )*))((\d{12})+|(\d{10})+))|\d{5}([- ]*)\d{6}/,
            'Please provide a valid Phone Number',
        ],
    },
    dept: {
        type: String,
        required: true
    },
    year: {
        type: String,
        required: true
    },
    profile_picture: {
        type: String,
    },  
    books_taken: {
        type: Number,
        default: 0
    },
    fine_pending: {
        type: Number,
        default: 0
    }
},
    {collection: 'Users'},
);

studentSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

studentSchema.methods.matchPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

studentSchema.methods.getSignedToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    });
};

const studentModel = mongoose.model('StudentData', studentSchema);

export default studentModel;