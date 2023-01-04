import express from 'express';
import { createLibrarian, signin, getLibrarianInfo, getAllLibrarianInfo } from '../Controllers/librarianController.js';

const librarianRouter = express.Router();

//@route - /api/admin/librarian/create-librarian
librarianRouter.post('/create-librarian', createLibrarian);

//@route - /api/admin/librarian/signin
librarianRouter.post('/signin', signin);

//@route - /api/admin/librarian/get-librarian-info
librarianRouter.post('/get-librarian-info', getLibrarianInfo);

//@route - /api/admin/librarian/get-all-librarian-info
librarianRouter.get('/get-all-librarian-info', getAllLibrarianInfo);

export default librarianRouter;