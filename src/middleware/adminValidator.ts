import { NextFunction, Request, Response } from 'express';

interface User {
    role: string;
}

// interface AdminRequest extends Request {
//     user?: User;
// }

export const protectAdmin = (req: Request, res: Response, next: NextFunction): void => {
    const user = req.user;
    if (user && user.role === 'admin') {
        next();
    } else {
        res.status(401);
        throw new Error('Not authorized as an admin');
    }
}
export default protectAdmin;
    