import express from 'express';
import { createLibrarian } from '../Controllers/librarianController.js';

const librarianRouter = express.Router();

//@route - /api/admin/librarian/create-librarian
librarianRouter.post('/create-librarian', createLibrarian);

export default librarianRouter;