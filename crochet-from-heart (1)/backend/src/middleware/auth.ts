import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';

export interface AuthRequest extends Request {
  user?: any;
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET!, (err: any, decoded: any) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    
    req.user = decoded;
    next();
  });
};

export const requireRole = (roles: string[]) => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    try {
      const user = await User.findById(req.user.userId);
      if (!user || !roles.includes(user.role)) {
        return res.status(403).json({ message: 'Insufficient permissions' });
      }
      next();
    } catch (error) {
      res.status(403).json({ message: 'Insufficient permissions' });
    }
  };
};

export const generateAccessToken = (user: any) => {
  return jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, { expiresIn: '15m' });
};

export const generateRefreshToken = (user: any) => {
  return jwt.sign({ userId: user._id }, process.env.JWT_REFRESH_SECRET!, { expiresIn: '7d' });
};

export const verifyJWT = authenticateToken;