import express from 'express';
import { getBooks, getBooksTitles } from '../Controllers/booksController.js';

const booksRouter = express.Router();

//@route - /api/books/getBooks?page=*
booksRouter.get('/getBooks', getBooks);

//@route - /api/books/getBooksTitles
booksRouter.get('/getBooksTitles', getBooksTitles);

export default booksRouter;