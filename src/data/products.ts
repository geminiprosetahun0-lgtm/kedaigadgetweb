export interface Product {
  id: string;
  name: string;
  series: 'iPhone 11' | 'iPhone 12' | 'iPhone 13' | 'iPhone 14' | 'iPhone 15' | 'iPhone 16';
  modelType: 'Base' | 'Plus' | 'Pro' | 'Pro Max';
  storage: string;
  condition: 'Second Like New' | 'Brand New In Box (BNIB)';
  batteryHealth?: number; // e.g. 88, 92, 100
  color: string;
  price: number;
  originalPrice?: number;
  isReadyStock: boolean;
  imeiStatus: 'Kemenperin Aktif' | 'Bea Cukai / All Provider' | 'Resmi iBox / GDN';
  completeness: 'Fullset Dus & Kabel OEM' | 'Fullset Dus & Kabel Original' | 'Unit Only';
  warranty: string;
  image: string;
  highlightTag?: string;
  description: string;
}

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'kg-ip15pm-256-nat',
    name: 'iPhone 15 Pro Max 256GB',
    series: 'iPhone 15',
    modelType: 'Pro Max',
    storage: '256GB',
    condition: 'Second Like New',
    batteryHealth: 98,
    color: 'Natural Titanium',
    price: 18450000,
    originalPrice: 19800000,
    isReadyStock: true,
    imeiStatus: 'Resmi iBox / GDN',
    completeness: 'Fullset Dus & Kabel Original',
    warranty: 'Garansi Toko 6 Bulan + IMEI Permanen',
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80',
    highlightTag: 'Best Seller',
    description: 'Unit istimewa mulus 99% tanpa dent. Layar mulus TrueTone aktif, FaceID ngebut, garansi sinyal selamanya anti blokir.'
  },
  {
    id: 'kg-ip15p-128-blue',
    name: 'iPhone 15 Pro 128GB',
    series: 'iPhone 15',
    modelType: 'Pro',
    storage: '128GB',
    condition: 'Second Like New',
    batteryHealth: 94,
    color: 'Blue Titanium',
    price: 15300000,
    originalPrice: 16500000,
    isReadyStock: true,
    imeiStatus: 'Resmi iBox / GDN',
    completeness: 'Fullset Dus & Kabel Original',
    warranty: 'Garansi Toko 3 Bulan + IMEI Permanen',
    image: 'https://images.unsplash.com/photo-1696446701796-da61225697cc?auto=format&fit=crop&w=800&q=80',
    highlightTag: 'Hot Deal',
    description: 'Bodi titanium ringan dan kokoh. Battery health prima, kamera telephoto jernih, all sensor bekerja 100% normal.'
  },
  {
    id: 'kg-ip16pm-256-bnib',
    name: 'iPhone 16 Pro Max 256GB (BNIB)',
    series: 'iPhone 16',
    modelType: 'Pro Max',
    storage: '256GB',
    condition: 'Brand New In Box (BNIB)',
    batteryHealth: 100,
    color: 'Desert Titanium',
    price: 24750000,
    isReadyStock: true,
    imeiStatus: 'Resmi iBox / GDN',
    completeness: 'Fullset Dus & Kabel Original',
    warranty: 'Garansi Resmi Apple 1 Tahun',
    image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=800&q=80',
    highlightTag: 'Unit Baru',
    description: 'Unit 100% segel hijau resmi. Belum aktifasi, bebas klaim service center resmi di seluruh Indonesia.'
  },
  {
    id: 'kg-ip14p-256-deep',
    name: 'iPhone 14 Pro 256GB',
    series: 'iPhone 14',
    modelType: 'Pro',
    storage: '256GB',
    condition: 'Second Like New',
    batteryHealth: 89,
    color: 'Deep Purple',
    price: 13200000,
    originalPrice: 14500000,
    isReadyStock: true,
    imeiStatus: 'Resmi iBox / GDN',
    completeness: 'Fullset Dus & Kabel Original',
    warranty: 'Garansi Toko 3 Bulan + IMEI Permanen',
    image: 'https://images.unsplash.com/photo-1663499482523-1c0c1bae4ce1?auto=format&fit=crop&w=800&q=80',
    highlightTag: 'Favorit',
    description: 'Warna ikonik Deep Purple. Dynamic island berfungsi responsif, bodi bezel stainless steel kinclong terawat.'
  },
  {
    id: 'kg-ip13-128-starlight',
    name: 'iPhone 13 128GB',
    series: 'iPhone 13',
    modelType: 'Base',
    storage: '128GB',
    condition: 'Second Like New',
    batteryHealth: 88,
    color: 'Starlight White',
    price: 8650000,
    originalPrice: 9500000,
    isReadyStock: true,
    imeiStatus: 'Resmi iBox / GDN',
    completeness: 'Fullset Dus & Kabel OEM',
    warranty: 'Garansi Toko 3 Bulan + IMEI Permanen',
    image: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=800&q=80',
    highlightTag: 'Value Choice',
    description: 'Rekomendasi terbaik di kelas 8 jutaan. Performa chip A15 Bionic masih sangat bertenaga untuk gaming dan konten harian.'
  },
  {
    id: 'kg-ip13pm-128-sierra',
    name: 'iPhone 13 Pro Max 128GB',
    series: 'iPhone 13',
    modelType: 'Pro Max',
    storage: '128GB',
    condition: 'Second Like New',
    batteryHealth: 87,
    color: 'Sierra Blue',
    price: 11900000,
    originalPrice: 12800000,
    isReadyStock: true,
    imeiStatus: 'Resmi iBox / GDN',
    completeness: 'Fullset Dus & Kabel OEM',
    warranty: 'Garansi Toko 3 Bulan + IMEI Permanen',
    image: 'https://images.unsplash.com/photo-1632661674596-df8be070a5c5?auto=format&fit=crop&w=800&q=80',
    highlightTag: 'Layar 120Hz',
    description: 'Layar ProMotion 120Hz super smooth dengan baterai badak. Sinyal all-operator aman seumur hidup.'
  },
  {
    id: 'kg-ip12-128-black',
    name: 'iPhone 12 128GB',
    series: 'iPhone 12',
    modelType: 'Base',
    storage: '128GB',
    condition: 'Second Like New',
    batteryHealth: 86,
    color: 'Black',
    price: 6600000,
    originalPrice: 7200000,
    isReadyStock: true,
    imeiStatus: 'Resmi iBox / GDN',
    completeness: 'Fullset Dus & Kabel OEM',
    warranty: 'Garansi Toko 1 Bulan + IMEI Permanen',
    image: 'https://images.unsplash.com/photo-1605236453806-6ff36851218e?auto=format&fit=crop&w=800&q=80',
    highlightTag: 'Termurah',
    description: 'Bentuk flat-edge modern dengan dukungan sinyal 5G. Kondisi fisik 95% mulus, siap pakai jangka panjang.'
  },
  {
    id: 'kg-ip11-128-purple',
    name: 'iPhone 11 128GB',
    series: 'iPhone 11',
    modelType: 'Base',
    storage: '128GB',
    condition: 'Second Like New',
    batteryHealth: 85,
    color: 'Purple Pastel',
    price: 5200000,
    originalPrice: 5800000,
    isReadyStock: false,
    imeiStatus: 'Resmi iBox / GDN',
    completeness: 'Fullset Dus & Kabel OEM',
    warranty: 'Garansi Toko 1 Bulan + IMEI Permanen',
    image: 'https://images.unsplash.com/photo-1574755393849-623942496936?auto=format&fit=crop&w=800&q=80',
    highlightTag: 'Pre-Order / Booking',
    description: 'Favorit pelajar & pemula Apple. Kamera ultra wide jernih, baterai awet, unit mulus siap pakai.'
  }
];

export const STORE_INFO = {
  name: 'Kedai Gadget',
  tagline: 'Jual, Beli, & Tukar Tambah iPhone Bergaransi 24 Jam',
  phoneDisplay: '0897-674-7272',
  whatsappRaw: '08976747272',
  address: 'Jl. Raya Angantaka No.26, Angantaka, Kec. Abiansemal, Kabupaten Badung, Bali',
  shortAddress: 'Jl. Raya Angantaka No. 26',
  operatingHours: '24 Jam Nonstop Setiap Hari',
  instagram: 'kedaigadgett',
  instagramUrl: 'https://www.instagram.com/kedaigadgett',
  mapsEmbedUrl: 'https://maps.google.com/maps?q=Jl.+Raya+Angantaka+No.26,+Badung,+Bali&t=&z=16&ie=UTF8&iwloc=&output=embed',
  mapsDirectionUrl: 'https://maps.google.com/?q=Jl.+Raya+Angantaka+No.26,+Badung,+Bali'
};
