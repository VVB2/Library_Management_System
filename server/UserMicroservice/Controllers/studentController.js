import jwt from 'jsonwebtoken';
import logger from '../logger/logger.js';
import studentModel from '../Models/studentModel.js';
import ErrorResponse from '../utils/errorResponse.js';

export const createStudent = async (req, res) => { 
    /**
     * Creates
     * @param {email} email - Email of student
     * @param {password} password - Password of student
     * @param {name} name - Name of student
     * @param {address} address - Address of student
     * @param {phone_number} phone_number - Phone Number of student
     * @param {dept} dept - Department of student
     * @param {year} year - Year of Engineering of student
     * @param {profile_picture} profile_picture - Profile picture of student
     * @return {json} message - Account successfully created
     */
    try {
        insertUsers(req.body);
        logger.info('New user was created');
        res.status(200).json({ message: 'Account successfully created' });
    } catch (error) {
        logger.error(error.message);
        res.status(404).json({ message: error.message });
    }
}

export const signin = async (req, res) => {
    try {
        const student = await studentModel.findOne({ email: req.body.email }).select('+password');
        if (!student) {
            return next(new ErrorResponse('Invalid credentials', 401));
        }
        const isMatch = await student.matchPassword(req.body.password);
        if (!isMatch) {
            return next(new ErrorResponse('Invalid credentials', 401));
        }
        sendToken(student, 200, res);
    } catch (error) {
        logger.error(error.message);
        res.status(500).json({ error: error.message});
    }
}

export const updateAccount = async (req, res) => {

}

export const getUserInfo = async (req, res) => {
    const { id, exp } = jwt.decode(req.body.jwtEncodedStudent);
    try {
        const student = await studentModel.findById(id);
        res.status(201).json({ success: true, student, exp });
    } catch (error) {
        next(error);
    }
}

function insertUsers(user) {
    try {
        studentModel.create({
            email: user.email,
            password: user.password,
            name: user.name,
            address: user.address,
            phone_number: user.phone_number,
            dept: user.dept,
            year: user.year,
            profile_picture: user.profile_picture
        })
    } catch (error) {
        logger.error(error.message)
        console.log({ message: error.message });
    }
}

function sendToken(student, statusCode, res) {
    const token = student.getSignedToken();
    res.status(statusCode).json({ token });
}