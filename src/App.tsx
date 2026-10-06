import React, { useState, useMemo, useEffect } from 'react';
import { sanitizeInput, sanitizePhone, hashPin, constantTimeCompare, ClientRateLimiter } from './utils/security';
import { usePresence, useReveal, useScrollProgress } from './motion';

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
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback if corrupted
    }
    return PRODUCTS;
  });

  const [isCatalogDemo, setIsCatalogDemo] = useState(true);

  // Fetch real-time products from API server if running
  useEffect(() => {
    const fetchApiProducts = async () => {
      try {
        const res = await fetch('/api/products');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            setIsCatalogDemo(data.length === 0);
            setProducts(data.length ? data : PRODUCTS);
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
    if (isCatalogDemo) return;
    try {
      localStorage.setItem('kg_vault_stock', JSON.stringify(products));
    } catch {
      // storage quota exception guard
    }
  }, [products, isCatalogDemo]);

  const [activeCondition, setActiveCondition] = useState<'all' | 'second' | 'bnib'>('all');
  const [activeSeries, setActiveSeries] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [activeModalImageIndex, setActiveModalImageIndex] = useState<number>(0);
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);
  const [isFsOpen, setIsFsOpen] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);

  // Service Estimation Modals
  const [estimasiOpen, setEstimasiOpen] = useState(false);
  const [estimasiMode, setEstimasiMode] = useState<'trade' | 'sell'>('trade');

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

  // ---- Motion ----
  const estimasiModal = usePresence(estimasiOpen, 340);
  const detailModal = usePresence(isDetailOpen, 340);
  const adminModal = usePresence(isAdminOpen, 340);
  const fsModal = usePresence(isFsOpen, 280);
  const { progress: scrollProgress, scrolled } = useScrollProgress();
  useReveal([filteredProducts]);

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
    window.open(`https://wa.me/628976747272?text=${text}`, '_blank', 'noopener,noreferrer');
    setEstimasiOpen(false);
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
    window.open(`https://wa.me/628976747272?text=${text}`, '_blank', 'noopener,noreferrer');
    setEstimasiOpen(false);
  };

  return (
    <div className="bg-surface font-body-md text-on-surface antialiased selection:bg-secondary-container selection:text-on-secondary-fixed">
      {/* HEADER */}
      <header className="sticky top-0 w-full z-50">
        <div className={`relative bg-surface/90 backdrop-blur-xl border-b border-outline-variant/40 transition-shadow duration-300 ${scrolled ? 'shadow-md' : 'shadow-sm'}`}>
          <div className="h-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-margin flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 sm:gap-space-lg min-w-0">
              <a className="flex items-center gap-2 sm:gap-space-md group min-w-0" href="#">
                <img alt="Kedai Gadget Brand Logo" className="h-8 sm:h-10 w-auto object-contain shrink-0 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110 group-hover:-rotate-3" src="/logo.png" />
                <div className="flex flex-col min-w-0">
                  <span className="font-headline-sm text-sm sm:text-headline-sm tracking-tight text-primary font-bold truncate">KEDAI GADGET</span>
                </div>
              </a>
            </div>
            <nav className="hidden lg:flex items-center gap-space-lg">
              <a className="kg-nav-link font-label-md text-label-md py-space-xs text-on-surface-variant hover:text-on-surface transition-colors" href="#katalog">Katalog</a>
              <a className="kg-nav-link font-label-md text-label-md py-space-xs text-on-surface-variant hover:text-on-surface transition-colors" href="#tukar-tambah">Tukar Tambah</a>
              <a className="kg-nav-link font-label-md text-label-md py-space-xs text-on-surface-variant hover:text-on-surface transition-colors" href="#jual-iphone">Jual iPhone</a>
              <a className="kg-nav-link font-label-md text-label-md py-space-xs text-on-surface-variant hover:text-on-surface transition-colors" href="#keunggulan">Keunggulan</a>
            </nav>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setIsAdminOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-space-md sm:py-space-xs rounded bg-surface-container-low border border-outline-variant/60 font-label-sm text-[11px] sm:text-label-sm text-on-surface hover:bg-surface-container hover:text-on-surface transition-all hover:-translate-y-0.5 active:scale-95"
                title="Kelola Inventaris & Stok"
              >
                <span className="material-symbols-outlined text-[16px] sm:text-[18px]">inventory_2</span>
                <span className="hidden xs:inline">Kelola</span> Stok
              </button>
            </div>
          </div>
          {/* Scroll progress bar */}
          <div
            aria-hidden="true"
            className="absolute left-0 bottom-0 h-[2px] w-full bg-secondary origin-left transition-transform duration-150 ease-linear"
            style={{ transform: `scaleX(${scrollProgress})` }}
          />
        </div>
      </header>

      {/* MAIN BODY */}
      <main className="w-full bg-surface min-h-[calc(100vh-200px)]">
        <div className="flex flex-col w-full">
          {/* Subtle Grain & Dot Atmosphere */}
          <div className="w-full relative overflow-hidden bg-surface">
            <div className="absolute inset-0 pointer-events-none opacity-40 [background-image:radial-gradient(#c6c6ca_1px,transparent_1px)] [background-size:24px_24px]"></div>

            {/* 1. HERO SECTION (MINIMALIST & DIRECT) */}
            <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-margin py-8 sm:py-12">
              <div className="max-w-3xl space-y-4">
                <div
                  className="kg-fade-up inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-secondary-container/40 text-on-secondary-container font-label-sm text-xs font-semibold"
                  style={{ '--kg-delay': '40ms' } as React.CSSProperties}
                >
                  <span className="kg-badge-dot inline-block w-1.5 h-1.5 rounded-full bg-secondary"></span>
                  Kedai Gadget • Penatih, Denpasar Timur
                </div>
                <h1 className="font-display-lg text-3xl sm:text-4xl lg:text-5xl font-bold text-primary tracking-tight leading-tight">
                  {['Katalog', 'Kedai', 'Gadget'].map((word, i) => (
                    <React.Fragment key={word}>
                      {i > 0 && ' '}
                      <span className="inline-block overflow-hidden align-bottom">
                        <span
                          className="kg-hero-word inline-block"
                          style={{ '--kg-delay': `${140 + i * 90}ms` } as React.CSSProperties}
                        >
                          {word}
                        </span>
                      </span>
                    </React.Fragment>
                  ))}
                </h1>
                <p
                  className="kg-fade-up font-body-lg text-sm sm:text-base text-on-surface-variant max-w-xl leading-relaxed"
                  style={{ '--kg-delay': '460ms' } as React.CSSProperties}
                >
                  Unit Berkualitas Sudah Lolos Quality Control
                </p>
                <div
                  className="kg-fade-up flex flex-wrap items-center gap-3 pt-2"
                  style={{ '--kg-delay': '560ms' } as React.CSSProperties}
                >
                  <a className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded bg-primary text-on-primary font-label-md text-xs sm:text-sm hover:bg-primary-container transition-all shadow-sm" href="#katalog">
                    <span className="material-symbols-outlined text-[18px]">devices</span>
                    Pilih Unit
                  </a>
                  <a className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded bg-surface-container-lowest text-on-surface font-label-md text-xs sm:text-sm hover:bg-surface-container transition-all border border-outline-variant/40" href="#tukar-tambah">
                    <span className="material-symbols-outlined text-[18px] text-secondary">swap_horiz</span>
                    Tukar Tambah / Jual
                  </a>
                </div>
              </div>
            </section>
          </div>

          {/* 2. CATALOG SECTION */}
          <section className="w-full bg-surface-container-lowest py-8 sm:py-space-xl" id="katalog">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-margin space-y-5 sm:space-y-space-lg">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 sm:gap-space-md">
                <div className="kg-reveal">
                  <h2 className="font-headline-lg text-2xl sm:text-headline-lg font-bold text-primary tracking-tight">Kedai Katalog</h2>
                   <p className="font-body-md text-xs sm:text-body-md text-on-surface-variant">{isCatalogDemo ? 'Contoh tampilan katalog. Stok dan harga perlu dikonfirmasi sebelum transaksi.' : 'Pembaruan stok harian. Foto unit, harga dan kondisi ditampilkan transparan.'}</p>
                </div>
                <div className="w-full md:w-80">
                  <div className="relative flex items-center">
                    <span className="material-symbols-outlined absolute left-3 text-outline text-[20px]">search</span>
                    <input
                      className="w-full pl-10 pr-4 py-2 sm:py-2.5 rounded bg-surface-container-low text-primary placeholder:text-outline font-body-sm text-xs sm:text-body-sm focus:outline-none focus:bg-surface-container-lowest focus:ring-1 focus:ring-secondary/50 shadow-sm transition-all"
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
                    className={`px-3 py-1.5 sm:px-space-md sm:py-1.5 rounded-full font-label-md text-xs sm:text-label-md transition-all active:scale-95 ${
                      activeCondition === 'all'
                        ? 'bg-primary text-on-primary shadow-sm'
                        : 'bg-surface-container-high text-on-surface-variant hover:text-primary'
                    }`}
                  >
                    Semua Unit
                  </button>
                  <button
                    onClick={() => setActiveCondition('second')}
                    className={`px-3 py-1.5 sm:px-space-md sm:py-1.5 rounded-full font-label-md text-xs sm:text-label-md transition-all active:scale-95 ${
                      activeCondition === 'second'
                        ? 'bg-primary text-on-primary shadow-sm'
                        : 'bg-surface-container-high text-on-surface-variant hover:text-primary'
                    }`}
                  >
                    Second Like New
                  </button>
                  <button
                    onClick={() => setActiveCondition('bnib')}
                    className={`px-3 py-1.5 sm:px-space-md sm:py-1.5 rounded-full font-label-md text-xs sm:text-label-md transition-all active:scale-95 ${
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
                      className={`px-3 py-1 rounded font-label-sm text-xs sm:text-label-sm transition-all active:scale-95 ${
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

               {isCatalogDemo && <p role="status" className="rounded bg-surface-container-low px-4 py-3 text-xs text-on-surface-variant">Belum ada stok aktif. Unit di bawah hanya contoh katalog, bukan penawaran barang tersedia.</p>}
               {/* Product Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-space-lg pt-2">
                {filteredProducts.map((p) => (
                  <div
                    key={p.id}
                    className="kg-reveal product-card group bg-surface-container-lowest rounded-xl p-4 sm:p-space-md shadow-md flex flex-col justify-between hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 border border-outline-variant/30"
                  >
                    <div>
                      <div className="relative w-full aspect-square bg-surface-container-low rounded-lg overflow-hidden flex items-center justify-center">
                        <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-surface-container-lowest/90 backdrop-blur-sm text-primary font-label-sm text-[10px] sm:text-label-sm font-semibold shadow-sm">
                           {isCatalogDemo ? 'Contoh Unit' : p.gradeBadge}
                        </span>
                        <span className="absolute top-2 right-2 inline-flex items-center gap-1 px-2 py-0.5 rounded bg-secondary-container/80 backdrop-blur-sm text-secondary font-label-sm text-[10px] sm:text-label-sm font-bold">
                           <span className="text-[7px]">●</span> {isCatalogDemo ? 'Stok belum tersedia' : p.statusText}
                        </span>
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
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
                       <div className={`grid gap-2 ${isCatalogDemo ? '' : 'grid-cols-2'}`}>
                        <button
                          onClick={() => { setSelectedProduct(p); setActiveModalImageIndex(0); setIsDetailOpen(true); }}
                          className="py-2 px-2.5 rounded bg-surface-container-high text-primary font-label-sm text-xs sm:text-label-sm font-semibold hover:bg-surface-dim transition-all text-center"
                        >
                           Lihat Detail
                        </button>
                         {!isCatalogDemo && <a
                          className="py-2 px-2.5 rounded bg-primary text-on-primary font-label-sm text-xs sm:text-label-sm font-semibold hover:bg-primary-container transition-all flex items-center justify-center gap-1"
                          href={createProductWaUrl(p)}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Beli via WA
                         </a>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Request Banner */}
              <div className="kg-reveal p-4 sm:p-space-lg rounded-xl bg-surface-container-low flex flex-col md:flex-row items-start md:items-center justify-between gap-3 sm:gap-space-md border border-outline-variant/30">
                <div className="space-y-0.5">
                  <p className="font-headline-sm text-sm sm:text-headline-sm font-bold text-primary">Tidak menemukan varian atau warna yang dicari?</p>
                  <p className="font-body-md text-xs sm:text-body-md text-on-surface-variant">Hubungi kami via WhatsApp untuk mencari unit terkurasi yang sudah lolos quality control.</p>
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
          <section className="w-full bg-surface py-10 sm:py-16" id="tukar-tambah">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-margin space-y-8">
              <div className="kg-reveal text-center max-w-xl mx-auto space-y-1">
                <span className="font-label-sm text-xs uppercase tracking-widest text-secondary font-semibold">Layanan Cepat</span>
                <h2 className="font-headline-lg text-2xl sm:text-3xl font-bold text-primary tracking-tight">Tukar Tambah &amp; Jual iPhone</h2>
                <p className="font-body-md text-xs sm:text-sm text-on-surface-variant">Taksiran jujur berbasis kondisi riil. Cek fisik 15 menit langsung beres.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 max-w-4xl mx-auto">
                {/* TEASER CARD: TUKAR TAMBAH */}
                <div className="kg-reveal group bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant/30 flex flex-col justify-between hover:border-primary/40 hover:-translate-y-1.5 hover:shadow-lg transition-colors">
                  <div className="space-y-3">
                    <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-primary transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110 group-hover:-rotate-6">
                      <span className="material-symbols-outlined text-[22px]">swap_horiz</span>
                    </div>
                    <div>
                      <h3 className="font-headline-sm text-lg font-bold text-primary">Tukar Tambah</h3>
                      <p className="font-body-sm text-xs text-on-surface-variant mt-1 leading-relaxed">
                        Tukarkan iPhone lama Anda ke unit lebih baru dengan selisih harga terbaik dan bantuan pindah data.
                      </p>
                    </div>
                  </div>
                  <div className="pt-5 mt-4 border-t border-surface-container">
                    <button
                      onClick={() => { setEstimasiMode('trade'); setEstimasiOpen(true); }}
                      className="w-full py-2.5 px-4 rounded bg-primary text-on-primary font-label-md text-xs sm:text-sm hover:bg-primary-container transition-all flex items-center justify-center gap-2 active:scale-[0.97]"
                    >
                      <span className="material-symbols-outlined text-[16px]">calculate</span>
                      Mulai Estimasi Tukar Tambah
                    </button>
                  </div>
                </div>

                {/* TEASER CARD: JUAL IPHONE */}
                <div className="kg-reveal group bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant/30 flex flex-col justify-between hover:border-primary/40 hover:-translate-y-1.5 hover:shadow-lg transition-colors" id="jual-iphone">
                  <div className="space-y-3">
                    <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-primary transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110 group-hover:rotate-6">
                      <span className="material-symbols-outlined text-[22px]">payments</span>
                    </div>
                    <div>
                      <h3 className="font-headline-sm text-lg font-bold text-primary">Jual iPhone</h3>
                      <p className="font-body-sm text-xs text-on-surface-variant mt-1 leading-relaxed">
                        Jual cepat tanpa nego berbelit. Terima unit iBox maupun Bea Cukai, pembayaran tunai atau transfer instan.
                      </p>
                    </div>
                  </div>
                  <div className="pt-5 mt-4 border-t border-surface-container">
                    <button
                      onClick={() => { setEstimasiMode('sell'); setEstimasiOpen(true); }}
                      className="w-full py-2.5 px-4 rounded bg-primary text-on-primary font-label-md text-xs sm:text-sm hover:bg-primary-container transition-all flex items-center justify-center gap-2 active:scale-[0.97]"
                    >
                      <span className="material-symbols-outlined text-[16px]">monetization_on</span>
                      Mulai Estimasi Jual iPhone
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 4. VALUE PROPOSITION: KEUNGGULAN LAYANAN */}
          <section className="w-full bg-surface-container-lowest py-10 sm:py-16 border-t border-outline-variant/30" id="keunggulan">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-margin space-y-8">
              <div className="kg-reveal text-center max-w-xl mx-auto space-y-1">
                <span className="font-label-sm text-xs uppercase tracking-widest text-secondary font-semibold">Standar Pelayanan</span>
                <h2 className="font-headline-lg text-2xl sm:text-3xl font-bold text-primary tracking-tight">Keunggulan Layanan</h2>
                <p className="font-body-md text-xs sm:text-sm text-on-surface-variant">Jaminan keamanan dan transparansi belanja di Kedai Gadget.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
                <div className="kg-reveal group p-5 rounded-xl bg-surface border border-outline-variant/30 space-y-2 hover:-translate-y-1.5 hover:shadow-md transition-all">
                  <span className="material-symbols-outlined text-[24px] text-primary inline-block transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1">schedule</span>
                  <h3 className="font-headline-sm text-sm font-bold text-primary">Buka 24 Jam</h3>
                  <p className="font-body-sm text-xs text-on-surface-variant leading-relaxed">
                    Konsultasi dan jadwal COD fleksibel kapan pun di seluruh wilayah Bali.
                  </p>
                </div>

                <div className="kg-reveal group p-5 rounded-xl bg-surface border border-outline-variant/30 space-y-2 hover:-translate-y-1.5 hover:shadow-md transition-all">
                  <span className="material-symbols-outlined text-[24px] text-secondary inline-block transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1">verified</span>
                  <h3 className="font-headline-sm text-sm font-bold text-primary">Lolos QC</h3>
                  <p className="font-body-sm text-xs text-on-surface-variant leading-relaxed">
                    Uji menyeluruh layar, kamera, TrueTone, Face ID, dan kesehatan baterai.
                  </p>
                </div>

                <div className="kg-reveal group p-5 rounded-xl bg-surface border border-outline-variant/30 space-y-2 hover:-translate-y-1.5 hover:shadow-md transition-all">
                  <span className="material-symbols-outlined text-[24px] text-primary inline-block transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1">signal_cellular_alt</span>
                  <h3 className="font-headline-sm text-sm font-bold text-primary">Sinyal Permanen</h3>
                  <p className="font-body-sm text-xs text-on-surface-variant leading-relaxed">
                    Garansi sinyal permanen khusus unit resmi iBox dan Bea Cukai; tidak berlaku untuk Inter All Operator.
                  </p>
                </div>

                <div className="kg-reveal group p-5 rounded-xl bg-surface border border-outline-variant/30 space-y-2 hover:-translate-y-1.5 hover:shadow-md transition-all">
                  <span className="material-symbols-outlined text-[24px] text-primary inline-block transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1">local_shipping</span>
                  <h3 className="font-headline-sm text-sm font-bold text-primary">COD Seluruh Bali</h3>
                  <p className="font-body-sm text-xs text-on-surface-variant leading-relaxed">
                    Cek fisik dan fungsi sepuasnya di tempat sebelum melakukan pembayaran.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* 5. LOCATION STRIP */}
          <section className="w-full bg-surface py-8 border-t border-outline-variant/30" id="lokasi">
            <div className="kg-reveal max-w-4xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
              <div>
                <p className="font-headline-sm text-sm font-bold text-primary">Basis Operasional: Penatih, Denpasar Timur</p>
                <p className="font-body-sm text-xs text-on-surface-variant mt-0.5">Sistem Online &amp; Cash on Delivery (COD) langsung se-Bali.</p>
              </div>
              <a
                href="https://wa.me/628976747272"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded bg-surface-container-high text-primary font-label-md text-xs hover:bg-surface-dim transition-colors"
              >
                <span className="material-symbols-outlined text-[16px]">chat</span>
                Jadwalkan COD via WhatsApp
              </a>
            </div>
          </section>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="w-full bg-surface-container-lowest border-t border-outline-variant/30 py-8">
        <div className="kg-reveal max-w-7xl mx-auto px-4 sm:px-6 lg:px-margin flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-on-surface-variant">
          <div className="flex items-center gap-2">
            <img alt="Kedai Gadget" className="h-6 w-auto object-contain" src="/logo.png" />
            <span className="font-bold text-primary">KEDAI GADGET</span>
            <span className="text-outline/40">•</span>
            <span>Penatih, Denpasar Timur, Bali</span>
          </div>
          <div className="flex items-center gap-5">
            <a href="#katalog" className="hover:text-primary transition-colors">Katalog</a>
            <a href="#tukar-tambah" className="hover:text-primary transition-colors">Tukar Tambah</a>
            <a href="#keunggulan" className="hover:text-primary transition-colors">Keunggulan</a>
            <a href="https://www.instagram.com/kedaigadgett" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">@kedaigadgett</a>
          </div>
          <p>© {new Date().getFullYear()} Kedai Gadget. All rights reserved.</p>
        </div>
      </footer>

      {/* FLOATING WHATSAPP BUTTON */}
      <div className="kg-fab fixed bottom-5 right-4 sm:bottom-6 sm:right-6 z-40">
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
           <span className="material-symbols-outlined text-[22px]" aria-hidden="true">chat</span>
           <span className="sr-only">Chat WhatsApp Kedai Gadget</span>
        </a>
      </div>

      {/* ESTIMASI LAYANAN */}
      {estimasiModal.visible && (
        <div
          className={`kg-modal-overlay fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-primary/60 p-0 sm:p-4 ${estimasiModal.phase === 'open' ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setEstimasiOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="estimasi-title"
            className={`kg-modal-panel bg-surface-container-lowest rounded-t-xl sm:rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-5 sm:p-7 shadow-2xl ${estimasiModal.phase === 'open' ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-[0.96] sm:translate-y-0'}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3 mb-5">
              <div>
                <p className="font-label-sm text-xs uppercase tracking-widest text-secondary mb-1">Estimasi via WhatsApp</p>
                <h2 id="estimasi-title" className="font-headline-sm text-xl font-bold text-primary">{estimasiMode === 'trade' ? 'Tukar Tambah iPhone' : 'Jual iPhone'}</h2>
                <p className="font-body-sm text-xs text-on-surface-variant mt-1">Isi detail unit. Penawaran final setelah cek fisik.</p>
              </div>
              <button type="button" className="w-9 h-9 shrink-0 rounded-full bg-surface-container-high hover:bg-surface-dim hover:rotate-90 flex items-center justify-center transition-all duration-300" aria-label="Tutup estimasi" onClick={() => setEstimasiOpen(false)}>
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            {estimasiMode === 'trade' ? (
              <form className="space-y-3.5" onSubmit={handleTradeIn}>
                <div className="grid grid-cols-2 gap-3">
                  <label className="block text-xs font-medium text-on-surface-variant">iPhone Saat Ini
                    <input required maxLength={40} className="mt-1 w-full p-2.5 rounded bg-surface-container-low text-primary" value={tradeForm.curr} onChange={(e) => setTradeForm({ ...tradeForm, curr: e.target.value })} />
                  </label>
                  <label className="block text-xs font-medium text-on-surface-variant">Kapasitas
                    <select className="mt-1 w-full p-2.5 rounded bg-surface-container-low text-primary" value={tradeForm.storage} onChange={(e) => setTradeForm({ ...tradeForm, storage: e.target.value })}>
                      {['64 GB', '128 GB', '256 GB', '512 GB', '1 TB'].map((value) => <option key={value}>{value}</option>)}
                    </select>
                  </label>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <label className="block text-xs font-medium text-on-surface-variant">Battery Health (%)
                    <input required type="number" min="1" max="100" className="mt-1 w-full p-2.5 rounded bg-surface-container-low text-primary" value={tradeForm.bh.replace('%', '')} onChange={(e) => setTradeForm({ ...tradeForm, bh: e.target.value ? `${e.target.value}%` : '' })} />
                  </label>
                  <label className="block text-xs font-medium text-on-surface-variant">Kondisi Fisik
                    <select className="mt-1 w-full p-2.5 rounded bg-surface-container-low text-primary" value={tradeForm.condition} onChange={(e) => setTradeForm({ ...tradeForm, condition: e.target.value })}>
                      <option>Mulus 99% • Fullset Box</option>
                      <option>Mulus 95% • Batangan Unit Only</option>
                      <option>Ada Dent Kecil • Fullset</option>
                    </select>
                  </label>
                </div>
                <label className="block text-xs font-medium text-on-surface-variant">Target Upgrade
                  <select className="mt-1 w-full p-2.5 rounded bg-surface-container-low text-primary" value={tradeForm.target} onChange={(e) => setTradeForm({ ...tradeForm, target: e.target.value })}>
                    <option value="iPhone 15 Pro Max 256GB">iPhone 15 Pro Max 256GB</option>
                    {!isCatalogDemo && products.filter((p) => p.isReady).map((p) => <option key={p.id} value={`${p.name} ${p.storage} (${p.color})`}>{p.name} {p.storage} · {p.color}</option>)}
                    <option value="Seri lain (konsultasi)">Seri lain (konsultasi)</option>
                  </select>
                </label>
                <button type="submit" className="w-full py-3 rounded bg-primary text-on-primary font-label-md text-sm hover:bg-primary-container transition-all active:scale-[0.98]">Ajukan Estimasi via WhatsApp</button>
              </form>
            ) : (
              <form className="space-y-3.5" onSubmit={handleSell}>
                <label className="block text-xs font-medium text-on-surface-variant">Model &amp; Seri
                  <input required maxLength={60} placeholder="Contoh: iPhone 13 Pro 256GB" className="mt-1 w-full p-2.5 rounded bg-surface-container-low text-primary" value={sellForm.model} onChange={(e) => setSellForm({ ...sellForm, model: e.target.value })} />
                </label>
                <label className="block text-xs font-medium text-on-surface-variant">Status Garansi Asal
                  <select className="mt-1 w-full p-2.5 rounded bg-surface-container-low text-primary" value={sellForm.origin} onChange={(e) => setSellForm({ ...sellForm, origin: e.target.value })}>
                    <option>Resmi iBox / Digimap (PA/A, ID/A)</option>
                    <option>Inter All Provider Terdaftar Bea Cukai</option>
                    <option>Lainnya</option>
                  </select>
                </label>
                <label className="block text-xs font-medium text-on-surface-variant">Kondisi &amp; Minus (Jika Ada)
                  <textarea maxLength={180} rows={2} placeholder="BH, fungsi Face ID, lecet, kelengkapan..." className="mt-1 w-full p-2.5 rounded bg-surface-container-low text-primary" value={sellForm.desc} onChange={(e) => setSellForm({ ...sellForm, desc: e.target.value })} />
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className="block text-xs font-medium text-on-surface-variant">Metode Pencairan
                    <select className="mt-1 w-full p-2.5 rounded bg-surface-container-low text-primary" value={sellForm.method} onChange={(e) => setSellForm({ ...sellForm, method: e.target.value })}>
                      <option>Transfer Bank Instan (BCA / Mandiri / BRI)</option>
                      <option>Tunai / Cash di Toko</option>
                    </select>
                  </label>
                  <label className="block text-xs font-medium text-on-surface-variant">Nomor WhatsApp Anda
                    <input required type="tel" inputMode="tel" maxLength={16} placeholder="08xxxxxxxxxx" className="mt-1 w-full p-2.5 rounded bg-surface-container-low text-primary" value={sellForm.phone} onChange={(e) => setSellForm({ ...sellForm, phone: e.target.value })} />
                  </label>
                </div>
                <button type="submit" className="w-full py-3 rounded bg-primary text-on-primary font-label-md text-sm hover:bg-primary-container transition-all active:scale-[0.98]">Minta Penawaran via WhatsApp</button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* DETAIL MODAL */}
      {detailModal.visible && selectedProduct && (
        <div className={`kg-modal-overlay fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-primary/50 backdrop-blur-sm ${detailModal.phase === 'open' ? 'opacity-100' : 'opacity-0'}`}>
          <div className={`kg-modal-panel bg-surface-container-lowest rounded-t-2xl sm:rounded-xl max-w-2xl w-full p-4 sm:p-space-lg shadow-2xl relative max-h-[90vh] overflow-y-auto space-y-4 border border-outline-variant/40 ${detailModal.phase === 'open' ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-[0.96] sm:translate-y-0'}`}>
            <button
              className="absolute top-3 right-3 sm:top-4 sm:right-4 w-8 h-8 rounded-full bg-surface-container-high hover:bg-surface-dim hover:rotate-90 flex items-center justify-center text-primary transition-all duration-300 z-10"
              onClick={() => {
                setIsDetailOpen(false);
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
                    onClick={() => { setFullscreenImage(currentImg); setIsFsOpen(true); }}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    className="relative w-full aspect-[4/3] sm:aspect-[16/10] bg-surface-container-low rounded-xl overflow-hidden flex items-center justify-center border border-outline-variant/30 cursor-zoom-in group select-none"
                    title="Klik untuk melihat foto fullscreen atau geser kanan/kiri"
                  >
                    <img
                      src={currentImg}
                      alt={selectedProduct.name}
                      className="w-full h-full object-cover object-center group-hover:scale-[1.02] transition-transform duration-300 pointer-events-none"
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

            {!isCatalogDemo && <div className="pt-2">
              <a
                className="w-full py-3 px-4 rounded bg-primary text-on-primary font-label-md text-xs sm:text-label-md hover:bg-primary-container transition-all flex items-center justify-center gap-2 shadow-md active:scale-[0.99] text-center"
                href={createDetailModalWaUrl(selectedProduct)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="material-symbols-outlined text-[18px]">chat</span>
                Konfirmasi &amp; Ambil Unit via WhatsApp
              </a>
            </div>}
          </div>
        </div>
      )}

      {/* SECURITY VAULT & STOCK MANAGEMENT MODAL */}
      {adminModal.visible && (
        <div className={`kg-modal-overlay fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-primary/60 backdrop-blur-md ${adminModal.phase === 'open' ? 'opacity-100' : 'opacity-0'}`}>
          <div className={`kg-modal-panel bg-surface-container-lowest rounded-t-2xl sm:rounded-xl max-w-2xl w-full p-5 sm:p-space-lg shadow-2xl relative max-h-[85vh] sm:max-h-[92vh] overflow-y-auto space-y-4 sm:space-y-space-md border border-outline-variant/60 ${adminModal.phase === 'open' ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-[0.96] sm:translate-y-0'}`}>
            <button
              className="absolute top-3 right-3 sm:top-4 sm:right-4 w-8 h-8 rounded-full bg-surface-container-high hover:bg-surface-dim hover:rotate-90 flex items-center justify-center text-primary transition-all duration-300 z-10"
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
      {fsModal.visible && fullscreenImage && selectedProduct && (
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
              className={`kg-modal-overlay fixed inset-0 z-[60] bg-black/95 flex items-center justify-center p-2 sm:p-4 select-none ${fsModal.phase === 'open' ? 'opacity-100' : 'opacity-0'}`}
              onClick={() => setIsFsOpen(false)}
              onTouchStart={handleFsTouchStart}
              onTouchMove={handleFsTouchMove}
              onTouchEnd={handleFsTouchEnd}
            >
              <button
                type="button"
                onClick={() => setIsFsOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/40 hover:rotate-90 text-white transition-all duration-300 z-20"
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
                className={`max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl pointer-events-none transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${fsModal.phase === 'open' ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
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
