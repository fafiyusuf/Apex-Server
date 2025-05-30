// src/middleware/userValidator.ts
import { NextFunction, Request, RequestHandler, Response } from 'express';
import { body, validationResult } from 'express-validator';

// Export an array of validation middleware functions
const validateUser: RequestHandler[] = [
  body('username').notEmpty().withMessage('Username is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('role').isIn(['user', 'admin']).withMessage('Role must be user or admin').optional(),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error: any = new Error('Validation failed');
      error.statusCode = 422; // Unprocessable Entity
      error.data = errors.array();
      return next(error); // Pass validation errors to the error handler
    }
    next(); // If validation passes, proceed
  }
];

export default validateUser;