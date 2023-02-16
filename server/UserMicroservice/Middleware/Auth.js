import jwt from 'jsonwebtoken';
import studentModel from '../Models/studentModel.js';
import ErrorResponse from '../utils/errorResponse.js';

/**
 * Used to check if the user is authorized or not
 */
const isAuthenticated = async (req, res, next) => {
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
        return next(new ErrorResponse('Unauthorized access', 401));
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const student = await studentModel.findById(decoded.id);
        if (!student) {
            return next(new ErrorResponse('No student found with this id', 404));
        }
        req.student = student;
        next();
    } catch (error) {
        return next(new ErrorResponse('Unauthorized access', 401));
    }
};

export default isAuthenticated;