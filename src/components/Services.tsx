import React, { useState } from 'react';
import type { Product } from '../data/products';
import { createTradeInWhatsappUrl, createSellWhatsappUrl } from '../utils/whatsapp';
import { ArrowRight, Send, RefreshCw, Banknote, Check } from 'lucide-react';

interface ServicesProps {
  products: Product[];
}

export const Services: React.FC<ServicesProps> = ({ products }) => {
  const [tradeName, setTradeName] = useState('');
  const [currentModel, setCurrentModel] = useState('iPhone 11');
  const [currentStorage, setCurrentStorage] = useState('128GB');
  const [currentBH, setCurrentBH] = useState('85');
  const [currentCondition, setCurrentCondition] = useState('Mulus 95%, All Normal');
  const [targetUnit, setTargetUnit] = useState(products[0]?.name || 'iPhone 13 128GB');

  const [sellName, setSellName] = useState('');
  const [sellModel, setSellModel] = useState('');
  const [sellStorage, setSellStorage] = useState('128GB');
  const [sellCondition, setSellCondition] = useState('Mulus Fullset Sinyal Aman');
  const [sellCompleteness, setSellCompleteness] = useState('Fullset Box + Kabel');

  const handleTradeInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    window.open(
      createTradeInWhatsappUrl({
        clientName: tradeName,
        currentModel,
        currentStorage,
        currentCondition,
        currentBH,
        targetUnit,
      }),
      '_blank'
    );
  };

  const handleSellSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sellModel) {
      alert('Mohon isi tipe iPhone yang ingin dijual');
      return;
    }
    window.open(
      createSellWhatsappUrl({
        clientName: sellName,
        model: sellModel,
        storage: sellStorage,
        condition: sellCondition,
        completeness: sellCompleteness,
      }),
      '_blank'
    );
  };

  return (
    <section id="layanan" className="border-b border-line bg-paper">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
        {/* Header */}
        <div className="animate-fade-up mb-10 max-w-xl">
          <div className="eyebrow">Layanan</div>
          <h2 className="mt-2 font-heading text-2xl font-bold tracking-tight text-ink sm:text-3xl">
            Upgrade atau butuh dana cepat?
          </h2>
          <p className="mt-1.5 font-sans text-sm leading-relaxed text-ink-soft">
            Tukar tambah ke seri yang lebih baru, atau jual iPhone-mu — dibayar tunai di tempat,
            proses 15 menit.
          </p>
        </div>

        <div className="grid items-start gap-6 md:grid-cols-2">
          {/* Trade-in card */}
          <div
            id="tukar-tambah"
            className="panel animate-fade-up overflow-hidden [animation-delay:80ms]"
          >
            <div className="flex items-center gap-3 border-b border-line px-6 py-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-ink/[0.05]">
                <RefreshCw className="h-4.5 w-4.5 text-ink" strokeWidth={1.8} />
              </div>
              <div>
                <h3 className="font-heading text-base font-bold tracking-tight text-ink">
                  Tukar Tambah
                </h3>
                <p className="font-sans text-xs text-ink-faint">
                  Estimasi HP lamamu dikirim via WhatsApp
                </p>
              </div>
            </div>

            <form onSubmit={handleTradeInSubmit} className="space-y-4 px-6 py-5 font-sans">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-ink-soft">Nama</label>
                <input
                  type="text"
                  placeholder="Nama kamu"
                  value={tradeName}
                  onChange={(e) => setTradeName(e.target.value)}
                  className="field"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-ink-soft">HP lama</label>
                  <select
                    value={currentModel}
                    onChange={(e) => setCurrentModel(e.target.value)}
                    className="field"
                  >
                    <option value="iPhone XR">iPhone XR</option>
                    <option value="iPhone 11">iPhone 11</option>
                    <option value="iPhone 11 Pro">iPhone 11 Pro</option>
                    <option value="iPhone 12">iPhone 12</option>
                    <option value="iPhone 12 Pro">iPhone 12 Pro</option>
                    <option value="iPhone 13">iPhone 13</option>
                    <option value="iPhone 13 Pro">iPhone 13 Pro</option>
                    <option value="iPhone 14 Series">iPhone 14 Series</option>
                    <option value="iPhone 15 Series">iPhone 15 Series</option>
                    <option value="Android Flagship">Android (tanyakan)</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-ink-soft">Kapasitas</label>
                  <select
                    value={currentStorage}
                    onChange={(e) => setCurrentStorage(e.target.value)}
                    className="field"
                  >
                    <option value="64GB">64GB</option>
                    <option value="128GB">128GB</option>
                    <option value="256GB">256GB</option>
                    <option value="512GB">512GB</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-ink-soft">Battery Health</label>
                  <input
                    type="number"
                    min={50}
                    max={100}
                    placeholder="85"
                    value={currentBH}
                    onChange={(e) => setCurrentBH(e.target.value)}
                    className="field"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-ink-soft">Kondisi</label>
                  <select
                    value={currentCondition}
                    onChange={(e) => setCurrentCondition(e.target.value)}
                    className="field"
                  >
                    <option value="Mulus Like New, Fullset">Mulus like new, fullset</option>
                    <option value="Mulus Pemakaian Normal">Pemakaian normal</option>
                    <option value="Ada Lecet Tipis">Ada lecet tipis</option>
                    <option value="Batangan (Unit Saja)">Batangan / unit saja</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-ink-soft">iPhone incaran</label>
                <select
                  value={targetUnit}
                  onChange={(e) => setTargetUnit(e.target.value)}
                  className="field"
                >
                  {products.map((p) => (
                    <option key={p.id} value={`${p.name} (${p.color})`}>
                      {p.name} — {p.color}
                    </option>
                  ))}
                  <option value="Konsultasikan seri lain">Seri lain (tanya admin)</option>
                </select>
              </div>

              <button type="submit" className="btn-primary mt-1 w-full py-3">
                <Send className="h-4 w-4" />
                <span>Kirim Simulasi</span>
              </button>

              <p className="text-center font-sans text-[11px] text-ink-faint">
                Taksiran final tetap setelah cek fisik langsung
              </p>
            </form>
          </div>

          {/* Sell card */}
          <div
            id="jual-hp"
            className="panel animate-fade-up overflow-hidden [animation-delay:160ms]"
          >
            <div className="flex items-center gap-3 border-b border-line px-6 py-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10">
                <Banknote className="h-4.5 w-4.5 text-accent" strokeWidth={1.8} />
              </div>
              <div>
                <h3 className="font-heading text-base font-bold tracking-tight text-ink">
                  Jual iPhone
                </h3>
                <p className="font-sans text-xs text-ink-faint">
                  Tunai di tempat atau transfer, 15 menit
                </p>
              </div>
            </div>

            <form onSubmit={handleSellSubmit} className="space-y-4 px-6 py-5 font-sans">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-ink-soft">Nama</label>
                <input
                  type="text"
                  placeholder="Nama kamu"
                  value={sellName}
                  onChange={(e) => setSellName(e.target.value)}
                  className="field"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-ink-soft">Tipe iPhone</label>
                <input
                  type="text"
                  placeholder="Contoh: iPhone 13 Pro 128GB Graphite"
                  value={sellModel}
                  onChange={(e) => setSellModel(e.target.value)}
                  required
                  className="field"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-ink-soft">Kapasitas</label>
                  <select
                    value={sellStorage}
                    onChange={(e) => setSellStorage(e.target.value)}
                    className="field"
                  >
                    <option value="64GB">64GB</option>
                    <option value="128GB">128GB</option>
                    <option value="256GB">256GB</option>
                    <option value="512GB">512GB</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-ink-soft">Kelengkapan</label>
                  <select
                    value={sellCompleteness}
                    onChange={(e) => setSellCompleteness(e.target.value)}
                    className="field"
                  >
                    <option value="Fullset Original Box">Fullset original</option>
                    <option value="Fullset Box OEM">Fullset box OEM</option>
                    <option value="Unit Only (Batangan)">Batangan / unit saja</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-ink-soft">Kondisi & catatan</label>
                <textarea
                  rows={2}
                  placeholder="BH 88%, Face ID normal, TrueTone aktif…"
                  value={sellCondition}
                  onChange={(e) => setSellCondition(e.target.value)}
                  className="field"
                />
              </div>

              <button type="submit" className="btn-primary mt-1 w-full py-3">
                <ArrowRight className="h-4 w-4" />
                <span>Minta Penawaran</span>
              </button>

              <div className="flex items-center justify-center gap-2 pt-1 font-sans text-[11px] text-ink-faint">
                <Check className="h-3 w-3 text-accent" />
                <span>Harga tawaran kami di antara yang terbaik di Angantaka</span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
