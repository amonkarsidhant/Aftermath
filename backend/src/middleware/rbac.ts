import { Response, NextFunction } from 'express';
import { AuthRequest, Role } from './auth';

const hierarchy: Role[] = ['executive', 'manager', 'sre', 'admin'];

export default function rbac(required: Role[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    const user = req.user;
    if (!user) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const userRank = hierarchy.indexOf(user.role as Role);
    if (userRank === -1) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const allowed = required.some(role => userRank >= hierarchy.indexOf(role));
    if (!allowed) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    next();
  };
}
