import express from 'express';
import { getBooks, getInitialData, searchBooks } from '../Controllers/booksController.js';

const booksRouter = express.Router();

//@route - /api/user/books/get-books?page=*
booksRouter.get('/get-books', getBooks);

//@route - /api/user/books/get-initial-data
booksRouter.get('/get-initial-data', getInitialData);

//@route - /api/user/books/search-books
booksRouter.get('/search-books', searchBooks);

export default booksRouter;