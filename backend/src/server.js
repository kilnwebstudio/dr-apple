import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import adminRoutes from './routes/admins.js';
import activityRoutes from './routes/activity.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

app.use(
  cors({
    origin: (process.env.CLIENT_ORIGIN || 'http://localhost:5173').split(','),
    credentials: true,
  })
);
app.use(express.json({ limit: '12mb' }));

// Static uploads
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/admins', adminRoutes);
app.use('/api/activity', activityRoutes);

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

// 404
app.use('/api', (_req, res) => res.status(404).json({ error: 'Not found' }));

const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGODB_URI;

if (!MONGO_URI) {
  console.error('MONGODB_URI is not set in .env');
  process.exit(1);
}

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Dr Apple API running on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });
