import React, { useState } from 'react';
import { STORE_INFO } from '../data/products';
import type { Product } from '../data/products';
import { formatRupiah } from '../utils/whatsapp';
import { Plus, Pencil, Trash2, Check, X, Store, Package, CircleDot, Phone } from 'lucide-react';

interface DashboardProps {
  products: Product[];
  onUpdateProducts: (products: Product[]) => void;
  onBackToStore: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ products, onUpdateProducts, onBackToStore }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const [tempPrice, setTempPrice] = useState<number>(0);
  const [tempStock, setTempStock] = useState<boolean>(true);

  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: '',
    series: 'iPhone 15',
    modelType: 'Base',
    storage: '128GB',
    condition: 'Second Like New',
    batteryHealth: 90,
    color: 'Hitam',
    price: 10000000,
    isReadyStock: true,
    imeiStatus: 'Resmi iBox / GDN',
    completeness: 'Fullset Dus & Kabel OEM',
    warranty: 'Garansi Toko 3 Bulan + IMEI Permanen',
    image: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=800&q=80',
    description: 'Unit mulus terawat, fungsi normal 100%.',
  });

  const handleStartEdit = (product: Product) => {
    setEditingId(product.id);
    setTempPrice(product.price);
    setTempStock(product.isReadyStock);
  };

  const handleSaveQuickEdit = (id: string) => {
    onUpdateProducts(
      products.map((item) => (item.id === id ? { ...item, price: tempPrice, isReadyStock: tempStock } : item))
    );
    setEditingId(null);
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm('Hapus unit ini dari katalog?')) {
      onUpdateProducts(products.filter((p) => p.id !== id));
    }
  };

  const handleAddProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price) {
      alert('Nama produk dan harga wajib diisi');
      return;
    }

    const created: Product = {
      id: `kg-custom-${Date.now()}`,
      name: newProduct.name,
      series: (newProduct.series as any) || 'iPhone 15',
      modelType: (newProduct.modelType as any) || 'Base',
      storage: newProduct.storage || '128GB',
      condition: (newProduct.condition as any) || 'Second Like New',
      batteryHealth: Number(newProduct.batteryHealth) || 90,
      color: newProduct.color || 'Hitam',
      price: Number(newProduct.price),
      isReadyStock: newProduct.isReadyStock ?? true,
      imeiStatus: (newProduct.imeiStatus as any) || 'Resmi iBox / GDN',
      completeness: (newProduct.completeness as any) || 'Fullset Dus & Kabel OEM',
      warranty: newProduct.warranty || 'Garansi Toko 3 Bulan + IMEI Permanen',
      image:
        newProduct.image ||
        'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=800&q=80',
      description: newProduct.description || 'Unit siap pakai bergaransi toko Kedai Gadget.',
      highlightTag: newProduct.highlightTag || undefined,
    };

    onUpdateProducts([created, ...products]);
    setShowAddModal(false);
  };

  const stats = [
    { icon: Package, label: 'Total unit', value: `${products.length} unit` },
    {
      icon: CircleDot,
      label: 'Ready stock',
      value: `${products.filter((p) => p.isReadyStock).length} unit`,
    },
    { icon: Phone, label: 'WhatsApp aktif', value: STORE_INFO.phoneDisplay },
  ];

  return (
    <div className="min-h-screen bg-paper font-sans">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        {/* Header */}
        <div className="animate-fade-up flex flex-col justify-between gap-4 border-b border-line pb-6 sm:flex-row sm:items-center">
          <div>
            <div className="eyebrow">Panel internal</div>
            <h1 className="mt-1.5 font-heading text-xl font-bold tracking-tight text-ink sm:text-2xl">
              Kelola Katalog
            </h1>
            <p className="mt-0.5 text-xs text-ink-faint">
              Ubah harga & status stok — tersimpan di browser ini (localStorage).
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={() => setShowAddModal(true)} className="btn-primary px-4 py-2 text-xs">
              <Plus className="h-3.5 w-3.5" />
              <span>Tambah Unit</span>
            </button>
            <button onClick={onBackToStore} className="btn-ghost px-4 py-2 text-xs">
              <Store className="h-3.5 w-3.5" />
              <span>Lihat Toko</span>
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="animate-fade-up my-6 grid grid-cols-1 gap-3 sm:grid-cols-3 [animation-delay:80ms]">
          {stats.map((s) => (
            <div key={s.label} className="panel flex items-center gap-4 p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-ink/[0.05]">
                <s.icon className="h-4.5 w-4.5 text-ink" strokeWidth={1.8} />
              </div>
              <div>
                <div className="text-[11px] font-medium uppercase tracking-wider text-ink-faint">
                  {s.label}
                </div>
                <div className="font-heading text-base font-bold tracking-tight text-ink">
                  {s.value}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="panel animate-fade-up overflow-hidden [animation-delay:160ms]">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-ink-soft">
              <thead>
                <tr className="border-b border-line bg-paper/70 text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-faint">
                  <th className="px-4 py-3">Unit</th>
                  <th className="px-4 py-3">Kondisi</th>
                  <th className="px-4 py-3">Harga</th>
                  <th className="px-4 py-3">Stok</th>
                  <th className="px-4 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line/60">
                {products.map((item) => {
                  const isEditing = editingId === item.id;
                  return (
                    <tr key={item.id} className="transition-colors hover:bg-paper/50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-10 w-10 shrink-0 rounded-lg bg-paper object-cover"
                          />
                          <div>
                            <div className="font-heading font-semibold text-ink">{item.name}</div>
                            <div className="text-[11px] text-ink-faint">
                              {item.color} · {item.storage}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <div>{item.condition}</div>
                        <div className="text-[11px] text-ink-faint">
                          {item.batteryHealth ? `BH ${item.batteryHealth}%` : 'BNIB'}
                        </div>
                      </td>

                      <td className="px-4 py-3 font-medium text-ink">
                        {isEditing ? (
                          <input
                            type="number"
                            value={tempPrice}
                            onChange={(e) => setTempPrice(Number(e.target.value))}
                            className="w-32 rounded-lg border border-line bg-white px-2 py-1 font-mono text-xs text-ink focus:border-ink/30 focus:outline-none"
                          />
                        ) : (
                          formatRupiah(item.price)
                        )}
                      </td>

                      <td className="px-4 py-3">
                        {isEditing ? (
                          <label className="flex cursor-pointer items-center gap-2">
                            <input
                              type="checkbox"
                              checked={tempStock}
                              onChange={(e) => setTempStock(e.target.checked)}
                              className="h-4 w-4 rounded border-line accent-[#17181A]"
                            />
                            <span>Ready</span>
                          </label>
                        ) : (
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-medium ${
                              item.isReadyStock
                                ? 'bg-accent/10 text-accent'
                                : 'bg-ink/[0.06] text-ink-faint'
                            }`}
                          >
                            <span
                              className={`h-1 w-1 rounded-full ${
                                item.isReadyStock ? 'bg-accent' : 'bg-ink-faint'
                              }`}
                            />
                            {item.isReadyStock ? 'Ready' : 'Habis'}
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          {isEditing ? (
                            <>
                              <button
                                onClick={() => handleSaveQuickEdit(item.id)}
                                className="flex h-7 w-7 items-center justify-center rounded-lg bg-ink text-paper transition-colors hover:bg-ink/90"
                                title="Simpan"
                              >
                                <Check className="h-3.5 w-3.5" />
                              </button>
                              <button
                                onClick={() => setEditingId(null)}
                                className="flex h-7 w-7 items-center justify-center rounded-lg bg-ink/[0.06] text-ink-soft transition-colors hover:bg-ink/10"
                                title="Batal"
                              >
                                <X className="h-3.5 w-3.5" />
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => handleStartEdit(item)}
                                className="flex h-7 w-7 items-center justify-center rounded-lg text-ink-faint transition-colors hover:bg-ink/[0.06] hover:text-ink"
                                title="Edit harga & stok"
                              >
                                <Pencil className="h-3.5 w-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(item.id)}
                                className="flex h-7 w-7 items-center justify-center rounded-lg text-ink-faint transition-colors hover:bg-red-500/10 hover:text-red-600"
                                title="Hapus"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <p className="mt-4 text-center text-[11px] text-ink-faint">
          Data tersimpan lokal di browser — saat deploy, hubungkan ke backend untuk sinkronasi.
        </p>
      </div>

      {/* Add modal */}
      {showAddModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-ink/40 p-4 backdrop-blur-sm animate-fade-in"
          onClick={() => setShowAddModal(false)}
        >
          <div
            className="my-8 w-full max-w-lg rounded-xl2 border border-line bg-white p-6 shadow-pop animate-fade-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-line pb-4">
              <div>
                <h3 className="font-heading text-base font-bold tracking-tight text-ink">
                  Tambah Unit Baru
                </h3>
                <p className="mt-0.5 font-sans text-xs text-ink-faint">
                  Unit langsung tampil di katalog publik
                </p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-ink-faint transition-colors hover:bg-ink/[0.06] hover:text-ink"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleAddProductSubmit} className="space-y-4 pt-5 font-sans">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-ink-soft">Nama model</label>
                <input
                  type="text"
                  placeholder="Contoh: iPhone 14 Pro 128GB Deep Purple"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  required
                  className="field"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-ink-soft">Seri</label>
                  <select
                    value={newProduct.series}
                    onChange={(e) => setNewProduct({ ...newProduct, series: e.target.value as any })}
                    className="field"
                  >
                    <option value="iPhone 16">iPhone 16</option>
                    <option value="iPhone 15">iPhone 15</option>
                    <option value="iPhone 14">iPhone 14</option>
                    <option value="iPhone 13">iPhone 13</option>
                    <option value="iPhone 12">iPhone 12</option>
                    <option value="iPhone 11">iPhone 11</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-ink-soft">Kapasitas</label>
                  <input
                    type="text"
                    placeholder="128GB"
                    value={newProduct.storage}
                    onChange={(e) => setNewProduct({ ...newProduct, storage: e.target.value })}
                    className="field"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-ink-soft">Harga (Rp)</label>
                  <input
                    type="number"
                    placeholder="12500000"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                    required
                    className="field font-mono"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-ink-soft">
                    Battery Health
                  </label>
                  <input
                    type="number"
                    min={50}
                    max={100}
                    value={newProduct.batteryHealth}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, batteryHealth: Number(e.target.value) })
                    }
                    className="field"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-ink-soft">Kondisi</label>
                  <select
                    value={newProduct.condition}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, condition: e.target.value as any })
                    }
                    className="field"
                  >
                    <option value="Second Like New">Second Like New</option>
                    <option value="Brand New In Box (BNIB)">Brand New In Box (BNIB)</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-ink-soft">Warna</label>
                  <input
                    type="text"
                    placeholder="Midnight / White"
                    value={newProduct.color}
                    onChange={(e) => setNewProduct({ ...newProduct, color: e.target.value })}
                    className="field"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-ink-soft">URL foto</label>
                <input
                  type="text"
                  placeholder="https://…"
                  value={newProduct.image}
                  onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                  className="field"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn-ghost px-4 py-2 text-xs"
                >
                  Batal
                </button>
                <button type="submit" className="btn-primary px-5 py-2 text-xs">
                  <Check className="h-3.5 w-3.5" />
                  <span>Simpan ke Katalog</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
