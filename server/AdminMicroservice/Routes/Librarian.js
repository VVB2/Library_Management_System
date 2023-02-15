import express from 'express';
import isAuthenticated from '../Middleware/Auth.js';
import { createLibrarian, signin, getLibrarianInfo, getAllLibrarianInfo, resetPassword, updatePassword } from '../Controllers/librarianController.js';

const librarianRouter = express.Router();

//@route - /api/admin/librarian/create-librarian
librarianRouter.post('/create-librarian', createLibrarian);

//@route - /api/admin/librarian/signin
librarianRouter.post('/signin', signin);

//@route - /api/admin/librarian/reset-password
librarianRouter.post('/reset-password', resetPassword);

//@route - /api/admin/librarian/update-password
librarianRouter.post('/update-password', updatePassword);

//@route - /api/admin/librarian/get-librarian-info
librarianRouter.post('/get-librarian-info', isAuthenticated, getLibrarianInfo);

//@route - /api/admin/librarian/get-all-librarian-info
librarianRouter.get('/get-all-librarian-info', isAuthenticated, getAllLibrarianInfo);

export default librarianRouter;