// src/controller/userController.ts

interface LoginResponseBody {
  message?: string;
  token?: string;
  username?: string;
  email?: string;
  role?: string;
  _id?: string;
}
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/userModel';

dotenv.config();

interface LoginRequestBody {
  email: string;
  password: string;
}

interface SignUpRequestBody {
  username: string;
  password: string;
  email: string;
  role: string;
}

// Changed return type to Promise<void> or void
const signUp = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  console.log('USER_DEBUG: Received signup request for email:', email);

  if (!username || !email || !password) {
      console.log('USER_DEBUG: Missing fields in signup request.');
      return res.status(400).json({ message: 'Please enter all fields' });
  }

  try {
      // Check if user already exists by email (before hashing password if possible)
      // Note: The unique index on email in your model will also catch duplicates
      const existingUser = await User.findOne({ email });
      if (existingUser) {
          console.log('USER_DEBUG: User with this email already exists:', email);
          return res.status(400).json({ message: 'User already exists' });
      }

      console.log('USER_DEBUG: Hashing password...');
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      console.log('USER_DEBUG: Password hashed successfully.');

      const newUser = new User({
          username,
          email,
          password: hashedPassword,
          role: 'user' // Default role, adjust if needed
      });

      console.log('USER_DEBUG: Attempting to save new user:', newUser.email);
      const savedUser = await newUser.save(); // <--- THIS IS THE CRITICAL SAVE OPERATION
      console.log('USER_DEBUG: User saved successfully. Saved User ID:', savedUser._id);

      // Generate JWT token
      const token = jwt.sign(
          { user_id: savedUser._id, role: savedUser.role },
          process.env.JWT_SECRET as string, // Ensure JWT_SECRET is loaded
          { expiresIn: '1h' }
      );
      console.log('USER_DEBUG: JWT token generated for user:', savedUser.email);

      res.status(201).json({
          message: 'User registered successfully',
          email: savedUser.email,
          username: savedUser.username,
          role: savedUser.role,
          _id: savedUser._id,
          token
      });

  } catch (error: any) {
      console.error('USER_DEBUG: ERROR during sign up process:', error);
      if (error.code === 11000) { // Duplicate key error
          return res.status(400).json({ message: 'Email already registered.' });
      }
      res.status(500).json({ message: 'Server error', error: error.message });
  }
};
// Changed return type to Promise<void> or void
const login = async (
  req: Request<{}, {}, LoginRequestBody>,
  res: Response<LoginResponseBody>,
  next: NextFunction
): Promise<void> => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return; // Ensure function exits after sending response
    }

    const isCorrect = await bcrypt.compare(password, user.password);

    if (!isCorrect) {
      res.status(400).json({ message: 'Incorrect password' });
      return; // Ensure function exits after sending response
    }

    const token = jwt.sign(
      { user_id: user._id, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: '1h' }
    );

    const { password: _, ...data } = user.toObject();

    res.json({ ...data, _id: user._id.toString(), token }); // Convert _id to string
  } catch (error: any) {
    next(error);
  }
};

interface ProtectedRouteResponseBody {
  message: string;
  user?: {
    id: string;
    username: string;
    email: string;
    role: string;
  };
}

// Changed return type to Promise<void> or void
const protectedRoute = async (
  req: Request,
  res: Response<ProtectedRouteResponseBody>
): Promise<void> => {
  const user = req.user;

  res.json({
    message: 'You are authorized to access this protected route!',
    user,
  }); // No explicit 'return' of Response
};

export { login, protectedRoute, signUp };
