// src/routes/userRoute.ts
import express, { ErrorRequestHandler, RequestHandler } from 'express';
import { login, protectedRoute, signUp } from '../controller/userController';
import { protectAdmin } from '../middleware/adminValidator';
import { authenticate } from '../middleware/authenticate';
import errorHandler from '../middleware/errorHandler';
import validateUser from '../middleware/userValidator'; // Assuming validateUser is now a single function

const userRouter = express.Router();

userRouter.post('/login', login as RequestHandler);
userRouter.post(
  '/register',
  validateUser, // Use the validation middleware
  errorHandler as ErrorRequestHandler,
  signUp as RequestHandler
);
userRouter.get('/protected', authenticate as RequestHandler, protectedRoute as RequestHandler);
userRouter.get(
  '/admin',
  authenticate as RequestHandler,
  protectAdmin as RequestHandler,
  protectedRoute as RequestHandler
);

export default userRouter;