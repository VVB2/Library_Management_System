import jwt from 'jsonwebtoken';
import logger from '../logger/logger.js';
import librarianModel from '../Models/librarianModel.js';
import ErrorResponse from '../utils/errorResponse.js';

export const createLibrarian = async (req, res) => { 
    /**
     * Creates
     * @param {email} email - Email of librarian
     * @param {password} password - Password of librarian
     * @param {name} name - Name of librarian
     * @param {address} address - Address of librarian
     * @param {phone_number} phone_number - Phone Number of librarian
     * @param {profile_picture} profile_picture - Profile picture of librarian
     * @return {json} message - Account successfully created
     */
    try {
        insertLibrarain(req.body);
        logger.info('New librarian was created');
        res.status(200).json({ message: 'Account successfully created' });
    } catch (error) {
        logger.error(error.message);
        res.status(404).json({ message: error.message });
    }
}

export const signin = async (req, res) => {
    try {
        const librarian = await librarianModel.findOne({ email: req.body.email }).select('+password');
        if (!librarian) {
            return next(new ErrorResponse('Invalid credentials', 401));
        }
        const isMatch = await librarian.matchPassword(req.body.password);
        if (!isMatch) {
            return next(new ErrorResponse('Invalid credentials', 401));
        }
        sendToken(librarian, 200, res);
    } catch (error) {
        logger.error(error.message);
        res.status(500).json({ error: error.message});
    }
}

export const updateAccount = async (req, res) => {

}

export const getLibrarianInfo = async (req, res) => {
    const { id, exp } = jwt.decode(req.body.jwtEncodedLibrarain);
    try {
        const librarian = await librarianModel.findById(id);
        res.status(201).json({ success: true, librarian, exp });
    } catch (error) {
        next(error);
    }
}

export const getAllLibrarianInfo = async (req, res) => {
    try {
        const librarians = await librarianModel.find({});
        res.status(200).json({ librarians });
    } catch (error) {
        logger.error(error.message);
        res.status(404).json({ message: error.message });
    }
}

function insertLibrarain(librarian) {
    try {
        librarianModel.create({
            email: librarian.email,
            password: librarian.password,
            name: librarian.name,
            address: librarian.address,
            phone_number: librarian.phone_number,
            dept: librarian.dept,
            year: librarian.year,
            profile_picture: librarian.profile_picture
        })
    } catch (error) {
        logger.error(error.message)
        console.log({ message: error.message });
    }
}

function sendToken(librarian, statusCode, res) {
    const token = librarian.getSignedToken();
    res.status(statusCode).json({ token });
}