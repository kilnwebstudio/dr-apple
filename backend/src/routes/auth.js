import { Router } from 'express';
import { Admin } from '../models/Admin.js';
import { signToken } from '../middleware/auth.js';

const router = Router();

router.post('/login', async (req, res) => {
  try {
    const username = String(req.body.username || '').trim().toLowerCase();
    const password = String(req.body.password || '');
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const admin = await Admin.findOne({ username }).select('+password');
    if (!admin || !(await admin.matchPassword(password))) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const token = signToken(admin);
    res.json({
      token,
      admin: { id: admin._id, username: admin.username, role: admin.role },
    });
  } catch (err) {
    res.status(500).json({ error: 'Login failed' });
  }
});

export default router;
