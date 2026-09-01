/**
 * AstroPravin - Legacy Image Migration & Normalization Script
 * 
 * Inspects all Product and Blog records in MongoDB:
 * 1. Downloads any external image URLs (Pinterest/Google/CDN) directly into public/uploads/
 * 2. Repoints database records to local canonical static assets (/public/uploads/upload-...)
 * 3. Replaces missing/broken historical image hashes with verified high-res Vedic artwork
 * 
 * Usage: node scripts/migrate-legacy-images.mjs
 */

import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

dotenv.config({ path: path.join(rootDir, '.env') });
dotenv.config({ path: path.join(rootDir, 'server', '.env') });

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/astropravin';
const UPLOADS_DIR = path.join(rootDir, 'public', 'uploads');

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const FALLBACK_VEDIC_IMAGE = 'https://images.unsplash.com/photo-1532012164546-f432f2e3ef54?q=80&w=800&auto=format&fit=crop';

async function downloadImageToUploads(url, prefix = 'legacy') {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buffer = Buffer.from(await res.arrayBuffer());
    
    let ext = '.jpg';
    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('png')) ext = '.png';
    else if (contentType.includes('webp')) ext = '.webp';
    else if (contentType.includes('avif')) ext = '.avif';

    const filename = `upload-${prefix}-${Date.now()}-${Math.round(Math.random() * 1e5)}${ext}`;
    const filePath = path.join(UPLOADS_DIR, filename);
    fs.writeFileSync(filePath, buffer);

    return `/public/uploads/${filename}`;
  } catch (err) {
    console.warn(`⚠️ Could not download ${url}: ${err.message}`);
    return null;
  }
}

async function run() {
  console.log('⚡ Connecting to MongoDB:', MONGO_URI.replace(/:\/\/.*@/, '://***@'));
  await mongoose.connect(MONGO_URI);
  console.log('✅ MongoDB connected successfully.\n');

  const db = mongoose.connection.db;

  // 1. Migrate Blogs
  const blogsCollection = db.collection('blogs');
  const blogs = await blogsCollection.find({}).toArray();
  console.log(`📚 Found ${blogs.length} blog posts. Checking image assets...`);

  let updatedBlogs = 0;
  for (const blog of blogs) {
    const img = blog.image;
    if (!img) continue;

    if (img.startsWith('http://') || img.startsWith('https://')) {
      const localPath = await downloadImageToUploads(img, 'blog');
      if (localPath) {
        await blogsCollection.updateOne({ _id: blog._id }, { $set: { image: localPath } });
        updatedBlogs++;
        console.log(`  ✓ Migrated external image for blog: "${blog.title || blog.slug}" -> ${localPath}`);
      }
    } else if (img.includes('5bf11064') || img.includes('ec8b696e') || !fs.existsSync(path.join(rootDir, img.replace(/^\//, '')))) {
      const fallbackLocal = await downloadImageToUploads(FALLBACK_VEDIC_IMAGE, 'blog-banner');
      if (fallbackLocal) {
        await blogsCollection.updateOne({ _id: blog._id }, { $set: { image: fallbackLocal } });
        updatedBlogs++;
        console.log(`  ✓ Repointed broken hash for blog: "${blog.title || blog.slug}" -> ${fallbackLocal}`);
      }
    }
  }

  // 2. Migrate Products
  const productsCollection = db.collection('products');
  const products = await productsCollection.find({}).toArray();
  console.log(`\n🛍️ Found ${products.length} products. Checking image assets...`);

  let updatedProducts = 0;
  for (const prod of products) {
    const img = prod.image;
    if (!img) continue;

    if (img.startsWith('http://') || img.startsWith('https://')) {
      const localPath = await downloadImageToUploads(img, 'product');
      if (localPath) {
        await productsCollection.updateOne({ _id: prod._id }, { $set: { image: localPath } });
        updatedProducts++;
        console.log(`  ✓ Migrated external image for product: "${prod.name}" -> ${localPath}`);
      }
    }
  }

  console.log('\n==================================================');
  console.log(`🎉 Migration Completed:`);
  console.log(`   • ${updatedBlogs} Blog records normalized`);
  console.log(`   • ${updatedProducts} Product records normalized`);
  console.log('==================================================\n');

  await mongoose.disconnect();
  process.exit(0);
}

run().catch((err) => {
  console.error('❌ Migration failed:', err);
  process.exit(1);
});
