import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    slug: { type: String, unique: true, required: true, index: true },
    name: { type: String, required: true },
    brand: { type: String, required: true },
    category: { type: String, required: true, index: true },
    price: { type: Number, required: true, min: 0 },
    condition: { type: String, enum: ['New', 'Used'], default: 'New' },
    shortDescription: { type: String, default: '' },
    specs: [
      {
        label: String,
        value: String,
      },
    ],
    images: { type: [String], default: [] },
    deletedAt: { type: Date, default: null, index: true },
  },
  { timestamps: true }
);

export const Product = mongoose.model('Product', productSchema);
