import express from 'express';
import { createStudent } from '../Controllers/studentController.js';

const studentRouter = express.Router();

//@route - /api/user/student/create-student
studentRouter.post('/create-student', createStudent);

export default studentRouter;