import express from 'express';
import isAuthenticated from '../Middleware/Auth.js';
import { createStudent, signin, getStudentInfo, resetPassword, updatePassword } from '../Controllers/studentController.js';

const studentRouter = express.Router();

//@route - /api/user/student/create-student
studentRouter.post('/create-student', createStudent);

//@route - /api/user/student/signin
studentRouter.post('/signin', signin);

//@route - /api/user/student/reset-password
studentRouter.post('/reset-password', resetPassword);

//@route - /api/user/student/updatet-password
studentRouter.post('/update-password', updatePassword);

//@route - /api/user/student/get-student-info
studentRouter.post('/get-student-info', isAuthenticated, getStudentInfo);

export default studentRouter;