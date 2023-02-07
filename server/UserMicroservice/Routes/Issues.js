import express from 'express';
import isAuthenticated from '../Middleware/Auth.js';
import { issueBook } from '../Controllers/issueController.js';

const issueRouter = express.Router();

//@route - /api/user/issue/issue-book
issueRouter.post('/issue-book', isAuthenticated, issueBook);

export default issueRouter;