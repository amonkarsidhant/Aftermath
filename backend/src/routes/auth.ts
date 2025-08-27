import { Router } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import validate from '../middleware/validate';

const router = Router();

// Example in-memory user. In a real app, replace with DB lookup.
const users = [
  {
    id: 1,
    username: 'admin',
    passwordHash: bcrypt.hashSync('password', 10)
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

  const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET || 'secret', {
    expiresIn: '1h'
  });

  res.json({ token });
});

export default router;
