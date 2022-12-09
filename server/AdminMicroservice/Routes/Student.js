import express from 'express';
import { createBulkStudents } from '../Controllers/studentController.js';

const studentRouter = express.Router();

//@route - /api/admin/student/create-bulk-students
studentRouter.post('/create-bulk-students', createBulkStudents);

export default studentRouter;