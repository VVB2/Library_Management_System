import jwt from 'jsonwebtoken';
import studentModel from '../Models/studentModel.js';
import ErrorResponse from '../utils/errorResponse.js';

exports.protect = async (req, res, next) => {
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
        const user = await studentModel.findById(decoded.id);
        if (!user) {
            return next(new ErrorResponse('No user found with this id', 404));
        }
        req.user = user;
        next();
    } catch (error) {
        return next(new ErrorResponse('Unauthorized access', 401));
    }
};