import express from 'express';
import { getBooks, getInitialData, searchBooks, addUpdateBook } from '../Controllers/booksController.js';

const booksRouter = express.Router();

//@route - /api/books/getBooks?page=*
booksRouter.get('/getBooks', getBooks);

//@route - /api/books/getAutocomplete
booksRouter.get('/getInitialData', getInitialData);

//@route - /api/books/searchBooks
booksRouter.get('/searchBooks', searchBooks);

//@route - /api/books/addUpdateBook
booksRouter.post('/addUpdateBook', addUpdateBook)

export default booksRouter;