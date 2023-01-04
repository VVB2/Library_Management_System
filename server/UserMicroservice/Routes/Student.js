import express from 'express';
import { createStudent, signin, getStudentInfo } from '../Controllers/studentController.js';

const studentRouter = express.Router();

//@route - /api/user/student/create-student
studentRouter.post('/create-student', createStudent);

//@route - /api/user/student/signin
studentRouter.post('/signin', signin);

//@route - /api/user/student/get-student-info
studentRouter.post('/get-student-info', getStudentInfo)

export default studentRouter;