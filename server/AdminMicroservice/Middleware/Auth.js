import jwt from 'jsonwebtoken';
import librarianModel from '../Models/librarianModel.js';
import ErrorResponse from '../utils/errorResponse.js';

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
        const librarian = await librarianModel.findById(decoded.id);
        if (!librarian) {
            return next(new ErrorResponse('No librarian found with this id', 404));
        }
        req.librarian = librarian;
        next();
    } catch (error) {
        return next(new ErrorResponse('Unauthorized access', 401));
    }
};

export default isAuthenticated;