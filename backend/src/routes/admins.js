import { Router } from 'express';
import { Admin } from '../models/Admin.js';
import { protect, ownerOnly } from '../middleware/auth.js';

const router = Router();

// Owner: list admins
router.get('/', protect, ownerOnly, async (_req, res) => {
  const admins = await Admin.find().sort({ createdAt: 1 }).select('-password');
  res.json({
    admins: admins.map((a) => ({
      id: a._id,
      username: a.username,
      role: a.role,
      createdAt: a.createdAt,
    })),
  });
});

// Owner: create admin
router.post('/', protect, ownerOnly, async (req, res) => {
  try {
    const username = String(req.body.username || '').trim().toLowerCase();
    const password = String(req.body.password || '');
    const role = req.body.role === 'owner' ? 'owner' : 'admin';

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }
    if (username === 'owner') {
      return res.status(400).json({ error: "Cannot create an account named 'owner'" });
    }

    const existing = await Admin.findOne({ username });
    if (existing) return res.status(409).json({ error: 'Username already exists' });

    const admin = await Admin.create({ username, password, role });
    res.status(201).json({ id: admin._id, username: admin.username, role: admin.role });
  } catch (err) {
    res.status(400).json({ error: err.message || 'Failed to create admin' });
  }
});

// Owner: delete admin (cannot delete self or other owners)
router.delete('/:id', protect, ownerOnly, async (req, res) => {
  try {
    if (String(req.admin._id) === String(req.params.id)) {
      return res.status(400).json({ error: 'Cannot remove yourself' });
    }
    const target = await Admin.findById(req.params.id);
    if (!target) return res.status(404).json({ error: 'Admin not found' });
    if (target.role === 'owner') {
      return res.status(403).json({ error: 'Cannot remove an owner' });
    }
    await target.deleteOne();
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message || 'Failed to remove admin' });
  }
});

export default router;
