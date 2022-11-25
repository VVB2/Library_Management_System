import express from 'express';
import { issueBook } from '../Controllers/issueController.js';

const issueRouter = express.Router();

//@route - /api/issue/issueBook
issueRouter.post('/issueBook', issueBook);

export default issueRouter;