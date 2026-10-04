import { STORE_INFO } from '../data/products';
import type { Product } from '../data/products';

export const formatRupiah = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);
};

export const sanitizePhoneToWA = (phone: string): string => {
  let cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('0')) {
    cleaned = '62' + cleaned.substring(1);
  } else if (!cleaned.startsWith('62')) {
    cleaned = '62' + cleaned;
  }
  return cleaned;
};

export const createBuyWhatsappUrl = (product: Product): string => {
  const number = sanitizePhoneToWA(STORE_INFO.whatsappRaw);
  const text = `Halo Admin Kedai Gadget, saya tertarik dengan unit ini:

📱 *Unit:* ${product.name}
🎨 *Warna:* ${product.color}
🔋 *Kondisi / BH:* ${product.condition} (${product.batteryHealth ? 'BH ' + product.batteryHealth + '%' : 'BNIB'})
💰 *Harga:* ${formatRupiah(product.price)}
🛡️ *Status IMEI:* ${product.imeiStatus}
📦 *Kelengkapan:* ${product.completeness}

Apakah unit ini masih ready di toko Jl. Raya Angantaka No.26? Bisa bantu infokan opsi COD atau ambil langsung sekarang? Terima kasih.`;

  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
};

export const createTradeInWhatsappUrl = (data: {
  currentModel: string;
  currentStorage: string;
  currentCondition: string;
  currentBH: string;
  targetUnit: string;
  clientName: string;
}): string => {
  const number = sanitizePhoneToWA(STORE_INFO.whatsappRaw);
  const text = `Halo Admin Kedai Gadget, saya mau simulasi *TUKAR TAMBAH (Trade-In)*:

👤 *Nama:* ${data.clientName || 'Calon Pelanggan'}
📲 *HP Lama Saya:* ${data.currentModel} (${data.currentStorage})
🔋 *Kondisi & BH:* ${data.currentCondition} | BH: ${data.currentBH || '-'}%
🎯 *Unit Incaran:* ${data.targetUnit}

Berapa estimasi taksiran harga HP lama saya dan sisa tambahan nominal yang harus dibayar? Terima kasih.`;

  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
};

export const createSellWhatsappUrl = (data: {
  model: string;
  storage: string;
  condition: string;
  completeness: string;
  clientName: string;
}): string => {
  const number = sanitizePhoneToWA(STORE_INFO.whatsappRaw);
  const text = `Halo Admin Kedai Gadget, saya mau *JUAL IPHONE*:

👤 *Nama:* ${data.clientName || 'Penjual'}
📱 *Model:* ${data.model} (${data.storage})
🔍 *Kondisi:* ${data.condition}
📦 *Kelengkapan:* ${data.completeness}

Bisa bantu cek taksiran harga terbaik untuk unit saya ini? Saya siap bawa ke toko Jl. Raya Angantaka No.26 / COD.`;

  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
};

export const createGeneralInquiryUrl = (): string => {
  const number = sanitizePhoneToWA(STORE_INFO.whatsappRaw);
  const text = `Halo Admin Kedai Gadget (Jl. Raya Angantaka No.26), saya ingin konsultasi seputar stok iPhone / tukar tambah malam/siang ini. Apakah toko melayani saat ini?`;
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
};
