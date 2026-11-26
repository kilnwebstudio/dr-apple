import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const adminSchema = new mongoose.Schema(
  {
    username: { type: String, unique: true, required: true, lowercase: true, trim: true, index: true },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ['owner', 'admin'], default: 'admin' },
  },
  { timestamps: true }
);

adminSchema.methods.matchPassword = function (entered) {
  return bcrypt.compare(entered, this.password);
};

adminSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

export const Admin = mongoose.model('Admin', adminSchema);
