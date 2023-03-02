import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import tokenModel from '../Models/tokenModel.js';
import logger from '../logger/logger.js';
import librarianModel from '../Models/librarianModel.js';
import ErrorResponse from '../Utils/ErrorResponse.js';

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
export const createLibrarian = async (req, res, next) => { 
    try {
        await insertLibrarain(req.body, res, next);
    } catch (error) {
        logger.error(error.message);
        return res.status(500).json({ success: false, error: error.message });
    }
}

/**
 * Signs into librarian account
 * @param {string} email - Email of librarian
 * @param {string} password - Password of librarian
 * @return {json} token - JWT signed access token
 */
export const signin = async (req, res, next) => {
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

/**
 * Password reset intialization
 * @param {string} email - Email of Librarian
 * @return {json} message - Reset Password mail send successfully
 */
export const resetPassword = async (req, res, next) => {
    const librarian = await librarianModel.findOne({ email: req.body.email });
    if (!librarian) {
      return next(
        new ErrorResponse('Librarian does not exists', 400)
      )
    }
    const token = await tokenModel.findOne({ user_id: librarian._id });
    if (token) { 
          await tokenModel.deleteOne({ user_id: librarian._id });
    }
    const resetToken = crypto.randomBytes(32).toString("hex");
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(resetToken, Number(salt));
    await tokenModel.create({
      user_id: librarian._id,
      token: hash,
      created_at: Date.now(),
    });
    const link = `${hash}/passwordReset?token=${resetToken}&id=${librarian._id}`;
    await resetPasswordQueue({ link, email: librarian.email, username: librarian.name });
    logger.info(`Password update request send by [${librarian.email}]`);
    return res.status(201).json({ success: true, message: 'Reset Password mail send successfully' });
};
  
/**
 * Password update function
 * @param {string} token - Token generated from reset password 
 * @param {ObjectId} librarian_id - Object ID of the librarian
 * @param {string} password - Updated password
 * @return {json} message - Password changed successfully
 */
export const updatePassword = async (req, res, next) => {
    let passwordResetToken = await tokenModel.findOne({ user_id: req.body.librarian_id });
    if (!passwordResetToken) {
        return next(
        new ErrorResponse('Invalid or expired password reset token', 400)
        )
    }
    const isValid = await bcrypt.compare(req.body.token, passwordResetToken.token);
    if (!isValid) {
        return next(
        new ErrorResponse('Invalid or expired password reset token', 400)
        )
    }
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(req.body.password, salt);
    await librarianModel.updateOne(
        { _id: req.body.librarian_id },
        { $set: { password: hash } },
        { new: true }
    );
    const librarian = await librarianModel.findById({ _id: req.body.librarian_id });
    await updatePasswordQueue({ email: librarian.email, username: librarian.name });
    await passwordResetToken.deleteOne({ user_id: req.body.librarian_id });
    logger.info(`Successfuly password changed by [${librarian.email}]`);
    return res.status(201).json({ success:true, message: 'Password changed successfully' });;
}

/**
 * Returns the librarian info
 * @param {token} JWTToken - The unique token for each librarian
 * @return {json} librarian, exp - Librarian info along with the expiry of the token
 */
export const getLibrarianInfo = async (req, res) => {
    const { id, exp } = jwt.decode(req.body.jwtEncodedLibrarain);
    try {
        const librarian = await librarianModel.findById(id);
        return res.status(201).json({ success: true, librarian, exp });
    } catch (error) {
        logger.error(error.message);
        next(error);
    }
}

/**
 * Returns the data about all the librarians
 * @return {json} librarians - All the librarians in the database
 */
export const getAllLibrarianInfo = async (req, res) => {
    try {
        const librarians = await librarianModel.find({});
        return res.status(200).json({ librarians });
    } catch (error) {
        logger.error(error.message);
        return res.status(500).json({ success: false, error: error.message });
    }
}

/**
 * Helper function to create a new librarian
 */
async function insertLibrarain(librarian, res, next) {
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
        logger.info(`New librarian [${librarian.email}] was created`);
        sendToken(newLibrarian, 201, res);
    } catch (error) {
        logger.error(error.message);
        next(error);
    }
}

/**
 * Helper function to send out the JWT token
 */
function sendToken(librarian, statusCode, res) {
    const token = librarian.getSignedToken();
    return res.status(statusCode).json({ token });
}