import express from 'express';
import { issueBook } from '../Controllers/issueController.js';

const issueRouter = express.Router();

//@route - /api/user/issue/issue-book
issueRouter.post('/issue-book', issueBook);

export default issueRouter;