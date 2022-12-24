import express from 'express';
import { getAllStudentRecords, createBulkStudents } from '../Controllers/studentController.js';

const studentRouter = express.Router();

//@route - /api/admin/student/get-students-records
studentRouter.get('/get-students-records', getAllStudentRecords);

//@route - /api/admin/student/create-bulk-students
studentRouter.post('/create-bulk-students', createBulkStudents);

export default studentRouter;