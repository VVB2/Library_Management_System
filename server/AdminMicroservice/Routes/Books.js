import express from 'express';
import { singleInsert } from '../Controllers/booksController.js';

const booksRouter = express.Router();

//@route - /api/admin/books/single-insert
booksRouter.post('/single-insert', singleInsert)

export default booksRouter;