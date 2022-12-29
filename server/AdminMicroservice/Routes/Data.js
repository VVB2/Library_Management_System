import express from 'express';
import { getBooks, issuedBooks, returnedBooks } from '../Controllers/dataController.js';

const dataRouter = express.Router();

//@route - /api/admin/data/get-books
dataRouter.get('/get-books', getBooks);

//@route - /api/admin/data/issued-books
dataRouter.get('/issued-books', issuedBooks);

//@route - /api/admin/data/returned-books
dataRouter.get('/returned-books', returnedBooks);

export default dataRouter;