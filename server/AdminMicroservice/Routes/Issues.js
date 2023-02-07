import express from 'express';
import isAuthenticated from '../Middleware/Auth.js';
import { returnBook } from '../Controllers/issueController.js';

const issueRouter = express.Router();

//@route - /api/admin/issue/return-book
issueRouter.post('/return-book', isAuthenticated, returnBook);

export default issueRouter;