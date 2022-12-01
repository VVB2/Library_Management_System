import express from 'express';
import { issueBook, returnBook } from '../Controllers/issueController.js';

const issueRouter = express.Router();

//@route - /api/issue/issueBook
issueRouter.post('/issueBook', issueBook);

//@route - /api/issue/returnBook
issueRouter.post('/returnBook', returnBook);

export default issueRouter;