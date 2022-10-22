import express from 'express';
import { getBooks } from '../Controllers/booksController.js';

const router = express.Router();

//@route - /api/books
router.get('/', getBooks);

export default router;