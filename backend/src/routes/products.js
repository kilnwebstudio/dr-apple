import { Router } from 'express';
import { Product } from '../models/Product.js';
import { Activity } from '../models/Activity.js';
import { protect, staffOnly } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = Router();

function serialize(p) {
  return {
    id: p.slug,
    _id: p._id,
    slug: p.slug,
    name: p.name,
    brand: p.brand,
    category: p.category,
    price: Number(p.price),
    condition: p.condition,
    shortDescription: p.shortDescription ?? '',
    specs: p.specs ?? [],
    images: p.images ?? [],
    deletedAt: p.deletedAt,
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
  };
}

function stripAudit(doc) {
  if (!doc) return null;
  const obj = doc.toObject ? doc.toObject() : { ...doc };
  delete obj.__v;
  return obj;
}

async function logActivity({ admin, action, product, oldDoc = null }) {
  await Activity.create({
    adminId: admin ? admin._id : null,
    adminUsername: admin ? admin.username : null,
    action,
    productId: product ? product._id : null,
    productName: product ? product.name : null,
    oldValues: oldDoc ? stripAudit(oldDoc) : null,
    newValues: product ? stripAudit(product) : null,
  });
}

// Public: list active products
router.get('/', async (_req, res) => {
  const products = await Product.find({ deletedAt: null }).sort({ createdAt: -1 });
  res.json({ products: products.map(serialize) });
});

// Public: single product by slug
router.get('/:slug', async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug, deletedAt: null });
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json({ product: serialize(product) });
});

// Staff: list all (incl. soft-deleted)
router.get('/admin/all', protect, staffOnly, async (_req, res) => {
  const products = await Product.find().sort({ createdAt: -1 });
  res.json({ products: products.map(serialize) });
});

// Staff: create
router.post('/', protect, staffOnly, upload.single('image'), async (req, res) => {
  try {
    const body = JSON.parse(req.body.data || '{}');
    const slug = (body.slug || slugify(body.name || '')).toLowerCase();
    if (!slug || !body.name || !body.brand || body.price == null) {
      return res.status(400).json({ error: 'Name, brand, slug and price are required' });
    }

    const existing = await Product.findOne({ slug });
    if (existing) return res.status(409).json({ error: 'Slug already exists' });

    let specs = [];
    try {
      specs = Array.isArray(body.specs) ? body.specs : JSON.parse(body.specs || '[]');
    } catch {
      return res.status(400).json({ error: 'Specs must be valid JSON' });
    }

    const images = req.file ? [`/uploads/${req.file.filename}`] : body.images || [];

    const product = await Product.create({
      slug,
      name: body.name,
      brand: body.brand,
      category: body.category,
      price: Number(body.price),
      condition: body.condition || 'New',
      shortDescription: body.shortDescription || '',
      specs,
      images,
    });

    await logActivity({ admin: req.admin, action: 'insert', product });
    res.status(201).json({ product: serialize(product) });
  } catch (err) {
    res.status(400).json({ error: err.message || 'Failed to create product' });
  }
});

// Staff: update
router.put('/:id', protect, staffOnly, upload.single('image'), async (req, res) => {
  try {
    const oldDoc = await Product.findById(req.params.id);
    if (!oldDoc) return res.status(404).json({ error: 'Product not found' });

    const body = JSON.parse(req.body.data || '{}');

    const updates = {};
    if (body.slug) {
      const newSlug = body.slug.toLowerCase();
      if (newSlug !== oldDoc.slug) {
        const clash = await Product.findOne({ slug: newSlug });
        if (clash) return res.status(409).json({ error: 'Slug already exists' });
      }
      updates.slug = newSlug;
    }
    if (body.name !== undefined) updates.name = body.name;
    if (body.brand !== undefined) updates.brand = body.brand;
    if (body.category !== undefined) updates.category = body.category;
    if (body.price !== undefined) updates.price = Number(body.price);
    if (body.condition !== undefined) updates.condition = body.condition;
    if (body.shortDescription !== undefined) updates.shortDescription = body.shortDescription;

    if (body.specs !== undefined) {
      try {
        updates.specs = Array.isArray(body.specs) ? body.specs : JSON.parse(body.specs || '[]');
      } catch {
        return res.status(400).json({ error: 'Specs must be valid JSON' });
      }
    }

    if (req.file) {
      updates.images = [`/uploads/${req.file.filename}`];
    } else if (body.images !== undefined) {
      updates.images = body.images;
    }

    const product = await Product.findByIdAndUpdate(req.params.id, updates, { new: true });

    let action = 'update';
    if (oldDoc.deletedAt === null && product.deletedAt !== null) action = 'remove';
    else if (oldDoc.deletedAt !== null && product.deletedAt === null) action = 'restore';

    await logActivity({ admin: req.admin, action, product, oldDoc });
    res.json({ product: serialize(product) });
  } catch (err) {
    res.status(400).json({ error: err.message || 'Failed to update product' });
  }
});

// Staff: soft delete
router.delete('/:id', protect, staffOnly, async (req, res) => {
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    { deletedAt: new Date() },
    { new: true }
  );
  if (!product) return res.status(404).json({ error: 'Product not found' });
  await logActivity({ admin: req.admin, action: 'remove', product });
  res.json({ success: true });
});

// Staff: restore
router.put('/:id/restore', protect, staffOnly, async (req, res) => {
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    { deletedAt: null },
    { new: true }
  );
  if (!product) return res.status(404).json({ error: 'Product not found' });
  await logActivity({ admin: req.admin, action: 'restore', product });
  res.json({ product: serialize(product) });
});

// Owner: hard delete
router.delete('/:id/hard', protect, (req, res, next) => {
  if (req.admin.role !== 'owner') return res.status(403).json({ error: 'Owner only' });
  next();
}, async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  await logActivity({ admin: req.admin, action: 'delete', product });
  res.json({ success: true });
});

function slugify(text) {
  return String(text).toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

export default router;
