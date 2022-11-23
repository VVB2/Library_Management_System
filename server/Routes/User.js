import express from 'express';
import { createSingleUser, createBulkUsers } from '../Controllers/userController.js';

const userRouter = express.Router();

//@route - /api/user/createUser
userRouter.post('/createSingleUser', createSingleUser);
userRouter.post('/createBulkUsers', createBulkUsers);

export default userRouter;