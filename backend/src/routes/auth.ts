import { Router } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import validate from '../middleware/validate';
import { Role } from '../middleware/auth';

const router = Router();

// Example in-memory users. In a real app, replace with DB lookup.
const users: { id: number; username: string; passwordHash: string; role: Role }[] = [
  {
    id: 1,
    username: 'admin',
    passwordHash: bcrypt.hashSync('password', 10),
    role: 'admin'
  },
  {
    id: 2,
    username: 'sre',
    passwordHash: bcrypt.hashSync('password', 10),
    role: 'sre'
  },
  {
    id: 3,
    username: 'manager',
    passwordHash: bcrypt.hashSync('password', 10),
    role: 'manager'
  },
  {
    id: 4,
    username: 'executive',
    passwordHash: bcrypt.hashSync('password', 10),
    role: 'executive'
  }
];

const loginSchema = z.object({
  username: z.string(),
  password: z.string()
});

router.post('/login', validate(loginSchema), async (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username);

  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    process.env.JWT_SECRET!,
    {
      expiresIn: '1h'
    }
  );

  res.json({ token });
});

export default router;
