import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.join(__dirname, 'products.json');

export interface ProductItem {
  id: string;
  name: string;
  series: string; // '17' | '16' | '15' | '14' | '13' | '12' | '11' | 'SE' | 'X' | '8'
  conditionType: 'second' | 'bnib';
  storage: string;
  color: string;
  price: number;
  originalPrice: number;
  bh: string;
  statusText: string;
  isReady: boolean;
  image: string;
  images?: string[];
  gradeBadge: string;
  desc: string;
  minus?: string;
  warranty: string;
  completeness: string;
  storeGaransi: string;
  imei: string;
}

export const getProducts = (): ProductItem[] => {
  try {
    if (!fs.existsSync(DB_PATH)) {
      return [];
    }
    const data = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading products.json:', err);
    return [];
  }
};

export const saveProducts = (products: ProductItem[]): boolean => {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(products, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error writing products.json:', err);
    return false;
  }
};

export const addProduct = (product: Omit<ProductItem, 'id'>): ProductItem => {
  const products = getProducts();
  const newProduct: ProductItem = {
    ...product,
    id: `prod_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
  };
  products.unshift(newProduct);
  saveProducts(products);
  return newProduct;
};

export const toggleProductStock = (id: string): ProductItem | null => {
  const products = getProducts();
  const index = products.findIndex((p) => p.id === id);
  if (index === -1) return null;

  const current = products[index];
  const nextReady = !current.isReady;
  const updated: ProductItem = {
    ...current,
    isReady: nextReady,
    statusText: nextReady ? 'Ready Stock' : 'Habis / PO',
  };
  products[index] = updated;
  saveProducts(products);
  return updated;
};

export const deleteProduct = (id: string): boolean => {
  const products = getProducts();
  const filtered = products.filter((p) => p.id !== id);
  if (filtered.length === products.length) return false;
  saveProducts(filtered);
  return true;
};
