import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema(
  {
    adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', default: null },
    adminUsername: { type: String, default: null },
    action: { type: String, required: true, enum: ['insert', 'update', 'remove', 'restore', 'delete'] },
    productId: { type: mongoose.Schema.Types.ObjectId, default: null },
    productName: { type: String, default: null },
    oldValues: { type: mongoose.Schema.Types.Mixed, default: null },
    newValues: { type: mongoose.Schema.Types.Mixed, default: null },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

activitySchema.index({ createdAt: -1 });

export const Activity = mongoose.model('Activity', activitySchema);
