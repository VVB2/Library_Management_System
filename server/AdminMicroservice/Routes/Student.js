import express from 'express';
import { getAllStudentRecords, createBulkStudents, removeStudent } from '../Controllers/studentController.js';

const studentRouter = express.Router();

//@route - /api/admin/student/get-students-records
studentRouter.get('/get-students-records', getAllStudentRecords);

//@route - /api/admin/student/create-bulk-students
studentRouter.post('/create-bulk-students', createBulkStudents);

//@route - /api/admin/student/remove-student
studentRouter.delete('/remove-student', removeStudent);

export default studentRouter;