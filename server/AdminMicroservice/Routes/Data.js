import express from 'express';
import isAuthenticated from '../Middleware/Auth.js';
import { issuedBooks, returnedBooks } from '../Controllers/dataController.js';

const dataRouter = express.Router();

//@route - /api/admin/data/issued-books
dataRouter.get('/issued-books', issuedBooks);

//@route - /api/admin/data/returned-books
dataRouter.get('/returned-books', isAuthenticated, returnedBooks);

export default dataRouter;