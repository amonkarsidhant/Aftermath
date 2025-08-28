import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import auth from './auth';

export interface SharePayload {
  type: 'incident' | 'postmortem';
  id: string;
}

export interface ShareAuthRequest extends Request {
  share?: SharePayload;
}

export function verifyShareToken(token: string): SharePayload {
  return jwt.verify(token, process.env.JWT_SECRET!) as SharePayload;
}

export default function shareAuth(
  req: ShareAuthRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers['authorization'];
  if (authHeader) {
    const [, token] = authHeader.split(' ');
    try {
      const payload = verifyShareToken(token);
      req.share = payload;
      return next();
    } catch (err) {
      // not a valid share token, fall through
    }
  }
  return auth(req as any, res, next);
}
