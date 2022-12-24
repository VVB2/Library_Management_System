import express from 'express';
import { createStudent, signin, getUserInfo } from '../Controllers/studentController.js';

const studentRouter = express.Router();

//@route - /api/user/student/create-student
studentRouter.post('/create-student', createStudent);

//@route - /api/user/student/signin
studentRouter.post('/signin', signin);

//@route - /api/user/student/get-user-info
studentRouter.post('/get-user-info', getUserInfo)

export default studentRouter;