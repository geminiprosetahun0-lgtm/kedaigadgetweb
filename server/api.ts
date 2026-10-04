import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { getProducts, addProduct, toggleProductStock, deleteProduct, saveProducts } from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DIST_PATH = path.join(__dirname, '..', 'dist');

export const createApiServer = () => {
  const app = express();

  app.use(cors());
  app.use(express.json());

  // Serve static assets from frontend build
  app.use(express.static(DIST_PATH));

  // GET /api/products
  app.get('/api/products', (req, res) => {
    const products = getProducts();
    res.json(products);
  });

  // POST /api/products (Add product)
  app.post('/api/products', (req, res) => {
    try {
      const data = req.body;
      if (!data.name || !data.price) {
        return res.status(400).json({ error: 'Nama dan harga wajib diisi' });
      }
      const created = addProduct({
        name: data.name,
        series: data.series || '15',
        conditionType: data.conditionType || 'second',
        storage: data.storage || '128 GB',
        color: data.color || 'Default',
        price: Number(data.price),
        originalPrice: Number(data.originalPrice) || Number(data.price) + 1500000,
        bh: data.bh || '90%',
        statusText: data.isReady !== false ? 'Ready Stock' : 'Habis / PO',
        isReady: data.isReady !== false,
        image: Array.isArray(data.images) && data.images.length > 0 ? data.images[0] : (data.image || 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80'),
        images: Array.isArray(data.images) && data.images.length > 0 ? data.images : (data.image ? [data.image] : []),
        gradeBadge: data.gradeBadge || (data.conditionType === 'bnib' ? 'BNIB Segel' : 'Grade A+ Like New'),
        desc: data.desc || `${data.name} • Siap pakai bergaransi`,
        minus: data.minus || undefined,
        warranty: data.warranty || 'Resmi iBox Indonesia',
        completeness: data.completeness || 'Fullset Box OEM Original',
        storeGaransi: data.storeGaransi || '90 Hari Toko Kedai Gadget',
        imei: data.imei || data.warranty || 'Resmi iBox Indonesia',
      });
      res.status(201).json(created);
    } catch (err) {
      res.status(500).json({ error: 'Gagal menambah produk' });
    }
  });

  // PATCH /api/products/:id/toggle-stock
  app.patch('/api/products/:id/toggle-stock', (req, res) => {
    const updated = toggleProductStock(req.params.id);
    if (!updated) {
      return res.status(404).json({ error: 'Produk tidak ditemukan' });
    }
    res.json(updated);
  });

  // PATCH /api/products/:id/price
  app.patch('/api/products/:id/price', (req, res) => {
    const { price } = req.body;
    if (!price || isNaN(Number(price))) {
      return res.status(400).json({ error: 'Harga tidak valid' });
    }
    const products = getProducts();
    const item = products.find((p) => p.id === req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Produk tidak ditemukan' });
    }
    item.price = Number(price);
    saveProducts(products);
    res.json(item);
  });

  // DELETE /api/products/:id
  app.delete('/api/products/:id', (req, res) => {
    const deleted = deleteProduct(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Produk tidak ditemukan' });
    }
    res.json({ success: true, message: 'Produk berhasil dihapus' });
  });

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      version: 'v2-resmi-ibox',
      server: 'kedai-gadget-api'
    });
  });

  return app;
};
