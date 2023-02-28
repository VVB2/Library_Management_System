import jwt from "jsonwebtoken";
import logger from "../logger/logger.js";
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import studentModel from "../Models/studentModel.js";
import tokenModel from "../Models/tokenModel.js";
import { resetPasswordQueue, updatePasswordQueue } from "../queries/StudentQueries.js";
import ErrorResponse from "../utils/errorResponse.js";

/**
 * Creates student account
 * @param {string} email - Email of student
 * @param {string} password - Password of student
 * @param {string} name - Name of student
 * @param {string} address - Address of student
 * @param {string} phone_number - Phone Number of student
 * @param {string} dept - Department of student
 * @param {string} year - Year of Engineering of student
 * @param {string} profile_picture - Profile picture of student
 * @return {json} message - Account successfully created
 */
export const createStudent = async (req, res, next) => {
  try {
    await insertStudent(req.body, res, next);
    logger.info(`[${req.body.name}] requested an account creation`);
  } catch (error) {
    logger.error(error.message);
    next(error);
  }
};

/**
 * Signs into student account
 * @param {string} email - Email of student
 * @param {string} password - Password of student
 * @return {json} token - JWT signed access token
 */
export const signin = async (req, res, next) => {
  if (!req.body.email || !req.body.password) {
    return next(
        new ErrorResponse('Please provide an email and password', 400)
    );
  }
  try {
      const student = await studentModel.findOne({ email: req.body.email }).select("+password");
      if (!student) {
        logger.info(`[${req.body.email}] passed invalid credentials`);
        return next(new ErrorResponse("Invalid credentials", 401));
      }
      const isMatch = await student.matchPassword(req.body.password);
      if (!isMatch) {
        logger.info(`[${req.body.email}] passed invalid credentials`);
        return next(new ErrorResponse("Invalid credentials", 401));
      }
      sendToken(student, 200, res);
    } catch (error) {
      logger.error(error.message);
      res.status(500).json({ success: false, error: error.message });
    }
};

/**
 * Password reset intialization
 * @param {string} email - Email of student
 * @return {json} message - Reset Password mail send successfully
 */
export const resetPassword = async (req, res, next) => {
  const student = await studentModel.findOne({ email: req.body.email });
  if (!student) {
    return next(
      new ErrorResponse('Student does not exists', 400)
    )
  }
  const token = await tokenModel.findOne({ user_id: student._id });
  if (token) { 
        await tokenModel.deleteOne({ user_id: student._id });
  }
  const resetToken = crypto.randomBytes(32).toString("hex");
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(resetToken, Number(salt));
  await tokenModel.create({
    user_id: student._id,
    token: hash,
    created_at: Date.now(),
  });
  const link = `${hash}/passwordReset?token=${resetToken}&id=${student._id}`;
  await resetPasswordQueue({ link, email: student.email,username: student.name });
  return res.status(201).json({ success: true, message: 'Reset Password mail send successfully' });
};

/**
 * Password update function
 * @param {string} token - Token generated from reset password 
 * @param {ObjectId} student_id - Object ID of the student
 * @param {string} password - Updated password
 * @return {json} message - Password changed successfully
 */
export const updatePassword = async (req, res, next) => {
  let passwordResetToken = await tokenModel.findOne({ user_id: req.body.student_id });
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
  await studentModel.updateOne(
    { _id: req.body.student_id },
    { $set: { password: hash } },
    { new: true }
  );
  const student = await studentModel.findById({ _id: req.body.student_id });
  await updatePasswordQueue({ email: student.email, username: student.name });
  await passwordResetToken.deleteOne({ user_id: req.body.student_id });
  return res.status(201).json({ success:true, message: 'Password changed successfully' });;
}

/**
 * Gets student information for kepping student logged in
 * @param {string} authorization - contains authorization token 
 * @return {json} message - Student deatils and expiration time
 */
export const getStudentInfo = async (req, res) => {
  const { id, exp } = jwt.decode(req.headers.authorization.split(' ')[1]);
  try {
    const student = await studentModel.findById(id);
    return res.status(201).json({ success: true, student, exp });
  } catch (error) {
    next(error);
  }
};

/**
 * Helper function to create a new student
 */
async function insertStudent(student, res, next) {
  try {
    const newStudent = await studentModel.create({
      grno: student.grno,
      email: student.email,
      password: student.password,
      name: student.name,
      address: student.address,
      phone_number: student.phone_number,
      dept: student.dept,
      year: student.year,
      profile_picture: student.profile_picture,
    });
    sendToken(newStudent, 201, res);
  } catch (error) {
    logger.error(error.message);
    next(error);
  }
}

/**
 * Helper function to send out the JWT token
 */
function sendToken(student, statusCode, res) {
  const token = student.getSignedToken();
  return res.status(statusCode).json({ success:true, token });
}
