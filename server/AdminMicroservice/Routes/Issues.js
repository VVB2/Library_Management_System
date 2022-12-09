import express from 'express';
import { returnBook } from '../Controllers/issueController.js';

const issueRouter = express.Router();

//@route - /api/admin/issue/return-book
issueRouter.post('/return-book', returnBook);

export default issueRouter;