import jwt from 'jsonwebtoken';
import logger from '../logger/logger.js';
import librarianModel from '../Models/librarianModel.js';
import ErrorResponse from '../utils/errorResponse.js';

export const createLibrarian = async (req, res, next) => { 
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
        await insertLibrarain(req.body, res, next);
        logger.info('New librarian was created');
    } catch (error) {
        logger.error(error.message);
        return res.status(500).json({ success: false, error: error.message });
    }
}

export const signin = async (req, res, next) => {
    /**
     * Signs into librarian account
     * @param {string} email - Email of librarian
     * @param {string} password - Password of librarian
     * @return {json} token - JWT signed access token
     */
    if (!req.body.email || !req.body.password) {
        return next(
            new ErrorResponse('Please provide an email and password', 400)
        );
    }
    try {
        const librarian = await librarianModel.findOne({ email: req.body.email }).select('+password');
        if (!librarian) {
            logger.info(`[${req.body.email}] passed invalid credentials`);
            return next(new ErrorResponse('Invalid credentials', 401));
        }
        const isMatch = await librarian.matchPassword(req.body.password);
        if (!isMatch) {
            logger.info(`[${req.body.email}] passed invalid credentials`);
            return next(new ErrorResponse('Invalid credentials', 401));
        }
        sendToken(librarian, 200, res);
    } catch (error) {
        logger.error(error.message);
        return res.status(500).json({ success: false, error: error.message });
    }
}

export const updateAccount = async (req, res) => {

}

export const getLibrarianInfo = async (req, res) => {
    /**
     * Returns the librarian info
     * @param {token} JWTToken - The unique token for each librarian
     * @return {json} librarian, exp - Librarian info along with the expiry of the token
     */
    const { id, exp } = jwt.decode(req.body.jwtEncodedLibrarain);
    try {
        const librarian = await librarianModel.findById(id);
        return res.status(201).json({ success: true, librarian, exp });
    } catch (error) {
        logger.error(error.message);
        next(error);
    }
}

export const getAllLibrarianInfo = async (req, res) => {
    /**
     * Returns the data about all the librarians
     * @return {json} librarians - All the librarians in the database
     */
    try {
        const librarians = await librarianModel.find({});
        return res.status(200).json({ librarians });
    } catch (error) {
        logger.error(error.message);
        return res.status(500).json({ success: false, error: error.message });
    }
}

async function insertLibrarain(librarian, res, next) {
    /**
     * Helper function to create a new librarian
     */
    try {
        const newLibrarian = await librarianModel.create({
            email: librarian.email,
            password: librarian.password,
            name: librarian.name,
            address: librarian.address,
            phone_number: librarian.phone_number,
            dept: librarian.dept,
            year: librarian.year,
            profile_picture: librarian.profile_picture
        });
        sendToken(newLibrarian, 201, res);
    } catch (error) {
        logger.error(error.message);
        next(error);
    }
}

function sendToken(librarian, statusCode, res) {
    /**
     * Helper function to send out the JWT token
     */
    const token = librarian.getSignedToken();
    return res.status(statusCode).json({ token });
}