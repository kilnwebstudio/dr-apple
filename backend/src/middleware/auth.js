import jwt from 'jsonwebtoken';
import { Admin } from '../models/Admin.js';

export async function protect(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(decoded.id);
    if (!admin) return res.status(401).json({ error: 'Unauthorized' });

    req.admin = admin;
    next();
  } catch {
    res.status(401).json({ error: 'Unauthorized' });
  }
}

export function ownerOnly(req, res, next) {
  if (!req.admin || req.admin.role !== 'owner') {
    return res.status(403).json({ error: 'Owner access required' });
  }
  next();
}

export function staffOnly(req, res, next) {
  if (!req.admin || !['owner', 'admin'].includes(req.admin.role)) {
    return res.status(403).json({ error: 'Staff access required' });
  }
  next();
}

export function signToken(admin) {
  return jwt.sign({ id: admin._id, username: admin.username, role: admin.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
}
