import 'dotenv/config';
import mongoose from 'mongoose';
import { Admin } from './models/Admin.js';
import { Product } from './models/Product.js';

const products = [
  {
    slug: 'iphone-18', name: 'iPhone 18', brand: 'Apple', category: 'phones', price: 1850000, condition: 'New',
    shortDescription: 'The latest iPhone with the all-new A20 chip, a brighter display, and a longer-lasting battery.',
    specs: [
      { label: 'Display', value: '6.3″ OLED, 120Hz' },
      { label: 'Chip', value: 'A20 Bionic' },
      { label: 'Storage', value: '256GB' },
      { label: 'Camera', value: '48MP main + 12MP ultra-wide' },
      { label: 'Battery', value: 'Up to 33 hours video' },
    ],
    images: ['https://images.pexels.com/photos/6373126/pexels-photo-6373126.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'https://images.pexels.com/photos/6373187/pexels-photo-6373187.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'],
  },
  {
    slug: 'iphone-duo', name: 'iPhone Duo', brand: 'Apple', category: 'phones', price: 3200000, condition: 'New',
    shortDescription: "Apple's first folding phone. A full-size iPhone that folds in half.",
    specs: [
      { label: 'Display', value: '7.8″ unfolded / 6.2″ folded' },
      { label: 'Chip', value: 'A20 Pro' },
      { label: 'Storage', value: '512GB' },
      { label: 'Camera', value: '48MP triple camera' },
      { label: 'Hinge', value: 'Rated for 500,000 folds' },
    ],
    images: ['https://images.pexels.com/photos/21424627/pexels-photo-21424627.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'https://images.pexels.com/photos/7068406/pexels-photo-7068406.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'],
  },
  {
    slug: 'iphone-16-pro', name: 'iPhone 16 Pro', brand: 'Apple', category: 'phones', price: 1450000, condition: 'New',
    shortDescription: 'Titanium build, pro camera system, and the powerful A18 Pro chip.',
    specs: [
      { label: 'Display', value: '6.3″ Super Retina XDR' },
      { label: 'Chip', value: 'A18 Pro' },
      { label: 'Storage', value: '256GB' },
      { label: 'Camera', value: '48MP triple + 5x telephoto' },
    ],
    images: ['https://images.pexels.com/photos/7742500/pexels-photo-7742500.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'],
  },
  {
    slug: 'samsung-galaxy-s25-ultra', name: 'Samsung Galaxy S25 Ultra', brand: 'Samsung', category: 'phones', price: 1650000, condition: 'New',
    shortDescription: 'The ultimate Galaxy with a built-in S Pen and a pro-grade 200MP camera.',
    specs: [
      { label: 'Display', value: '6.9″ QHD+ AMOLED, 120Hz' },
      { label: 'Chip', value: 'Snapdragon 8 Elite' },
      { label: 'Storage', value: '512GB' },
      { label: 'Camera', value: '200MP main + 50x zoom' },
      { label: 'S Pen', value: 'Included' },
    ],
    images: ['https://images.pexels.com/photos/26761342/pexels-photo-26761342.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'],
  },
  {
    slug: 'google-pixel-9-pro', name: 'Google Pixel 9 Pro', brand: 'Google', category: 'phones', price: 1250000, condition: 'New',
    shortDescription: "Google's smartest phone with the best camera AI and pure Android.",
    specs: [
      { label: 'Display', value: '6.3″ LTPO OLED, 120Hz' },
      { label: 'Chip', value: 'Tensor G4' },
      { label: 'Storage', value: '256GB' },
      { label: 'Camera', value: '50MP + 48MP + 48MP' },
    ],
    images: ['https://images.pexels.com/photos/14541068/pexels-photo-14541068.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'],
  },
  {
    slug: 'vivo-v40', name: 'Vivo V40', brand: 'Vivo', category: 'phones', price: 420000, condition: 'New',
    shortDescription: 'A sleek mid-range phone with a great portrait camera and fast charging.',
    specs: [
      { label: 'Display', value: '6.78″ AMOLED, 120Hz' },
      { label: 'Chip', value: 'Snapdragon 7 Gen 3' },
      { label: 'Storage', value: '256GB' },
      { label: 'Camera', value: '50MP Zeiss dual' },
    ],
    images: ['https://images.pexels.com/photos/8148644/pexels-photo-8148644.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'],
  },
  {
    slug: 'tecno-camon-30', name: 'Tecno Camon 30', brand: 'Tecno', category: 'phones', price: 280000, condition: 'New',
    shortDescription: 'Big battery, big screen, big value — perfect for everyday use.',
    specs: [
      { label: 'Display', value: '6.78″ AMOLED, 120Hz' },
      { label: 'Chip', value: 'Helio G99' },
      { label: 'Storage', value: '256GB' },
      { label: 'Battery', value: '5000mAh, 70W charge' },
    ],
    images: ['https://images.pexels.com/photos/7742507/pexels-photo-7742507.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'],
  },
  {
    slug: 'realme-13-pro', name: 'Realme 13 Pro', brand: 'Realme', category: 'phones', price: 360000, condition: 'New',
    shortDescription: 'Stylish design with a solid camera and dependable all-day battery.',
    specs: [
      { label: 'Display', value: '6.7″ AMOLED, 120Hz' },
      { label: 'Chip', value: 'Snapdragon 7s Gen 2' },
      { label: 'Storage', value: '256GB' },
      { label: 'Camera', value: '50MP Sony sensor' },
    ],
    images: ['https://images.pexels.com/photos/6373120/pexels-photo-6373120.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'],
  },
  {
    slug: 'macbook-neo', name: 'MacBook Neo', brand: 'Apple', category: 'laptops', price: 2400000, condition: 'New',
    shortDescription: "Apple's newest thin-and-light MacBook with the M5 chip. All-day battery in a featherweight body.",
    specs: [
      { label: 'Display', value: '13.6″ Liquid Retina' },
      { label: 'Chip', value: 'Apple M5' },
      { label: 'Memory', value: '16GB' },
      { label: 'Storage', value: '512GB SSD' },
      { label: 'Battery', value: 'Up to 22 hours' },
      { label: 'Weight', value: '1.24 kg' },
    ],
    images: ['https://images.pexels.com/photos/10655906/pexels-photo-10655906.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'https://images.pexels.com/photos/8532637/pexels-photo-8532637.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'],
  },
  {
    slug: 'macbook-air-m3', name: 'MacBook Air M3', brand: 'Apple', category: 'laptops', price: 1750000, condition: 'New',
    shortDescription: 'The reliable everyday MacBook — fast, quiet, and light enough to carry anywhere.',
    specs: [
      { label: 'Display', value: '13.6″ Liquid Retina' },
      { label: 'Chip', value: 'Apple M3' },
      { label: 'Memory', value: '8GB' },
      { label: 'Storage', value: '256GB SSD' },
    ],
    images: ['https://images.pexels.com/photos/4006143/pexels-photo-4006143.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'],
  },
  {
    slug: 'macbook-pro-14', name: 'MacBook Pro 14', brand: 'Apple', category: 'laptops', price: 3100000, condition: 'Used',
    shortDescription: 'Pro-grade performance with a stunning mini-LED display. Gently used, excellent condition.',
    specs: [
      { label: 'Display', value: '14.2″ Liquid Retina XDR' },
      { label: 'Chip', value: 'Apple M4 Pro' },
      { label: 'Memory', value: '18GB' },
      { label: 'Storage', value: '512GB SSD' },
    ],
    images: ['https://images.pexels.com/photos/129208/pexels-photo-129208.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'],
  },
  {
    slug: 'anker-65w-charger', name: 'Anker 65W GaN Charger', brand: 'Anker', category: 'chargers', price: 32000, condition: 'New',
    shortDescription: 'One compact charger for your phone, tablet, and laptop. Three ports, fast charging.',
    specs: [
      { label: 'Power', value: '65W total' },
      { label: 'Ports', value: '2× USB-C, 1× USB-A' },
      { label: 'Tech', value: 'GaN II' },
    ],
    images: ['https://images.pexels.com/photos/36012993/pexels-photo-36012993.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'],
  },
  {
    slug: 'anker-powerbank-20000', name: 'Anker Power Bank 20,000mAh', brand: 'Anker', category: 'chargers', price: 45000, condition: 'New',
    shortDescription: 'Keep everything charged on the go. Enough power for several phone charges.',
    specs: [
      { label: 'Capacity', value: '20,000mAh' },
      { label: 'Output', value: '30W USB-C' },
      { label: 'Ports', value: '1× USB-C, 1× USB-A' },
    ],
    images: ['https://images.pexels.com/photos/4072683/pexels-photo-4072683.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'],
  },
  {
    slug: 'anker-usb-c-cable', name: 'Anker USB-C to USB-C Cable (6ft)', brand: 'Anker', category: 'chargers', price: 9000, condition: 'New',
    shortDescription: 'A durable, fast-charging braided cable that lasts.',
    specs: [
      { label: 'Length', value: '6 ft / 1.8 m' },
      { label: 'Power', value: 'Up to 100W' },
      { label: 'Build', value: 'Nylon braided' },
    ],
    images: ['https://images.pexels.com/photos/216369/pexels-photo-216369.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'],
  },
  {
    slug: 'jbl-tune-buds', name: 'JBL Tune Buds', brand: 'JBL', category: 'audio', price: 38000, condition: 'New',
    shortDescription: 'Punchy JBL bass in comfortable wireless earbuds with all-day battery.',
    specs: [
      { label: 'Battery', value: '10h + 30h with case' },
      { label: 'Noise cancel', value: 'Yes' },
      { label: 'Water', value: 'IPX4' },
    ],
    images: ['https://images.pexels.com/photos/17810093/pexels-photo-17810093.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'],
  },
  {
    slug: 'airpods-4', name: 'AirPods 4', brand: 'Apple', category: 'audio', price: 120000, condition: 'New',
    shortDescription: 'The familiar AirPods feel, now with active noise cancellation.',
    specs: [
      { label: 'Battery', value: '6h + 30h with case' },
      { label: 'Noise cancel', value: 'Active' },
      { label: 'Charging', value: 'USB-C' },
    ],
    images: ['https://images.pexels.com/photos/16703782/pexels-photo-16703782.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'],
  },
  {
    slug: 'jbl-wave-headphones', name: 'JBL Wave Headphones', brand: 'JBL', category: 'audio', price: 52000, condition: 'New',
    shortDescription: 'Over-ear comfort with deep bass and a long battery for all-day listening.',
    specs: [
      { label: 'Battery', value: '70 hours' },
      { label: 'Noise cancel', value: 'Yes' },
      { label: 'Connection', value: 'Bluetooth 5.3' },
    ],
    images: ['https://images.pexels.com/photos/3921817/pexels-photo-3921817.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'],
  },
  {
    slug: 'apple-watch-se', name: 'Apple Watch SE', brand: 'Apple', category: 'accessories', price: 260000, condition: 'New',
    shortDescription: 'Your fitness and notifications companion on the wrist.',
    specs: [
      { label: 'Display', value: 'Retina LTPO OLED' },
      { label: 'Case', value: '44mm aluminium' },
      { label: 'GPS', value: 'Yes' },
    ],
    images: ['https://images.pexels.com/photos/5349810/pexels-photo-5349810.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'],
  },
  {
    slug: 'iphone-clear-case', name: 'iPhone Clear Case', brand: 'Apple', category: 'accessories', price: 18000, condition: 'New',
    shortDescription: 'Show off your phone while keeping it protected. Fits iPhone 16 & 18.',
    specs: [
      { label: 'Material', value: 'Polycarbonate + TPU' },
      { label: 'Drop', value: 'Up to 2m' },
    ],
    images: ['https://images.pexels.com/photos/2933604/pexels-photo-2933604.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'],
  },
  {
    slug: 'screen-protector', name: 'Tempered Glass Screen Protector', brand: 'Anker', category: 'accessories', price: 7000, condition: 'New',
    shortDescription: 'Crystal-clear protection against scratches and drops. Easy bubble-free install.',
    specs: [
      { label: 'Hardness', value: '9H' },
      { label: 'Fit', value: 'Most 6.1″–6.3″ phones' },
    ],
    images: ['https://images.pexels.com/photos/4195333/pexels-photo-4195333.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'],
  },
];

async function run() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('MONGODB_URI is not set in .env');
    process.exit(1);
  }

  await mongoose.connect(uri);
  console.log('Connected to MongoDB');

  const ownerUsername = (process.env.OWNER_USERNAME || 'owner').toLowerCase();
  const ownerPassword = process.env.OWNER_PASSWORD || 'drapple2025';

  const existingOwner = await Admin.findOne({ username: ownerUsername });
  if (existingOwner) {
    console.log(`Owner "${ownerUsername}" already exists — skipping`);
  } else {
    await Admin.create({ username: ownerUsername, password: ownerPassword, role: 'owner' });
    console.log(`Created owner: ${ownerUsername} / ${ownerPassword}`);
  }

  let inserted = 0;
  let skipped = 0;
  for (const p of products) {
    const exists = await Product.findOne({ slug: p.slug });
    if (exists) {
      skipped++;
      continue;
    }
    await Product.create(p);
    inserted++;
  }
  console.log(`Products: ${inserted} inserted, ${skipped} skipped`);

  await mongoose.disconnect();
  console.log('Seed complete');
  process.exit(0);
}

run().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
