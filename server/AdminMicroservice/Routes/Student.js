import express from 'express';
import isAuthenticated from '../Middleware/Auth.js';
import { getAllStudentRecords, createBulkStudents, removeStudent } from '../Controllers/studentController.js';

const studentRouter = express.Router();

//@route - /api/admin/student/get-students-records
studentRouter.get('/get-students-records', isAuthenticated, getAllStudentRecords);

//@route - /api/admin/student/create-bulk-students
studentRouter.post('/create-bulk-students', isAuthenticated, createBulkStudents);

//@route - /api/admin/student/remove-student
studentRouter.delete('/remove-student', isAuthenticated, removeStudent);

export default studentRouter;