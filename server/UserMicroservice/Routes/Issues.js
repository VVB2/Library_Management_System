import express from 'express';
import isAuthenticated from '../Middleware/Auth.js';
import { issueBook, getIssueAndReturnInfo } from '../Controllers/issueController.js';

const issueRouter = express.Router();

//@route - /api/user/issue/issue-book
issueRouter.post('/issue-book', isAuthenticated, issueBook);

//@route - /api/user/issue/get-info
issueRouter.post('/get-info', isAuthenticated, getIssueAndReturnInfo);

export default issueRouter;