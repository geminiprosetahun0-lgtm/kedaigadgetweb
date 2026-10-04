import React, { useState, useMemo, useEffect } from 'react';
import { sanitizeInput, sanitizePhone, hashPin, constantTimeCompare, ClientRateLimiter } from './utils/security';

const rateLimiter = new ClientRateLimiter(5, 60000);
const DEFAULT_PIN_HASH = '275a59d9c2cf1a57c55c70c0c6e1fc3a5c6d36e2f1837e2898c8c4e4f7a1f592'; // hash of default pin "123456"

interface ProductItem {
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

const PRODUCTS: ProductItem[] = [
  {
    id: '1',
    name: 'iPhone 15 Pro Max',
    series: '15',
    conditionType: 'second',
    storage: '256 GB',
    color: 'Natural Titanium',
    price: 18450000,
    originalPrice: 21999000,
    bh: '99%',
    statusText: 'Ready Stock',
    isReady: true,
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80',
    gradeBadge: 'Grade A+ Like New',
    desc: 'Natural Titanium • Garansi Resmi iBox s/d 2025',
    warranty: 'Resmi iBox Indonesia (PA/A)',
    completeness: 'Fullset Box OEM Original',
    storeGaransi: '90 Hari Toko + Resmi iBox Aktif',
    imei: 'Resmi iBox Indonesia',
  },
  {
    id: '2',
    name: 'iPhone 15 Pro',
    series: '15',
    conditionType: 'bnib',
    storage: '128 GB',
    color: 'Blue Titanium',
    price: 17899000,
    originalPrice: 19999000,
    bh: '100% (New)',
    statusText: 'Ready Stock',
    isReady: true,
    image: 'https://images.unsplash.com/photo-1696446701796-da61225697cc?auto=format&fit=crop&w=800&q=80',
    gradeBadge: 'BNIB Segel Greenpeel',
    desc: 'Blue Titanium • Garansi 1 Tahun Apple iBox',
    warranty: 'Resmi iBox Indonesia',
    completeness: 'Fullset Original Sealed',
    storeGaransi: '1 Tahun Apple Official + 90 Hari Toko',
    imei: 'Resmi iBox Indonesia',
  },
  {
    id: '3',
    name: 'iPhone 14 Pro',
    series: '14',
    conditionType: 'second',
    storage: '128 GB',
    color: 'Deep Purple',
    price: 13900000,
    originalPrice: 16500000,
    bh: '92%',
    statusText: 'Ready Stock',
    isReady: true,
    image: 'https://images.unsplash.com/photo-1663499482523-1c0c1bae4ce1?auto=format&fit=crop&w=800&q=80',
    gradeBadge: 'Second Mulus 98%',
    desc: 'Deep Purple • Dynamic Island Mulus Normal',
    warranty: 'Kemenperin Bea Cukai All Provider',
    completeness: 'Fullset Box Dus Buku',
    storeGaransi: '90 Hari Toko Kedai Gadget',
    imei: 'Kemenperin Bea Cukai All Provider',
  },
  {
    id: '4',
    name: 'iPhone 13',
    series: '13',
    conditionType: 'second',
    storage: '128 GB',
    color: 'Midnight',
    price: 8850000,
    originalPrice: 10200000,
    bh: '88%',
    statusText: 'Ready Stock',
    isReady: true,
    image: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=800&q=80',
    gradeBadge: 'Second Like New',
    desc: 'Midnight • Layar Super Retina XDR Bening',
    warranty: 'Resmi Digimap Indonesia',
    completeness: 'Fullset Lengkap + Kabel OEM',
    storeGaransi: '90 Hari Garansi Hardware',
    imei: 'Resmi Digimap Indonesia',
  },
  {
    id: '5',
    name: 'iPhone 15 Plus',
    series: '15',
    conditionType: 'second',
    storage: '128 GB',
    color: 'Black',
    price: 13750000,
    originalPrice: 15499000,
    bh: '96%',
    statusText: 'PO 1 Hari',
    isReady: false,
    image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=800&q=80',
    gradeBadge: 'Second A+',
    desc: 'Black • Layar Besar 6.7 Inch & Daya Tahan Ekstra',
    warranty: 'Resmi iBox Indonesia',
    completeness: 'Fullset Original Box',
    storeGaransi: '90 Hari Toko Kedai Gadget',
    imei: 'Resmi iBox Indonesia',
  },
  {
    id: '6',
    name: 'iPhone 14',
    series: '14',
    conditionType: 'second',
    storage: '128 GB',
    color: 'Starlight',
    price: 10400000,
    originalPrice: 12000000,
    bh: '90%',
    statusText: 'Ready Stock',
    isReady: true,
    image: 'https://images.unsplash.com/photo-1574755393849-623942496936?auto=format&fit=crop&w=800&q=80',
    gradeBadge: 'Second Mulus',
    desc: 'Starlight • Fisik mulus bebas dent',
    warranty: 'Resmi iBox Indonesia',
    completeness: 'Fullset Lengkap',
    storeGaransi: '90 Hari Toko Kedai Gadget',
    imei: 'Resmi iBox Indonesia',
  },
  {
    id: '7',
    name: 'iPhone 13 Pro Max',
    series: '13',
    conditionType: 'second',
    storage: '256 GB',
    color: 'Sierra Blue',
    price: 12800000,
    originalPrice: 14500000,
    bh: '91%',
    statusText: 'Ready Stock',
    isReady: true,
    image: 'https://images.unsplash.com/photo-1632661674596-df8be070a5c5?auto=format&fit=crop&w=800&q=80',
    gradeBadge: 'Second A+ Like New',
    desc: 'Sierra Blue • 120Hz ProMotion Layar Sehat',
    warranty: 'Resmi iBox Indonesia',
    completeness: 'Fullset Box Dus Buku Kabel',
    storeGaransi: '90 Hari Toko Kedai Gadget',
    imei: 'Resmi iBox Indonesia',
  },
  {
    id: '8',
    name: 'iPhone 12 Pro',
    series: '12',
    conditionType: 'second',
    storage: '128 GB',
    color: 'Graphite',
    price: 7950000,
    originalPrice: 9500000,
    bh: '86%',
    statusText: 'Ready Stock',
    isReady: true,
    image: 'https://images.unsplash.com/photo-1605236453806-6ff36851218e?auto=format&fit=crop&w=800&q=80',
    gradeBadge: 'Second Like New',
    desc: 'Graphite • All Sensor & LiDAR Normal',
    warranty: 'Resmi iBox Indonesia',
    completeness: 'Fullset Lengkap Box',
    storeGaransi: '90 Hari Toko Kedai Gadget',
    imei: 'Resmi iBox Indonesia',
  },
];

const formatRupiah = (val: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(val);
};

export const App: React.FC = () => {
  const [products, setProducts] = useState<ProductItem[]>(() => {
    try {
      const saved = localStorage.getItem('kg_vault_stock');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback if corrupted
    }
    return PRODUCTS;
  });

  // Fetch real-time products from API server if running
  useEffect(() => {
    const fetchApiProducts = async () => {
      try {
        const res = await fetch('/api/products');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setProducts(data);
          }
        }
      } catch {
        // Fallback to local state / localStorage silently
      }
    };
    fetchApiProducts();
  }, []);

  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [adminPin, setAdminPin] = useState('');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [authError, setAuthError] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempPrice, setTempPrice] = useState<number>(0);

  useEffect(() => {
    try {
      localStorage.setItem('kg_vault_stock', JSON.stringify(products));
    } catch {
      // storage quota exception guard
    }
  }, [products]);

  const [activeCondition, setActiveCondition] = useState<'all' | 'second' | 'bnib'>('all');
  const [activeSeries, setActiveSeries] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);
  const [activeModalImageIndex, setActiveModalImageIndex] = useState<number>(0);
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);

  // Form State with strict sanitization
  const [tradeForm, setTradeForm] = useState({
    curr: 'iPhone 11',
    storage: '128 GB',
    bh: '87%',
    condition: 'Mulus 99% • Fullset Box',
    target: 'iPhone 15 Pro Max 256GB',
  });

  const [sellForm, setSellForm] = useState({
    model: '',
    origin: 'Resmi iBox / Digimap (PA/A, ID/A)',
    desc: '',
    method: 'Transfer Bank Instan (BCA / Mandiri / BRI)',
    phone: '',
  });

  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      const matchCond = activeCondition === 'all' || item.conditionType === activeCondition;
      const matchSeries = activeSeries === 'all' || item.series === activeSeries;
      const q = sanitizeInput(searchQuery.toLowerCase().trim(), 50);
      const matchSearch =
        q === '' ||
        item.name.toLowerCase().includes(q) ||
        item.storage.toLowerCase().includes(q) ||
        item.color.toLowerCase().includes(q);
      return matchCond && matchSeries && matchSearch;
    });
  }, [products, activeCondition, activeSeries, searchQuery]);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rateLimiter.canAttempt()) {
      setAuthError(`Terlalu banyak percobaan! Tunggu ${rateLimiter.remainingTime()} detik.`);
      return;
    }
    const cleanPin = sanitizeInput(adminPin, 10);
    const computed = await hashPin(cleanPin);
    const storedHash = localStorage.getItem('kg_vault_pin_hash') || DEFAULT_PIN_HASH;
    if (constantTimeCompare(computed, storedHash)) {
      setIsAdminAuthenticated(true);
      setAuthError('');
      setAdminPin('');
    } else {
      setAuthError('PIN salah! Akses ditolak.');
    }
  };

  const handleToggleStock = async (id: string) => {
    // Try API toggle first
    try {
      await fetch(`/api/products/${id}/toggle-stock`, { method: 'PATCH' });
    } catch {
      // silent fallback
    }

    setProducts((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nextState = !item.isReady;
          return {
            ...item,
            isReady: nextState,
            statusText: nextState ? 'Ready Stock' : 'Habis / PO',
          };
        }
        return item;
      })
    );
  };

  const handleSavePrice = async (id: string) => {
    if (tempPrice <= 0 || isNaN(tempPrice)) return;
    try {
      await fetch(`/api/products/${id}/price`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ price: Math.floor(tempPrice) }),
      });
    } catch {
      // silent fallback
    }

    setProducts((prev) =>
      prev.map((item) => (item.id === id ? { ...item, price: Math.floor(tempPrice) } : item))
    );
    setEditingId(null);
  };

  const createProductWaUrl = (p: ProductItem) => {
    const text = 
      `Halo Admin Kedai Gadget, apakah unit ini masih ada?\n\n` +
      `📱 *Model:* ${p.name}\n` +
      `💾 *Kapasitas:* ${p.storage}\n` +
      `🎨 *Warna:* ${p.color}\n` +
      `🔋 *Battery Health:* ${p.bh}\n` +
      `✨ *Kondisi:* ${p.gradeBadge}\n` +
      `🛡️ *Status IMEI:* ${p.warranty}\n` +
      `📦 *Kelengkapan:* ${p.completeness}\n` +
      `💰 *Harga:* ${formatRupiah(p.price)}\n` +
      (p.minus ? `📋 *Detail:* ${p.minus}\n` : '') +
      `🏷️ *Status Stok:* ${p.isReady ? 'Ready Stock' : 'Pre-Order / Booking'}\n\n` +
      `Apakah barang ini masih ready untuk transaksi COD area Penatih / Denpasar Timur atau se-Bali? Terima kasih.`;
    return `https://wa.me/628976747272?text=${encodeURIComponent(text)}`;
  };

  const createDetailModalWaUrl = (p: ProductItem) => {
    const text = 
      `Halo Admin Kedai Gadget, apakah barang ini masih ada?\n\n` +
      `📱 *Unit:* ${p.name} (${p.storage})\n` +
      `🎨 *Warna:* ${p.color}\n` +
      `💰 *Harga:* ${formatRupiah(p.price)}\n` +
      `🔋 *Battery Health:* ${p.bh}\n` +
      `🛡️ *Legalitas:* ${p.warranty}\n` +
      `📦 *Kelengkapan:* ${p.completeness}\n` +
      (p.minus ? `📋 *Detail:* ${p.minus}\n` : '') + `\n` +
      `Apakah unitnya masih tersedia untuk COD di Penatih, Denpasar Timur atau se-Bali? Terima kasih.`;
    return `https://wa.me/628976747272?text=${encodeURIComponent(text)}`;
  };

  const handleTradeIn = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCurr = sanitizeInput(tradeForm.curr, 40);
    const cleanStorage = sanitizeInput(tradeForm.storage, 20);
    const cleanBh = sanitizeInput(tradeForm.bh, 10);
    const cleanCond = sanitizeInput(tradeForm.condition, 60);
    const cleanTarget = sanitizeInput(tradeForm.target, 50);

    const text = encodeURIComponent(
      `Halo Kedai Gadget, saya ingin ajukan Tukar Tambah:\n` +
      `- Unit Sekarang: ${cleanCurr} (${cleanStorage})\n` +
      `- Battery Health: ${cleanBh}\n` +
      `- Kondisi: ${cleanCond}\n` +
      `- Target Upgrade: ${cleanTarget}\n\n` +
      `Mohon rincian estimasi penambahan dan ketersediaan stok di toko.`
    );
    window.open(`https://wa.me/628976747272?text=${text}`, '_blank');
  };

  const handleSell = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanModel = sanitizeInput(sellForm.model, 60);
    const cleanPhone = sanitizePhone(sellForm.phone);
    const cleanDesc = sanitizeInput(sellForm.desc, 180);

    if (!cleanModel || cleanModel.length < 3) {
      alert('Mohon isi model iPhone yang valid');
      return;
    }
    const text = encodeURIComponent(
      `Halo Kedai Gadget, saya ingin menjual iPhone saya:\n` +
      `- Unit: ${cleanModel}\n` +
      `- Garansi/Asal: ${sanitizeInput(sellForm.origin, 50)}\n` +
      `- Deskripsi/Minus: ${cleanDesc}\n` +
      `- Metode Pencairan: ${sanitizeInput(sellForm.method, 40)}\n` +
      `- Kontak WA: ${cleanPhone}\n\n` +
      `Berapa estimasi penawaran harga terbaik dari Kedai Gadget?`
    );
    window.open(`https://wa.me/628976747272?text=${text}`, '_blank');
  };

  return (
    <div className="bg-surface font-body-md text-on-surface antialiased selection:bg-secondary-container selection:text-on-secondary-fixed">
      {/* HEADER */}
      <header className="fixed top-0 w-full z-50">
        <div className="bg-primary-container text-surface-bright border-b border-outline/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-margin h-9 sm:h-10 flex items-center justify-between font-label-sm text-label-sm">
            <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span>
              </span>
              <span className="tracking-wide text-surface-dim truncate text-[11px] sm:text-[13px]">Buka 24 Jam • Customer Service Siap Melayani</span>
            </div>
            <div className="hidden sm:flex items-center gap-space-lg text-surface-dim shrink-0">
              <span>Penatih, Denpasar Timur</span>
              <span className="text-outline/40">/</span>
              <a className="hover:text-surface-bright transition-colors" href="https://www.instagram.com/kedaigadgett" target="_blank" rel="noopener noreferrer">@kedaigadgett</a>
            </div>
          </div>
        </div>

        <div className="bg-surface/90 backdrop-blur-xl border-b border-outline-variant/40 shadow-[0_1px_8px_rgba(23,24,26,0.03)]">
          <div className="h-16 sm:h-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-margin flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 sm:gap-space-lg min-w-0">
              <a className="flex items-center gap-2 sm:gap-space-md group min-w-0" href="#">
                <img alt="Kedai Gadget Brand Logo" className="h-8 sm:h-10 w-auto object-contain shrink-0" src="/logo.png" />
                <div className="flex flex-col min-w-0">
                  <span className="font-label-sm text-[9px] sm:text-label-sm uppercase tracking-widest text-on-surface-variant font-medium truncate">iPhone Specialist</span>
                  <span className="font-headline-sm text-sm sm:text-headline-sm tracking-tight text-primary font-bold truncate">KEDAI GADGET</span>
                </div>
              </a>
            </div>
            <nav className="hidden lg:flex items-center gap-space-lg">
              <a className="py-space-xs transition-colors text-primary border-b-2 border-primary font-semibold font-label-md text-label-md" href="#katalog">Katalog Unit</a>
              <a className="font-label-md text-label-md py-space-xs text-on-surface-variant hover:text-on-surface transition-colors" href="#tukar-tambah">Tukar Tambah</a>
              <a className="font-label-md text-label-md py-space-xs text-on-surface-variant hover:text-on-surface transition-colors" href="#jual-iphone">Jual iPhone</a>
              <a className="font-label-md text-label-md py-space-xs text-on-surface-variant hover:text-on-surface transition-colors" href="#lokasi">Lokasi Toko</a>
            </nav>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setIsAdminOpen(true)}
                className="inline-flex items-center gap-1 px-3 py-1.5 sm:px-space-md sm:py-space-xs rounded bg-surface-container-low border border-outline-variant/60 font-label-sm text-[11px] sm:text-label-sm text-on-surface hover:bg-surface-container hover:text-on-surface transition-all"
              >
                <span className="material-symbols-outlined text-[15px] sm:text-[16px]">lock</span>
                <span className="hidden xs:inline">Kelola</span> Stok
              </button>
              <div className="flex items-center gap-2 pl-2 border-l border-outline-variant/40">
                <div className="text-right hidden md:block">
                  <p className="font-label-sm text-label-sm font-semibold text-primary">Store Service</p>
                  <p className="font-label-sm text-label-sm text-secondary flex items-center justify-end gap-1">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-secondary"></span>Siap Melayani 24 Jam
                  </p>
                </div>
                <img alt="Kedai Gadget" className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover ring-1 ring-outline-variant/60" src="/logo.png" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN BODY */}
      <main className="w-full pt-[6.5rem] sm:pt-[7.5rem] bg-surface min-h-[calc(100vh-200px)]">
        <div className="flex flex-col w-full">
          {/* Subtle Grain & Dot Atmosphere */}
          <div className="w-full relative overflow-hidden bg-surface">
            <div className="absolute inset-0 pointer-events-none opacity-40 [background-image:radial-gradient(#c6c6ca_1px,transparent_1px)] [background-size:24px_24px]"></div>

            {/* 1. HERO SECTION */}
            <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-margin pt-6 sm:pt-space-xl pb-10 sm:pb-space-xl">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-space-xl items-start">
                {/* Left 7 Columns */}
                <div className="lg:col-span-7 space-y-4 sm:space-y-space-lg">
                  <div className="inline-flex items-center gap-space-xs px-2.5 py-1 rounded bg-secondary-container/40 text-on-secondary-container font-label-sm text-[10px] sm:text-label-sm uppercase tracking-widest font-semibold">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-secondary"></span>
                    Atelier Curated Edition • Penatih, Denpasar Timur
                  </div>

                  <div className="space-y-1">
                    <h1 className="font-display-lg text-2xl sm:text-headline-lg lg:text-display-lg font-bold text-primary tracking-tight leading-[1.15]">
                      Koleksi iPhone Pilihan.
                    </h1>
                    <p className="font-display-lg text-2xl sm:text-headline-lg lg:text-display-lg font-bold text-outline tracking-tight leading-[1.15]">
                      Kurasi ketat, garansi transparan.
                    </p>
                    <p className="font-display-lg text-2xl sm:text-headline-lg lg:text-display-lg font-bold text-primary tracking-tight leading-[1.15]">
                      Siap pakai tanpa kompromi.
                    </p>
                  </div>

                  <p className="font-body-lg text-sm sm:text-body-lg text-on-surface-variant max-w-xl leading-relaxed">
                    Penyedia iPhone terpercaya berbasis di Penatih, Denpasar Timur - Bali. Setiap unit sudah lolos quality control ketat dengan battery health prima demi kenyamanan pemakaian jangka panjang. Siap COD seluruh Bali 24 jam nonstop.
                  </p>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1 sm:pt-space-xs">
                    <a className="inline-flex items-center justify-center gap-space-sm px-5 py-3 rounded bg-primary text-on-primary font-label-md text-label-md hover:bg-primary-container active:scale-[0.99] transition-all shadow-md text-center" href="#katalog">
                      <span className="material-symbols-outlined text-[18px]">devices</span>
                      Jelajahi Katalog
                    </a>
                    <a className="inline-flex items-center justify-center gap-space-xs px-5 py-3 rounded bg-surface-container-lowest text-on-surface font-label-md text-label-md hover:bg-surface-container active:scale-[0.99] transition-all shadow-sm text-center border border-outline-variant/40" href="https://wa.me/628976747272?text=Halo%20Kedai%20Gadget%2C%20saya%20ingin%20tanya%20customer%20service" target="_blank" rel="noopener noreferrer">
                      <span className="material-symbols-outlined text-[18px] text-secondary">support_agent</span>
                      Customer Service
                    </a>
                  </div>

                  <div className="pt-2 sm:pt-space-sm grid grid-cols-1 sm:grid-cols-2 gap-2 font-label-sm text-xs text-on-surface">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-surface-container-high/60">
                      <span className="material-symbols-outlined text-secondary text-[16px] shrink-0">verified</span> Sudah Lolos Quality Control
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-surface-container-high/60">
                      <span className="material-symbols-outlined text-secondary text-[16px] shrink-0">task_alt</span> IMEI Terdaftar &amp; Sinyal Permanen
                    </span>
                  </div>
                </div>

                {/* Right 5 Columns */}
                <div className="lg:col-span-5 bg-surface-container-lowest rounded-xl p-5 sm:p-space-lg shadow-xl relative overflow-hidden border border-outline-variant/30">
                  <div className="flex items-center justify-between gap-space-sm pb-4 border-b border-surface-container">
                    <div className="flex items-center gap-space-sm">
                      <img src="/logo.png" alt="Logo" className="w-10 h-10 object-contain rounded bg-surface-container-low shrink-0" />
                      <div>
                        <h3 className="font-headline-sm text-base sm:text-headline-sm text-primary font-bold">Kedai Gadget</h3>
                        <p className="font-body-sm text-xs sm:text-body-sm text-on-surface-variant">Flagship Atelier &amp; Service Care</p>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-secondary-container/50 text-secondary font-label-sm text-[11px] sm:text-label-sm font-medium shrink-0">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span>
                      </span>
                      Buka 24 Jam
                    </span>
                  </div>

                  <div className="space-y-4 py-4">
                    <div className="flex items-start gap-3">
                      <span className="material-symbols-outlined text-outline mt-0.5 text-[20px] shrink-0">schedule</span>
                      <div className="min-w-0 flex-1">
                        <p className="font-label-sm text-[11px] text-on-surface-variant uppercase font-semibold">Jam Operasional</p>
                        <p className="font-body-md text-sm sm:text-body-md text-primary font-medium">24 Jam Nonstop <span className="text-on-surface-variant text-xs">(Buka Setiap Hari)</span></p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="material-symbols-outlined text-outline mt-0.5 text-[20px] shrink-0">pin_drop</span>
                      <div className="min-w-0 flex-1">
                        <p className="font-label-sm text-[11px] text-on-surface-variant uppercase font-semibold">Area Layanan &amp; COD</p>
                        <p className="font-body-md text-sm sm:text-body-md text-primary font-medium leading-snug">Penatih, Denpasar Timur, Bali</p>
                        <p className="font-body-sm text-xs text-on-surface-variant mt-0.5">Sistem Online &amp; COD langsung di tempat se-Bali</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="material-symbols-outlined text-outline mt-0.5 text-[20px] shrink-0">chat</span>
                      <div className="min-w-0 flex-1">
                        <p className="font-label-sm text-[11px] text-on-surface-variant uppercase font-semibold">WhatsApp Customer Service</p>
                        <p className="font-body-md text-sm sm:text-body-md text-primary font-medium">0897-674-7272</p>
                        <p className="font-body-sm text-xs text-secondary font-medium mt-0.5">Chat langsung untuk tanya ketersediaan stok &amp; jadwal COD</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <a className="w-full inline-flex items-center justify-center gap-1.5 py-3 px-3 rounded bg-primary text-on-primary font-label-md text-sm hover:bg-primary-container transition-all" href="https://wa.me/628976747272" target="_blank" rel="noopener noreferrer">
                      <span className="material-symbols-outlined text-[16px]">send</span> Hubungi Customer Service
                    </a>
                  </div>

                  <div className="mt-4 p-2.5 rounded bg-surface-container-low flex items-center justify-between text-on-surface text-xs">
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-secondary text-[17px]">verified_user</span>
                      <span className="font-label-sm text-[11px] sm:text-label-sm">Quality Control</span>
                    </div>
                    <span className="font-label-sm text-[11px] sm:text-label-sm font-bold text-secondary">SUDAH LOLOS QC</span>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* 2. CATALOG SECTION */}
          <section className="w-full bg-surface-container-lowest py-8 sm:py-space-xl" id="katalog">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-margin space-y-5 sm:space-y-space-lg">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 sm:gap-space-md">
                <div>
                  <div className="font-label-sm text-[11px] sm:text-label-sm uppercase tracking-widest text-secondary font-semibold">Inventory Live Feed</div>
                  <h2 className="font-headline-lg text-2xl sm:text-headline-lg font-bold text-primary tracking-tight">Katalog Unit Kurasi</h2>
                  <p className="font-body-md text-xs sm:text-body-md text-on-surface-variant">Pembaruan stok harian. Real-photo, transparan, terjamin garansi.</p>
                </div>
                <div className="w-full md:w-80">
                  <div className="relative flex items-center">
                    <span className="material-symbols-outlined absolute left-3 text-outline text-[20px]">search</span>
                    <input
                      className="w-full pl-10 pr-4 py-2 sm:py-2.5 rounded bg-surface-container-low text-primary placeholder:text-outline font-body-sm text-xs sm:text-body-sm focus:outline-none focus:bg-surface-container-lowest shadow-sm transition-all"
                      placeholder="Cari tipe, warna, atau kapasitas..."
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Filter Controls */}
              <div className="space-y-3 pt-1">
                {/* Condition Filter */}
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => setActiveCondition('all')}
                    className={`px-3 py-1.5 sm:px-space-md sm:py-1.5 rounded-full font-label-md text-xs sm:text-label-md transition-all ${
                      activeCondition === 'all'
                        ? 'bg-primary text-on-primary shadow-sm'
                        : 'bg-surface-container-high text-on-surface-variant hover:text-primary'
                    }`}
                  >
                    Semua Unit
                  </button>
                  <button
                    onClick={() => setActiveCondition('second')}
                    className={`px-3 py-1.5 sm:px-space-md sm:py-1.5 rounded-full font-label-md text-xs sm:text-label-md transition-all ${
                      activeCondition === 'second'
                        ? 'bg-primary text-on-primary shadow-sm'
                        : 'bg-surface-container-high text-on-surface-variant hover:text-primary'
                    }`}
                  >
                    Second Like New
                  </button>
                  <button
                    onClick={() => setActiveCondition('bnib')}
                    className={`px-3 py-1.5 sm:px-space-md sm:py-1.5 rounded-full font-label-md text-xs sm:text-label-md transition-all ${
                      activeCondition === 'bnib'
                        ? 'bg-primary text-on-primary shadow-sm'
                        : 'bg-surface-container-high text-on-surface-variant hover:text-primary'
                    }`}
                  >
                    BNIB Segel
                  </button>
                </div>

                {/* Series Pills */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 text-nowrap no-scrollbar">
                  {[
                    { key: 'all', label: 'Semua Seri' },
                    { key: '17', label: 'iPhone 17 Series' },
                    { key: '16', label: 'iPhone 16 Series' },
                    { key: '15', label: 'iPhone 15 Series' },
                    { key: '14', label: 'iPhone 14 Series' },
                    { key: '13', label: 'iPhone 13 Series' },
                    { key: '12', label: 'iPhone 12 Series' },
                    { key: '11', label: 'iPhone 11 Series' },
                    { key: 'SE', label: 'iPhone SE Series' },
                    { key: 'X', label: 'iPhone X / XS / XR' },
                    { key: '8', label: 'iPhone 8 / 8 Plus' },
                  ].map((s) => (
                    <button
                      key={s.key}
                      onClick={() => setActiveSeries(s.key)}
                      className={`px-3 py-1 rounded font-label-sm text-xs sm:text-label-sm transition-colors ${
                        activeSeries === s.key
                          ? 'bg-surface-container-highest text-primary font-semibold'
                          : 'bg-surface-container text-on-surface-variant hover:text-primary'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Product Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-space-lg pt-2">
                {filteredProducts.map((p) => (
                  <div
                    key={p.id}
                    className="product-card group bg-surface-container-lowest rounded-xl p-4 sm:p-space-md shadow-md flex flex-col justify-between hover:shadow-xl transition-all duration-300 border border-outline-variant/30"
                  >
                    <div>
                      <div className="relative w-full aspect-square bg-surface-container-low rounded-lg overflow-hidden flex items-center justify-center p-3 sm:p-space-md">
                        <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-surface-container-lowest/90 backdrop-blur-sm text-primary font-label-sm text-[10px] sm:text-label-sm font-semibold shadow-sm">
                          {p.gradeBadge}
                        </span>
                        <span className="absolute top-2 right-2 inline-flex items-center gap-1 px-2 py-0.5 rounded bg-secondary-container/80 backdrop-blur-sm text-secondary font-label-sm text-[10px] sm:text-label-sm font-bold">
                          <span className="text-[7px]">●</span> {p.statusText}
                        </span>
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                      </div>
                      <div className="pt-3 sm:pt-space-md space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="px-2 py-0.5 rounded bg-surface-container text-on-surface font-label-sm text-[11px] sm:text-label-sm font-medium">{p.storage}</span>
                          <span className="inline-flex items-center gap-1 text-secondary font-label-sm text-[11px] sm:text-label-sm font-semibold">
                            <span className="material-symbols-outlined text-[14px]">battery_charging_full</span> BH {p.bh}
                          </span>
                        </div>
                        <h3 className="font-headline-sm text-base sm:text-headline-sm font-bold text-primary group-hover:text-secondary transition-colors truncate">
                          {p.name}
                        </h3>
                        <p className="font-body-sm text-xs sm:text-body-sm text-on-surface-variant line-clamp-1">{p.desc}</p>
                      </div>
                    </div>

                    <div className="pt-3 mt-3 border-t border-surface-container">
                      <div className="flex items-baseline gap-2 mb-2.5">
                        <span className="font-headline-sm text-base sm:text-headline-sm font-bold text-primary">{formatRupiah(p.price)}</span>
                        <span className="font-body-sm text-[11px] sm:text-body-sm text-outline line-through">{formatRupiah(p.originalPrice)}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => setSelectedProduct(p)}
                          className="py-2 px-2.5 rounded bg-surface-container-high text-primary font-label-sm text-xs sm:text-label-sm font-semibold hover:bg-surface-dim transition-all text-center"
                        >
                          Detail Unit
                        </button>
                        <a
                          className="py-2 px-2.5 rounded bg-primary text-on-primary font-label-sm text-xs sm:text-label-sm font-semibold hover:bg-primary-container transition-all flex items-center justify-center gap-1"
                          href={createProductWaUrl(p)}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Beli via WA
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Request Banner */}
              <div className="p-4 sm:p-space-lg rounded-xl bg-surface-container-low flex flex-col md:flex-row items-start md:items-center justify-between gap-3 sm:gap-space-md border border-outline-variant/30">
                <div className="space-y-0.5">
                  <p className="font-headline-sm text-sm sm:text-headline-sm font-bold text-primary">Tidak menemukan varian atau warna yang dicari?</p>
                  <p className="font-body-md text-xs sm:text-body-md text-on-surface-variant">Hubungi Customer Service kami untuk mencari unit terkurasi yang sudah lolos quality control.</p>
                </div>
                <a
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-space-xs px-4 py-2.5 sm:px-space-lg sm:py-space-sm rounded bg-primary text-on-primary font-label-md text-xs sm:text-label-md hover:bg-primary-container transition-all text-nowrap shadow-sm text-center"
                  href="https://wa.me/628976747272?text=Halo%20Kedai%20Gadget%2C%20saya%20ingin%20request%20unit%20khusus"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="material-symbols-outlined text-[18px]">travel_explore</span>
                  Request Unit Khusus
                </a>
              </div>
            </div>
          </section>

          {/* 3. SERVICES SECTION: TUKAR TAMBAH & JUAL IPHONE */}
          <section className="w-full bg-surface py-8 sm:py-space-xl relative" id="tukar-tambah">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-margin space-y-6 sm:space-y-space-lg">
              <div className="text-center max-w-2xl mx-auto space-y-1 sm:space-y-space-xs">
                <span className="font-label-sm text-[11px] sm:text-label-sm uppercase tracking-widest text-secondary font-semibold">Layanan Cepat &amp; Transparan</span>
                <h2 className="font-headline-lg text-2xl sm:text-headline-lg font-bold text-primary tracking-tight">Tukar Tambah &amp; Jual iPhone</h2>
                <p className="font-body-md text-xs sm:text-body-md text-on-surface-variant">Penaksiran harga objektif berbasis kondisi riil hardware tanpa potongan terselubung. Proses kilat 15 menit selesai.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-space-lg items-stretch">
                {/* FORM TUKAR TAMBAH */}
                <div className="bg-surface-container-lowest rounded-xl p-5 sm:p-space-lg shadow-md flex flex-col justify-between border border-outline-variant/30">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 pb-2 border-b border-surface-container">
                      <span className="w-10 h-10 rounded bg-secondary-container/50 text-secondary flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[24px]">published_with_changes</span>
                      </span>
                      <div>
                        <h3 className="font-headline-sm text-base sm:text-headline-sm font-bold text-primary">Tukar Tambah (Trade-in)</h3>
                        <p className="font-body-sm text-xs sm:text-body-sm text-on-surface-variant">Upgrade iPhone lama Anda ke seri terbaru secara instan</p>
                      </div>
                    </div>

                    <form className="space-y-3.5" onSubmit={handleTradeIn}>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block font-label-sm text-xs text-on-surface-variant font-medium mb-1">iPhone Saat Ini</label>
                          <select
                            className="w-full px-3 py-2.5 rounded bg-surface-container-low text-primary font-body-sm text-xs sm:text-body-sm focus:outline-none focus:bg-surface-container-lowest border border-outline-variant/40"
                            value={tradeForm.curr}
                            onChange={(e) => setTradeForm({ ...tradeForm, curr: e.target.value })}
                          >
                            <optgroup label="iPhone 17 Series">
                              <option value="iPhone 17 Pro Max">iPhone 17 Pro Max</option>
                              <option value="iPhone 17 Pro">iPhone 17 Pro</option>
                              <option value="iPhone 17 Slim / Air">iPhone 17 Slim / Air</option>
                              <option value="iPhone 17">iPhone 17</option>
                            </optgroup>
                            <optgroup label="iPhone 16 Series">
                              <option value="iPhone 16 Pro Max">iPhone 16 Pro Max</option>
                              <option value="iPhone 16 Pro">iPhone 16 Pro</option>
                              <option value="iPhone 16 Plus">iPhone 16 Plus</option>
                              <option value="iPhone 16">iPhone 16</option>
                            </optgroup>
                            <optgroup label="iPhone 15 Series">
                              <option value="iPhone 15 Pro Max">iPhone 15 Pro Max</option>
                              <option value="iPhone 15 Pro">iPhone 15 Pro</option>
                              <option value="iPhone 15 Plus">iPhone 15 Plus</option>
                              <option value="iPhone 15">iPhone 15</option>
                            </optgroup>
                            <optgroup label="iPhone 14 Series">
                              <option value="iPhone 14 Pro Max">iPhone 14 Pro Max</option>
                              <option value="iPhone 14 Pro">iPhone 14 Pro</option>
                              <option value="iPhone 14 Plus">iPhone 14 Plus</option>
                              <option value="iPhone 14">iPhone 14</option>
                            </optgroup>
                            <optgroup label="iPhone 13 Series">
                              <option value="iPhone 13 Pro Max">iPhone 13 Pro Max</option>
                              <option value="iPhone 13 Pro">iPhone 13 Pro</option>
                              <option value="iPhone 13">iPhone 13</option>
                              <option value="iPhone 13 mini">iPhone 13 mini</option>
                            </optgroup>
                            <optgroup label="iPhone 12 Series">
                              <option value="iPhone 12 Pro Max">iPhone 12 Pro Max</option>
                              <option value="iPhone 12 Pro">iPhone 12 Pro</option>
                              <option value="iPhone 12">iPhone 12</option>
                              <option value="iPhone 12 mini">iPhone 12 mini</option>
                            </optgroup>
                            <optgroup label="iPhone 11 Series">
                              <option value="iPhone 11 Pro Max">iPhone 11 Pro Max</option>
                              <option value="iPhone 11 Pro">iPhone 11 Pro</option>
                              <option value="iPhone 11">iPhone 11</option>
                            </optgroup>
                            <optgroup label="iPhone X / XS / XR">
                              <option value="iPhone XS Max">iPhone XS Max</option>
                              <option value="iPhone XS">iPhone XS</option>
                              <option value="iPhone XR">iPhone XR</option>
                              <option value="iPhone X">iPhone X</option>
                            </optgroup>
                            <optgroup label="iPhone SE & 8 Series">
                              <option value="iPhone SE (Gen 3)">iPhone SE (Gen 3)</option>
                              <option value="iPhone SE (Gen 2)">iPhone SE (Gen 2)</option>
                              <option value="iPhone 8 Plus">iPhone 8 Plus</option>
                              <option value="iPhone 8">iPhone 8</option>
                            </optgroup>
                          </select>
                        </div>
                        <div>
                          <label className="block font-label-sm text-xs text-on-surface-variant font-medium mb-1">Kapasitas Penyimpanan</label>
                          <select
                            className="w-full px-3 py-2.5 rounded bg-surface-container-low text-primary font-body-sm text-xs sm:text-body-sm focus:outline-none focus:bg-surface-container-lowest border border-outline-variant/40"
                            value={tradeForm.storage}
                            onChange={(e) => setTradeForm({ ...tradeForm, storage: e.target.value })}
                          >
                            <option value="64 GB">64 GB</option>
                            <option value="128 GB">128 GB</option>
                            <option value="256 GB">256 GB</option>
                            <option value="512 GB">512 GB</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block font-label-sm text-xs text-on-surface-variant font-medium mb-1">Estimasi Battery Health</label>
                          <input
                            className="w-full px-3 py-2.5 rounded bg-surface-container-low text-primary font-body-sm text-xs sm:text-body-sm focus:outline-none focus:bg-surface-container-lowest border border-outline-variant/40"
                            placeholder="Contoh: 85%"
                            type="text"
                            value={tradeForm.bh}
                            onChange={(e) => setTradeForm({ ...tradeForm, bh: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className="block font-label-sm text-xs text-on-surface-variant font-medium mb-1">Kondisi Fisik &amp; Kelengkapan</label>
                          <select
                            className="w-full px-3 py-2.5 rounded bg-surface-container-low text-primary font-body-sm text-xs sm:text-body-sm focus:outline-none focus:bg-surface-container-lowest border border-outline-variant/40"
                            value={tradeForm.condition}
                            onChange={(e) => setTradeForm({ ...tradeForm, condition: e.target.value })}
                          >
                            <option value="Mulus 99% • Fullset Box">Mulus 99% • Fullset Box</option>
                            <option value="Mulus 95% • Batangan Unit Only">Mulus 95% • Batangan Unit Only</option>
                            <option value="Ada Dent Kecil • Fullset">Ada Dent Kecil • Fullset</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block font-label-sm text-xs text-on-surface-variant font-medium mb-1">iPhone Impian Anda (Target Upgrade)</label>
                        <select
                          className="w-full px-3 py-2.5 rounded bg-surface-container-low text-primary font-body-sm text-xs sm:text-body-sm focus:outline-none focus:bg-surface-container-lowest border border-outline-variant/40"
                          value={tradeForm.target}
                          onChange={(e) => setTradeForm({ ...tradeForm, target: e.target.value })}
                        >
                          <optgroup label="Unit di Katalog Toko">
                            {products.map((p) => (
                              <option key={p.id} value={`${p.name} ${p.storage} (${p.color})`}>
                                {p.name} {p.storage} - {p.color}
                              </option>
                            ))}
                          </optgroup>
                          <optgroup label="iPhone 17 Series (Pre-Order / Booking)">
                            <option value="iPhone 17 Pro Max 256GB">iPhone 17 Pro Max 256GB</option>
                            <option value="iPhone 17 Pro 256GB">iPhone 17 Pro 256GB</option>
                            <option value="iPhone 17 Slim / Air 256GB">iPhone 17 Slim / Air 256GB</option>
                            <option value="iPhone 17 128GB">iPhone 17 128GB</option>
                          </optgroup>
                          <optgroup label="iPhone 16 Series">
                            <option value="iPhone 16 Pro Max 256GB">iPhone 16 Pro Max 256GB</option>
                            <option value="iPhone 16 Pro 128GB">iPhone 16 Pro 128GB</option>
                            <option value="iPhone 16 Plus 128GB">iPhone 16 Plus 128GB</option>
                            <option value="iPhone 16 128GB">iPhone 16 128GB</option>
                          </optgroup>
                          <optgroup label="iPhone 15 Series">
                            <option value="iPhone 15 Pro Max 256GB">iPhone 15 Pro Max 256GB</option>
                            <option value="iPhone 15 Pro 128GB">iPhone 15 Pro 128GB</option>
                            <option value="iPhone 15 Plus 128GB">iPhone 15 Plus 128GB</option>
                            <option value="iPhone 15 128GB">iPhone 15 128GB</option>
                          </optgroup>
                          <optgroup label="iPhone 14 Series">
                            <option value="iPhone 14 Pro Max 128GB">iPhone 14 Pro Max 128GB</option>
                            <option value="iPhone 14 Pro 128GB">iPhone 14 Pro 128GB</option>
                            <option value="iPhone 14 Plus 128GB">iPhone 14 Plus 128GB</option>
                            <option value="iPhone 14 128GB">iPhone 14 128GB</option>
                          </optgroup>
                          <optgroup label="iPhone 13 Series">
                            <option value="iPhone 13 Pro Max 128GB">iPhone 13 Pro Max 128GB</option>
                            <option value="iPhone 13 Pro 128GB">iPhone 13 Pro 128GB</option>
                            <option value="iPhone 13 128GB">iPhone 13 128GB</option>
                          </optgroup>
                        </select>
                      </div>

                      <div className="p-3 rounded bg-surface-container-low flex flex-col sm:flex-row sm:items-center justify-between gap-1 border border-outline-variant/30">
                        <div>
                          <span className="font-label-sm text-[11px] text-on-surface-variant block">Estimasi Nilai Tukar Unit Anda</span>
                          <span className="font-title-md text-base sm:text-title-md font-bold text-secondary">Rp 4.500.000 – Rp 6.200.000*</span>
                        </div>
                        <span className="font-label-sm text-[11px] text-outline">*Sesuai cek fisik</span>
                      </div>

                      <button className="w-full py-3 px-4 rounded bg-primary text-on-primary font-label-md text-sm hover:bg-primary-container transition-all flex items-center justify-center gap-2 shadow-md active:scale-[0.99]" type="submit">
                        <span className="material-symbols-outlined text-[18px]">calculate</span>
                        Hitung Nilai &amp; Ajukan via WA
                      </button>
                    </form>
                  </div>
                  <div className="pt-3 mt-2 font-label-sm text-[11px] sm:text-label-sm text-on-surface-variant flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px] text-secondary shrink-0">check_circle</span> Data langsung terformat di WhatsApp admin toko.
                  </div>
                </div>

                {/* FORM JUAL IPHONE */}
                <div className="bg-surface-container-lowest rounded-xl p-5 sm:p-space-lg shadow-md flex flex-col justify-between border border-outline-variant/30" id="jual-iphone">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 pb-2 border-b border-surface-container">
                      <span className="w-10 h-10 rounded bg-surface-container-highest text-primary flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[24px]">payments</span>
                      </span>
                      <div>
                        <h3 className="font-headline-sm text-base sm:text-headline-sm font-bold text-primary">Jual iPhone Anda</h3>
                        <p className="font-body-sm text-xs sm:text-body-sm text-on-surface-variant">Pencairan tunai atau transfer instan tanpa ribet nego berlarut-larut</p>
                      </div>
                    </div>

                    <form className="space-y-3.5" onSubmit={handleSell}>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block font-label-sm text-xs text-on-surface-variant font-medium mb-1">Model &amp; Seri</label>
                          <input
                            className="w-full px-3 py-2.5 rounded bg-surface-container-low text-primary font-body-sm text-xs sm:text-body-sm focus:outline-none focus:bg-surface-container-lowest border border-outline-variant/40"
                            placeholder="Contoh: iPhone 13 Pro 256GB Gold"
                            required
                            type="text"
                            value={sellForm.model}
                            onChange={(e) => setSellForm({ ...sellForm, model: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className="block font-label-sm text-xs text-on-surface-variant font-medium mb-1">Status Garansi Asal</label>
                          <select
                            className="w-full px-3 py-2.5 rounded bg-surface-container-low text-primary font-body-sm text-xs sm:text-body-sm focus:outline-none focus:bg-surface-container-lowest border border-outline-variant/40"
                            value={sellForm.origin}
                            onChange={(e) => setSellForm({ ...sellForm, origin: e.target.value })}
                          >
                            <option value="Resmi iBox / Digimap (PA/A, ID/A)">Resmi iBox / Digimap (PA/A, ID/A)</option>
                            <option value="Inter All Provider Terdaftar Bea Cukai">Inter All Provider Terdaftar Bea Cukai</option>
                            <option value="Lainnya">Lainnya</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block font-label-sm text-xs text-on-surface-variant font-medium mb-1">Catatan Kondisi Riil &amp; Minus (Jika Ada)</label>
                        <textarea
                          className="w-full px-3 py-2.5 rounded bg-surface-container-low text-primary font-body-sm text-xs sm:text-body-sm focus:outline-none focus:bg-surface-container-lowest border border-outline-variant/40"
                          placeholder="Contoh: Layar mulus tanpa scratch, TrueTone &amp; FaceID aktif, BH 89%, ada lecet halus di sudut bawah bekas case..."
                          rows={3}
                          value={sellForm.desc}
                          onChange={(e) => setSellForm({ ...sellForm, desc: e.target.value })}
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block font-label-sm text-xs text-on-surface-variant font-medium mb-1">Metode Pencairan</label>
                          <select
                            className="w-full px-3 py-2.5 rounded bg-surface-container-low text-primary font-body-sm text-xs sm:text-body-sm focus:outline-none focus:bg-surface-container-lowest border border-outline-variant/40"
                            value={sellForm.method}
                            onChange={(e) => setSellForm({ ...sellForm, method: e.target.value })}
                          >
                            <option value="Transfer Bank Instan (BCA / Mandiri / BRI)">Transfer Bank Instan (BCA / Mandiri / BRI)</option>
                            <option value="Tunai / Cash di Toko">Tunai / Cash di Toko</option>
                          </select>
                        </div>
                        <div>
                          <label className="block font-label-sm text-xs text-on-surface-variant font-medium mb-1">Nomor WhatsApp Anda</label>
                          <input
                            className="w-full px-3 py-2.5 rounded bg-surface-container-low text-primary font-body-sm text-xs sm:text-body-sm focus:outline-none focus:bg-surface-container-lowest border border-outline-variant/40"
                            placeholder="08xxxxxxxxxx"
                            required
                            type="tel"
                            value={sellForm.phone}
                            onChange={(e) => setSellForm({ ...sellForm, phone: e.target.value })}
                          />
                        </div>
                      </div>

                      <button className="w-full py-3 px-4 rounded bg-secondary text-on-secondary font-label-md text-sm hover:bg-secondary/90 transition-all flex items-center justify-center gap-2 shadow-md active:scale-[0.99]" type="submit">
                        <span className="material-symbols-outlined text-[18px]">monetization_on</span>
                        Dapatkan Penawaran Instan via WA
                      </button>
                    </form>
                  </div>
                  <div className="pt-3 mt-2 font-label-sm text-[11px] sm:text-label-sm text-on-surface-variant flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px] text-secondary shrink-0">verified</span> Kami bayar tunai di tempat setelah inspeksi fisik 10 menit.
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 4. LOCATION & SERVICE AREA SECTION */}
          <section className="w-full bg-surface-container-lowest py-8 sm:py-space-xl" id="lokasi">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-margin space-y-6 sm:space-y-space-lg">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 sm:gap-space-sm">
                <div>
                  <span className="font-label-sm text-[11px] sm:text-label-sm uppercase tracking-widest text-secondary font-semibold">Area Layanan &amp; Pengiriman</span>
                  <h2 className="font-headline-lg text-2xl sm:text-headline-lg font-bold text-primary tracking-tight">Penatih, Denpasar Timur &amp; COD se-Bali</h2>
                  <p className="font-body-md text-xs sm:text-body-md text-on-surface-variant">Transaksi aman dengan sistem Cash on Delivery (COD) atau pengiriman langsung.</p>
                </div>
                <div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-secondary-container/40 text-secondary font-label-sm text-xs sm:text-label-sm font-semibold">
                    <span className="inline-block w-2 h-2 rounded-full bg-secondary"></span>
                    Online Store • Layanan 24 Jam
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-space-lg items-stretch">
                <div className="bg-surface rounded-xl p-5 sm:p-space-lg space-y-4 border border-outline-variant/30 flex flex-col justify-between">
                  <div>
                    <span className="font-label-sm text-[11px] uppercase text-outline font-semibold">Basis Operasional</span>
                    <h3 className="font-headline-sm text-base sm:text-headline-sm font-bold text-primary mt-1">Kedai Gadget Bali</h3>
                    <p className="font-body-md text-xs sm:text-body-md text-on-surface mt-1.5 leading-relaxed">
                      Berbasis di <strong>Penatih, Denpasar Timur, Bali</strong>. Saat ini kami melayani penjualan secara online dengan kemudahan transaksi COD (ketemuan di lokasi yang disepakati) di seluruh area Denpasar, Badung, Gianyar, dan sekitarnya.
                    </p>
                    <p className="font-body-sm text-[11px] sm:text-body-sm text-secondary font-medium mt-2">
                      ✓ Pembeli bisa cek fisik dan fungsi unit sepuasnya sebelum bayar di tempat.
                    </p>
                  </div>
                  <div className="space-y-2 pt-3 border-t border-surface-container">
                    <div className="flex items-center justify-between text-xs sm:text-body-sm">
                      <span className="text-on-surface-variant">Jam Layanan Chat &amp; Janji COD</span>
                      <span className="font-semibold text-primary">24 Jam Nonstop</span>
                    </div>
                    <div className="flex items-center justify-between text-xs sm:text-body-sm">
                      <span className="text-on-surface-variant">Sistem Pembayaran</span>
                      <span className="font-semibold text-primary">Cash di Tempat / Transfer Bank</span>
                    </div>
                  </div>
                </div>

                <div className="bg-surface rounded-xl p-5 sm:p-space-lg border border-outline-variant/30 flex flex-col justify-between space-y-4">
                  <div>
                    <h4 className="font-label-sm text-xs uppercase font-semibold text-on-surface tracking-wider">Keunggulan Layanan Kami</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 font-body-sm text-xs text-on-surface">
                      <div className="flex items-center gap-2.5 p-2 rounded bg-surface-container-low">
                        <span className="material-symbols-outlined text-secondary text-[20px] shrink-0">verified</span> Sudah Lolos QC
                      </div>
                      <div className="flex items-center gap-2.5 p-2 rounded bg-surface-container-low">
                        <span className="material-symbols-outlined text-secondary text-[20px] shrink-0">local_shipping</span> Siap COD se-Bali
                      </div>
                      <div className="flex items-center gap-2.5 p-2 rounded bg-surface-container-low">
                        <span className="material-symbols-outlined text-secondary text-[20px] shrink-0">support_agent</span> Customer Service 24 Jam
                      </div>
                      <div className="flex items-center gap-2.5 p-2 rounded bg-surface-container-low">
                        <span className="material-symbols-outlined text-secondary text-[20px] shrink-0">task_alt</span> Sinyal IMEI Permanen
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <a
                      className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded bg-primary text-on-primary font-label-md text-xs sm:text-label-md hover:bg-primary-container transition-all shadow-md text-center"
                      href="https://wa.me/628976747272?text=Halo%20Customer%20Service%20Kedai%20Gadget%2C%20apakah%20bisa%20janjian%20COD%20hari%20ini%3F"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span className="material-symbols-outlined text-[18px]">chat</span>
                      Janjian COD via Customer Service
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="w-full bg-surface-container-lowest border-t border-outline-variant/40 mt-8 sm:mt-space-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-margin py-8 sm:py-space-xl grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-space-lg">
          <div className="md:col-span-5 space-y-3">
            <div className="flex items-center gap-2.5">
              <img alt="Kedai Gadget Brand Logo" className="h-8 w-auto object-contain" src="/logo.png" />
              <span className="font-headline-sm text-base sm:text-headline-sm font-bold tracking-tight text-primary">KEDAI GADGET</span>
            </div>
            <p className="font-body-sm text-xs sm:text-body-sm text-on-surface-variant max-w-md leading-relaxed">
              Atelier kurasi dan servis iPhone berstandar presisi editorial. Setiap unit melalui inspeksi diagnostik 32-titik ketat untuk menjamin keaslian komponen OEM, battery health prima, dan transparansi riwayat perangkat.
            </p>
            <div className="pt-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-secondary-container/40 border border-secondary/30 text-secondary font-label-sm text-[11px] font-semibold">
                <span className="text-[8px]">●</span> Atelier Verified Diagnostics
              </span>
            </div>
          </div>
          <div className="md:col-span-2 space-y-2">
            <h4 className="font-label-sm text-xs uppercase tracking-wider text-on-surface font-semibold">Eksplorasi</h4>
            <ul className="space-y-1.5 font-body-sm text-xs sm:text-body-sm text-on-surface-variant">
              <li><a className="hover:text-primary transition-colors" href="#katalog">Katalog Unit</a></li>
              <li><a className="hover:text-primary transition-colors" href="#tukar-tambah">Tukar Tambah</a></li>
              <li><a className="hover:text-primary transition-colors" href="#jual-iphone">Jual iPhone</a></li>
              <li><a className="hover:text-primary transition-colors" href="#lokasi">Lokasi &amp; Jam Buka</a></li>
            </ul>
          </div>
          <div className="md:col-span-2 space-y-2">
            <h4 className="font-label-sm text-xs uppercase tracking-wider text-on-surface font-semibold">Operasional</h4>
            <ul className="space-y-1.5 font-body-sm text-xs sm:text-body-sm text-on-surface-variant">
              <li>Buka 24 Jam Nonstop</li>
              <li>Senin – Minggu</li>
              <li>Sistem COD &amp; Online</li>
              <li>Sudah Lolos QC</li>
            </ul>
          </div>
          <div className="md:col-span-3 space-y-2">
            <h4 className="font-label-sm text-xs uppercase tracking-wider text-on-surface font-semibold">Layanan &amp; COD</h4>
            <p className="font-body-sm text-xs sm:text-body-sm text-on-surface-variant">Penatih, Denpasar Timur, Bali</p>
            <p className="font-label-sm text-xs text-on-surface-variant">WhatsApp: 0897-674-7272</p>
            <p className="font-label-sm text-xs text-on-surface-variant">Instagram: @kedaigadgett</p>
          </div>
        </div>

        <div className="border-t border-outline-variant/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-margin py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
            <p className="font-body-sm text-[11px] sm:text-xs text-on-surface-variant">© {new Date().getFullYear()} Kedai Gadget. Hak cipta dilindungi undang-undang.</p>
            <p className="font-label-sm text-[10px] sm:text-[11px] text-on-surface-variant">Paper Minimalist Design System • Penatih Edition</p>
          </div>
        </div>
      </footer>

      {/* FLOATING WHATSAPP BUTTON */}
      <div className="fixed bottom-5 right-4 sm:bottom-6 sm:right-6 z-40">
        <a
          className="group flex items-center gap-2 bg-primary text-on-primary pl-3.5 pr-4 py-2.5 rounded-full shadow-[0_8px_30px_rgba(23,24,26,0.2)] border border-outline-variant/40 hover:bg-primary-container transition-all active:scale-95"
          href="https://wa.me/628976747272"
          rel="noopener noreferrer"
          target="_blank"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary-fixed opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary-fixed"></span>
          </span>
          <span className="font-label-md text-xs sm:text-label-md font-medium tracking-wide">Customer Service</span>
          <span className="hidden sm:inline font-label-sm text-xs text-primary-fixed">
            &nbsp;• Respon Cepat
          </span>
        </a>
      </div>

      {/* DETAIL MODAL */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-primary/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-surface-container-lowest rounded-t-2xl sm:rounded-xl max-w-2xl w-full p-4 sm:p-space-lg shadow-2xl relative max-h-[90vh] overflow-y-auto space-y-4 border border-outline-variant/40">
            <button
              className="absolute top-3 right-3 sm:top-4 sm:right-4 w-8 h-8 rounded-full bg-surface-container-high hover:bg-surface-dim flex items-center justify-center text-primary transition-all z-10"
              onClick={() => {
                setSelectedProduct(null);
                setActiveModalImageIndex(0);
              }}
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>

            {/* Gallery Multiple Photos Showcase with Fullscreen Trigger & Swipe/Arrow Navigation */}
            {(() => {
              const galleryImages = selectedProduct.images && selectedProduct.images.length > 0 
                ? selectedProduct.images 
                : [selectedProduct.image];
              const totalImages = galleryImages.length;
              const currentImg = galleryImages[activeModalImageIndex] || galleryImages[0];

              const handlePrev = (e?: React.MouseEvent) => {
                e?.stopPropagation();
                setActiveModalImageIndex((prev) => (prev > 0 ? prev - 1 : totalImages - 1));
              };

              const handleNext = (e?: React.MouseEvent) => {
                e?.stopPropagation();
                setActiveModalImageIndex((prev) => (prev < totalImages - 1 ? prev + 1 : 0));
              };

              const handleTouchStart = (e: React.TouchEvent) => {
                setTouchStartX(e.targetTouches[0].clientX);
              };

              const handleTouchMove = (e: React.TouchEvent) => {
                setTouchEndX(e.targetTouches[0].clientX);
              };

              const handleTouchEnd = () => {
                if (touchStartX === null || touchEndX === null) return;
                const distance = touchStartX - touchEndX;
                const isLeftSwipe = distance > 40;
                const isRightSwipe = distance < -40;

                if (isLeftSwipe && totalImages > 1) {
                  handleNext();
                } else if (isRightSwipe && totalImages > 1) {
                  handlePrev();
                }
                setTouchStartX(null);
                setTouchEndX(null);
              };

              return (
                <div className="space-y-2.5">
                  <div
                    onClick={() => setFullscreenImage(currentImg)}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    className="relative w-full aspect-[4/3] sm:aspect-[16/10] bg-surface-container-low rounded-xl overflow-hidden flex items-center justify-center border border-outline-variant/30 cursor-zoom-in group select-none"
                    title="Klik untuk melihat foto fullscreen atau geser kanan/kiri"
                  >
                    <img
                      src={currentImg}
                      alt={selectedProduct.name}
                      className="w-full h-full object-contain p-2 group-hover:scale-[1.02] transition-transform duration-300 pointer-events-none"
                    />

                    {/* Navigation Arrows for Non-Fullscreen (Desktop/Tablet) */}
                    {totalImages > 1 && (
                      <>
                        <button
                          type="button"
                          onClick={handlePrev}
                          className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-primary/60 hover:bg-primary/90 text-on-primary flex items-center justify-center transition-all opacity-80 sm:opacity-0 sm:group-hover:opacity-100 z-10 shadow-md"
                          title="Foto Sebelumnya"
                        >
                          <span className="material-symbols-outlined text-[20px]">chevron_left</span>
                        </button>
                        <button
                          type="button"
                          onClick={handleNext}
                          className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-primary/60 hover:bg-primary/90 text-on-primary flex items-center justify-center transition-all opacity-80 sm:opacity-0 sm:group-hover:opacity-100 z-10 shadow-md"
                          title="Foto Selanjutnya"
                        >
                          <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                        </button>
                      </>
                    )}

                    <div className="absolute top-2 right-2 p-1.5 rounded-full bg-primary/70 backdrop-blur-sm text-on-primary opacity-80 group-hover:opacity-100 transition-opacity">
                      <span className="material-symbols-outlined text-[18px]">fullscreen</span>
                    </div>
                    <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-primary/80 backdrop-blur-sm text-on-primary font-label-sm text-[10px]">
                      Foto {activeModalImageIndex + 1} / {totalImages} {totalImages > 1 ? '• Geser ↔' : ''}
                    </div>
                  </div>

                  {totalImages > 1 && (
                    <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                      {galleryImages.map((imgUrl, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setActiveModalImageIndex(i)}
                          className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                            activeModalImageIndex === i
                              ? 'border-primary shadow-sm scale-105'
                              : 'border-outline-variant/40 opacity-70 hover:opacity-100'
                          }`}
                        >
                          <img src={imgUrl} alt={`Foto ${i + 1}`} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })()}

            <div className="space-y-1 pr-8">
              <span className="px-2 py-0.5 rounded bg-surface-container text-primary font-label-sm text-[10px] sm:text-label-sm font-semibold">
                {selectedProduct.gradeBadge}
              </span>
              <h3 className="font-headline-md text-lg sm:text-headline-md font-bold text-primary">
                {selectedProduct.name}
              </h3>
              <p className="font-body-sm text-xs sm:text-body-sm text-on-surface-variant">
                {selectedProduct.color} • {selectedProduct.storage}
              </p>
            </div>

            <div className="p-3 rounded bg-surface-container-low flex items-center justify-between border border-outline-variant/30">
              <span className="font-body-sm text-xs sm:text-body-sm text-on-surface-variant">Harga Unit Final</span>
              <span className="font-headline-sm text-base sm:text-headline-sm font-bold text-primary">
                {formatRupiah(selectedProduct.price)}
              </span>
            </div>

            {/* Catatan Detail (Jika Ada) */}
            {selectedProduct.minus && (
              <div className="p-3 rounded-lg bg-surface-container-high/60 border border-outline-variant/40 space-y-1">
                <div className="flex items-center gap-1.5 font-label-sm text-xs font-bold text-primary">
                  <span className="material-symbols-outlined text-[17px] text-secondary">info</span>
                  Detail:
                </div>
                <p className="font-body-sm text-xs leading-relaxed text-on-surface pl-6">
                  {selectedProduct.minus}
                </p>
              </div>
            )}

            {/* Deskripsi Lengkap Produk */}
            <div className="space-y-1">
              <h4 className="font-label-sm text-xs uppercase tracking-wider font-semibold text-on-surface">
                Deskripsi &amp; Detail Kondisi
              </h4>
              <p className="font-body-sm text-xs sm:text-body-sm text-on-surface-variant leading-relaxed bg-surface-container-low p-3 rounded-lg border border-outline-variant/30">
                {selectedProduct.desc}
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-label-sm text-xs uppercase tracking-wider font-semibold text-on-surface">
                Spesifikasi &amp; Verifikasi Diagnostik
              </h4>
              <div className="space-y-2 pt-1 font-body-sm text-xs sm:text-body-sm">
                <div className="flex items-center justify-between py-1.5 border-b border-surface-container">
                  <span className="text-on-surface-variant">Battery Health</span>
                  <span className="font-bold text-secondary flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">battery_charging_full</span> {selectedProduct.bh}
                  </span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-surface-container">
                  <span className="text-on-surface-variant">Status Garansi / IMEI</span>
                  <span className="font-medium text-primary text-right">{selectedProduct.warranty}</span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-surface-container">
                  <span className="text-on-surface-variant">Kelengkapan Paket</span>
                  <span className="font-medium text-primary text-right">{selectedProduct.completeness}</span>
                </div>
                <div className="flex items-center justify-between py-1.5">
                  <span className="text-on-surface-variant">Status Verifikasi</span>
                  <span className="font-bold text-secondary flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">check_circle</span> 100% Lolos Uji Fungsi
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <a
                className="w-full py-3 px-4 rounded bg-primary text-on-primary font-label-md text-xs sm:text-label-md hover:bg-primary-container transition-all flex items-center justify-center gap-2 shadow-md active:scale-[0.99] text-center"
                href={createDetailModalWaUrl(selectedProduct)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="material-symbols-outlined text-[18px]">chat</span>
                Konfirmasi &amp; Ambil Unit via WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}

      {/* SECURITY VAULT & STOCK MANAGEMENT MODAL */}
      {isAdminOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-primary/60 backdrop-blur-md animate-fade-in">
          <div className="bg-surface-container-lowest rounded-t-2xl sm:rounded-xl max-w-2xl w-full p-5 sm:p-space-lg shadow-2xl relative max-h-[85vh] sm:max-h-[92vh] overflow-y-auto space-y-4 sm:space-y-space-md border border-outline-variant/60">
            <button
              className="absolute top-3 right-3 sm:top-4 sm:right-4 w-8 h-8 rounded-full bg-surface-container-high hover:bg-surface-dim flex items-center justify-center text-primary transition-all z-10"
              onClick={() => {
                setIsAdminOpen(false);
                setIsAdminAuthenticated(false);
                setAuthError('');
                setAdminPin('');
              }}
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>

            {!isAdminAuthenticated ? (
              <div className="space-y-4 py-2">
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded bg-primary text-on-primary flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[22px]">security</span>
                  </span>
                  <div>
                    <h3 className="font-headline-sm text-base sm:text-headline-sm font-bold text-primary">Autentikasi Vault Manajer</h3>
                    <p className="font-body-sm text-xs sm:text-body-sm text-on-surface-variant">Masukkan 6-digit PIN keamanan untuk mengelola stok &amp; harga.</p>
                  </div>
                </div>

                <form onSubmit={handleAdminLogin} className="space-y-3 pt-1">
                  <div>
                    <label className="block font-label-sm text-xs text-on-surface-variant font-medium mb-1">Master PIN</label>
                    <input
                      type="password"
                      maxLength={10}
                      placeholder="Default PIN: 123456"
                      value={adminPin}
                      onChange={(e) => setAdminPin(e.target.value)}
                      className="w-full px-3 py-2.5 rounded bg-surface-container-low text-primary font-body-sm text-sm tracking-widest focus:outline-none focus:bg-surface-container-lowest border border-outline-variant/60"
                      autoFocus
                    />
                  </div>

                  {authError && (
                    <div className="p-2.5 rounded bg-error-container text-on-error-container text-xs font-semibold flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px]">warning</span>
                      {authError}
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 rounded bg-primary text-on-primary font-label-md text-xs sm:text-label-md hover:bg-primary-container transition-all flex items-center justify-center gap-2 shadow-md active:scale-[0.99]"
                  >
                    <span className="material-symbols-outlined text-[18px]">lock_open</span>
                    Verifikasi Akses Vault
                  </button>

                  <p className="text-[10px] sm:text-[11px] text-outline text-center">Proteksi Hash SHA-256 + Constant-Time Evaluation + Client Rate Limiting.</p>
                </form>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-surface-container pb-3">
                  <div>
                    <span className="font-label-sm text-[10px] uppercase tracking-widest text-secondary font-semibold">Vault Terbuka</span>
                    <h3 className="font-headline-sm text-base sm:text-headline-sm font-bold text-primary">Pengelolaan Stok &amp; Harga Unit</h3>
                  </div>
                  <button
                    onClick={() => setIsAdminAuthenticated(false)}
                    className="text-xs text-on-surface-variant hover:text-primary underline"
                  >
                    Kunci
                  </button>
                </div>

                <div className="space-y-2 divide-y divide-surface-container max-h-[55vh] overflow-y-auto pr-1">
                  {products.map((item) => (
                    <div key={item.id} className="pt-2.5 first:pt-0 flex flex-col xs:flex-row xs:items-center justify-between gap-2.5">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img src={item.image} alt={item.name} className="w-9 h-9 object-contain rounded bg-surface-container-low shrink-0" />
                        <div className="min-w-0">
                          <h4 className="font-label-md text-xs sm:text-label-md font-bold text-primary truncate">{item.name}</h4>
                          <p className="text-[11px] text-on-surface-variant">{item.storage} • {item.color} • BH {item.bh}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between xs:justify-end gap-2.5 shrink-0">
                        {editingId === item.id ? (
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              value={tempPrice}
                              onChange={(e) => setTempPrice(Number(e.target.value))}
                              className="w-24 px-2 py-1 rounded bg-surface-container text-primary font-body-sm text-[11px] border border-outline-variant"
                            />
                            <button
                              onClick={() => handleSavePrice(item.id)}
                              className="px-2 py-1 rounded bg-primary text-on-primary text-[10px] font-bold"
                            >
                              Simpan
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="px-2 py-1 rounded bg-surface-container-high text-primary text-[10px]"
                            >
                              Batal
                            </button>
                          </div>
                        ) : (
                          <div className="text-left xs:text-right">
                            <span className="font-label-md text-xs sm:text-label-md font-bold text-primary block">{formatRupiah(item.price)}</span>
                            <button
                              onClick={() => {
                                setEditingId(item.id);
                                setTempPrice(item.price);
                              }}
                              className="text-[10px] text-secondary hover:underline"
                            >
                              Ubah Harga
                            </button>
                          </div>
                        )}

                        <button
                          onClick={() => handleToggleStock(item.id)}
                          className={`px-2.5 py-1.5 rounded font-label-sm text-[11px] font-bold flex items-center gap-1 transition-all ${
                            item.isReady
                              ? 'bg-secondary-container/60 text-secondary border border-secondary/30 hover:bg-secondary-container'
                              : 'bg-surface-container-high text-outline hover:text-primary'
                          }`}
                        >
                          <span className="text-[7px]">●</span>
                          {item.isReady ? 'Ready' : 'Habis'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-2.5 rounded bg-surface-container-low flex flex-col xs:flex-row items-start xs:items-center justify-between gap-1 text-xs text-on-surface-variant border border-outline-variant/30">
                  <span className="text-[11px]">Tersinkronisasi otomatis seketika.</span>
                  <button
                    onClick={() => {
                      if (confirm('Reset semua data stok kembali ke setelan default awal?')) {
                        localStorage.removeItem('kg_vault_stock');
                        setProducts(PRODUCTS);
                      }
                    }}
                    className="text-error hover:underline text-[11px]"
                  >
                    Reset Default
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* FULLSCREEN IMAGE LIGHTBOX MODAL WITH SWIPE & ARROWS */}
      {fullscreenImage && selectedProduct && (
        (() => {
          const gallery = selectedProduct.images && selectedProduct.images.length > 0 
            ? selectedProduct.images 
            : [selectedProduct.image];
          const total = gallery.length;

          const handlePrevFs = (e?: React.MouseEvent) => {
            e?.stopPropagation();
            setActiveModalImageIndex((prev) => {
              const nextIdx = prev > 0 ? prev - 1 : total - 1;
              setFullscreenImage(gallery[nextIdx]);
              return nextIdx;
            });
          };

          const handleNextFs = (e?: React.MouseEvent) => {
            e?.stopPropagation();
            setActiveModalImageIndex((prev) => {
              const nextIdx = prev < total - 1 ? prev + 1 : 0;
              setFullscreenImage(gallery[nextIdx]);
              return nextIdx;
            });
          };

          const handleFsTouchStart = (e: React.TouchEvent) => {
            setTouchStartX(e.targetTouches[0].clientX);
          };

          const handleFsTouchMove = (e: React.TouchEvent) => {
            setTouchEndX(e.targetTouches[0].clientX);
          };

          const handleFsTouchEnd = () => {
            if (touchStartX === null || touchEndX === null) return;
            const distance = touchStartX - touchEndX;
            const isLeftSwipe = distance > 40;
            const isRightSwipe = distance < -40;

            if (isLeftSwipe && total > 1) {
              handleNextFs();
            } else if (isRightSwipe && total > 1) {
              handlePrevFs();
            }
            setTouchStartX(null);
            setTouchEndX(null);
          };

          return (
            <div 
              className="fixed inset-0 z-[60] bg-black/95 flex items-center justify-center p-2 sm:p-4 animate-fade-in select-none"
              onClick={() => setFullscreenImage(null)}
              onTouchStart={handleFsTouchStart}
              onTouchMove={handleFsTouchMove}
              onTouchEnd={handleFsTouchEnd}
            >
              <button
                type="button"
                onClick={() => setFullscreenImage(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors z-20"
                title="Tutup Fullscreen"
              >
                <span className="material-symbols-outlined text-[24px]">close</span>
              </button>

              {/* Counter Indicator */}
              <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white font-label-sm text-xs z-20">
                {activeModalImageIndex + 1} / {total} {total > 1 ? '• Geser ↔' : ''}
              </div>

              {/* Prev Arrow */}
              {total > 1 && (
                <button
                  type="button"
                  onClick={handlePrevFs}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center transition-all z-20 shadow-lg"
                  title="Foto Sebelumnya"
                >
                  <span className="material-symbols-outlined text-[28px]">chevron_left</span>
                </button>
              )}

              {/* Main Image */}
              <img
                src={fullscreenImage}
                alt="Fullscreen view"
                className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl pointer-events-none"
              />

              {/* Next Arrow */}
              {total > 1 && (
                <button
                  type="button"
                  onClick={handleNextFs}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center transition-all z-20 shadow-lg"
                  title="Foto Selanjutnya"
                >
                  <span className="material-symbols-outlined text-[28px]">chevron_right</span>
                </button>
              )}
            </div>
          );
        })()
      )}
    </div>
  );
};

export default App;
