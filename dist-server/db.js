import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Ensure path resolves to server/products.json or local products.json
const getDbPath = () => {
    const p1 = path.join(__dirname, 'products.json');
    const p2 = path.join(__dirname, '..', 'server', 'products.json');
    const p3 = path.join(__dirname, 'server', 'products.json');
    if (fs.existsSync(p1))
        return p1;
    if (fs.existsSync(p2))
        return p2;
    if (fs.existsSync(p3))
        return p3;
    return p1;
};
const DB_PATH = getDbPath();
export const getProducts = () => {
    try {
        if (!fs.existsSync(DB_PATH)) {
            return [];
        }
        const data = fs.readFileSync(DB_PATH, 'utf-8');
        return JSON.parse(data);
    }
    catch (err) {
        console.error('Error reading products.json:', err);
        return [];
    }
};
export const saveProducts = (products) => {
    try {
        fs.writeFileSync(DB_PATH, JSON.stringify(products, null, 2), 'utf-8');
        return true;
    }
    catch (err) {
        console.error('Error writing products.json:', err);
        return false;
    }
};
export const addProduct = (product) => {
    const products = getProducts();
    const newProduct = {
        ...product,
        id: `prod_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    };
    products.unshift(newProduct);
    saveProducts(products);
    return newProduct;
};
export const toggleProductStock = (id) => {
    const products = getProducts();
    const index = products.findIndex((p) => p.id === id);
    if (index === -1)
        return null;
    const current = products[index];
    const nextReady = !current.isReady;
    const updated = {
        ...current,
        isReady: nextReady,
        statusText: nextReady ? 'Ready Stock' : 'Habis / PO',
    };
    products[index] = updated;
    saveProducts(products);
    return updated;
};
export const deleteProduct = (id) => {
    const products = getProducts();
    const filtered = products.filter((p) => p.id !== id);
    if (filtered.length === products.length)
        return false;
    saveProducts(filtered);
    return true;
};
