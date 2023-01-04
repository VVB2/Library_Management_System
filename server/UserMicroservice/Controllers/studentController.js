import jwt from "jsonwebtoken";
import logger from "../logger/logger.js";
import studentModel from "../Models/studentModel.js";
import ErrorResponse from "../utils/errorResponse.js";

export const createStudent = async (req, res, next) => {
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
  try {
    insertStudent(req.body);
    logger.info("New student was created");
    res.status(200).json({ success:true, message: "Account successfully created" });
  } catch (error) {
    logger.error(`${(new Error().stack.split("at ")[1].split(" ")[0]).trim()}, ${(new Error().stack.split("at ")[1].split("/").pop().replace(")", ""))}`);
    next();
  }
};

export const signin = async (req, res, next) => {
  /**
   * Signs into student account
   * @param {string} email - Email of student
   * @param {string} password - Password of student
   * @return {json} token - JWT signed access token
   */
  if (!req.body.email || !req.body.password) {
    return next(
        new ErrorResponse('Please provide an email and password', 400)
    );
  }
  try {
    const student = await studentModel
      .findOne({ email: req.body.email })
      .select("+password");
    if (!student) {
      return next(new ErrorResponse("Invalid credentials", 401));
    }
    const isMatch = await student.matchPassword(req.body.password);
    if (!isMatch) {
      return next(new ErrorResponse("Invalid credentials", 401));
    }
    sendToken(student, 200, res);
  } catch (error) {
    logger.error(`${(new Error().stack.split("at ")[1].split(" ")[0]).trim()}, ${(new Error().stack.split("at ")[1].split("/").pop().replace(")", ""))}`);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updateAccount = async (req, res) => {};

export const getStudentInfo = async (req, res) => {
  /**
   * Gets student information for kepping student logged in
   * @param {string} token - JWT signed access token
   * @return {json} message - Student deatils and expiration time
   */
  const { id, exp } = jwt.decode(req.body.jwtEncodedStudent);
  try {
    const student = await studentModel.findById(id);
    res.status(201).json({ success: true, student, exp });
  } catch (error) {
    next(error);
  }
};

function insertStudent(student) {
  /**
   * Helper function to create a new student
   */
  try {
    studentModel.create({
      email: student.email,
      password: student.password,
      name: student.name,
      address: student.address,
      phone_number: student.phone_number,
      dept: student.dept,
      year: student.year,
      profile_picture: student.profile_picture,
    });
  } catch (error) {
    logger.error(`${(new Error().stack.split("at ")[1].split(" ")[0]).trim()}, ${(new Error().stack.split("at ")[1].split("/").pop().replace(")", ""))}`);
    console.log({ message: error.message });
  }
}

function sendToken(student, statusCode, res) {
  /**
   * Helper function to send out the JWT token
   */
  const token = student.getSignedToken();
  res.status(statusCode).json({ success:true, token });
}
