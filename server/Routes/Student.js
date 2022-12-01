import express from 'express';
import { createSingleStudent, createBulkStudents } from '../Controllers/studentController.js';

const studentRouter = express.Router();

//@route - /api/student/createStudent
studentRouter.post('/createSingleStudent', createSingleStudent);
studentRouter.post('/createBulkStudents', createBulkStudents);

export default studentRouter;