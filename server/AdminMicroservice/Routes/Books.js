import express from 'express';
import { addUpdateBook } from '../Controllers/booksController.js';

const booksRouter = express.Router();

//@route - /api/admin/books/add-update-book
booksRouter.post('/add-update-book', addUpdateBook)

export default booksRouter;