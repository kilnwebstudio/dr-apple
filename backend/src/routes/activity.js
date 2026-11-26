import { Router } from 'express';
import { Activity } from '../models/Activity.js';
import { protect, ownerOnly } from '../middleware/auth.js';

const router = Router();

router.get('/', protect, ownerOnly, async (_req, res) => {
  const logs = await Activity.find().sort({ createdAt: -1 }).limit(100).lean();
  res.json({
    logs: logs.map((l) => ({
      id: l._id,
      adminId: l.adminId,
      username: l.adminUsername,
      action: l.action,
      productId: l.productId,
      productName: l.productName,
      oldValues: l.oldValues,
      newValues: l.newValues,
      createdAt: l.createdAt,
    })),
  });
});

export default router;
