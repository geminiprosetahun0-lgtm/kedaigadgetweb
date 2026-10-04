import React, { useState, useMemo } from 'react';
import type { Product } from '../data/products';
import { formatRupiah, createBuyWhatsappUrl, createGeneralInquiryUrl } from '../utils/whatsapp';
import { Search, MessageCircle, X, BatteryCharging } from 'lucide-react';

interface CatalogProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
}

export const Catalog: React.FC<CatalogProps> = ({ products, onSelectProduct }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSeries, setSelectedSeries] = useState<string>('All');
  const [selectedCondition, setSelectedCondition] = useState<string>('All');

  const seriesList = ['All', 'iPhone 16', 'iPhone 15', 'iPhone 14', 'iPhone 13', 'iPhone 12', 'iPhone 11'];

  const conditionOptions = [
    { key: 'All', label: 'Semua' },
    { key: 'Second', label: 'Second' },
    { key: 'BNIB', label: 'BNIB' },
  ];

  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      const q = searchQuery.toLowerCase();
      const matchSearch =
        item.name.toLowerCase().includes(q) ||
        item.storage.toLowerCase().includes(q) ||
        item.color.toLowerCase().includes(q);

      const matchSeries = selectedSeries === 'All' || item.series === selectedSeries;
      const matchCondition =
        selectedCondition === 'All' ||
        (selectedCondition === 'BNIB' && item.condition.includes('BNIB')) ||
        (selectedCondition === 'Second' && item.condition.includes('Second'));

      return matchSearch && matchSeries && matchCondition;
    });
  }, [products, searchQuery, selectedSeries, selectedCondition]);

  return (
    <section id="katalog" className="border-b border-line bg-white">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
          <div className="animate-fade-up">
            <div className="eyebrow">Stok tersedia</div>
            <h2 className="mt-2 font-heading text-2xl font-bold tracking-tight text-ink sm:text-3xl">
              Katalog iPhone
            </h2>
            <p className="mt-1.5 max-w-md font-sans text-sm leading-relaxed text-ink-soft">
              Setiap unit lolos QC: baterai, kamera, tombol, hingga legalitas IMEI.
            </p>
          </div>
          <div className="font-sans text-xs text-ink-faint">
            <span className="font-heading text-xl font-bold text-ink">{filteredProducts.length}</span> unit tampil
          </div>
        </div>

        {/* Filter bar */}
        <div className="panel animate-fade-up mb-8 space-y-4 p-4 [animation-delay:80ms] sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" />
              <input
                type="text"
                placeholder="Cari model, kapasitas, atau warna…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="field pl-10"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-faint transition-colors hover:text-ink"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Condition segmented */}
            <div className="flex w-fit items-center gap-0.5 rounded-full border border-line bg-paper p-1">
              {conditionOptions.map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => setSelectedCondition(opt.key)}
                  className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all duration-200 ${
                    selectedCondition === opt.key
                      ? 'bg-ink text-paper shadow-card'
                      : 'text-ink-soft hover:text-ink'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Series pills */}
          <div className="no-scrollbar flex items-center gap-1.5 overflow-x-auto">
            {seriesList.map((series) => (
              <button
                key={series}
                onClick={() => setSelectedSeries(series)}
                className={`whitespace-nowrap rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all duration-200 ${
                  selectedSeries === series
                    ? 'border-ink bg-ink text-paper'
                    : 'border-line bg-white text-ink-soft hover:border-ink/25 hover:text-ink'
                }`}
              >
                {series}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {filteredProducts.length === 0 ? (
          <div className="panel flex flex-col items-center justify-center p-14 text-center">
            <p className="font-heading text-base font-semibold text-ink">
              Tidak ada unit yang cocok
            </p>
            <p className="mt-1.5 max-w-xs font-sans text-xs leading-relaxed text-ink-faint">
              Coba ubah kata kunci atau filter. Atau tanyakan langsung ke admin — bisa dcarikan unit sesuai request.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedSeries('All');
                setSelectedCondition('All');
              }}
              className="btn-soft mt-5"
            >
              Reset filter
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
            {filteredProducts.map((product, idx) => (
              <article
                key={product.id}
                className="group animate-fade-up flex flex-col overflow-hidden rounded-xl2 border border-line bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-ink/20 hover:shadow-lift"
                style={{ animationDelay: `${Math.min(idx, 8) * 60}ms` }}
              >
                {/* Photo */}
                <div
                  className="relative aspect-square cursor-pointer overflow-hidden bg-paper"
                  onClick={() => onSelectProduct(product)}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    loading="lazy"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/15 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                  {/* badges */}
                  <div className="absolute left-2 top-2 flex flex-col items-start gap-1">
                    <span className="rounded-md bg-white/90 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-ink backdrop-blur-sm sm:text-[10px]">
                      {product.condition.includes('BNIB') ? 'BNIB' : 'Second'}
                    </span>
                  </div>
                  <div className="absolute right-2 top-2">
                    <span
                      className={`rounded-md px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide backdrop-blur-sm sm:text-[10px] ${
                        product.isReadyStock
                          ? 'bg-accent/90 text-white'
                          : 'bg-white/90 text-ink'
                      }`}
                    >
                      {product.isReadyStock ? 'Ready' : 'PO'}
                    </span>
                  </div>
                </div>

                {/* Body */}
                <div className="flex flex-1 flex-col justify-between p-3 sm:p-4">
                  <div>
                    <div className="truncate font-sans text-[10px] font-medium uppercase tracking-wider text-ink-faint sm:text-[11px]">
                      {product.color} · {product.storage}
                    </div>
                    <h3
                      className="mt-1 cursor-pointer font-heading text-xs font-semibold tracking-tight text-ink transition-colors hover:text-ink/70 sm:text-sm"
                      onClick={() => onSelectProduct(product)}
                      title={product.name}
                    >
                      {product.name}
                    </h3>

                    <div className="mt-2 flex flex-wrap items-center gap-1">
                      {product.batteryHealth && (
                        <span className="chip !px-2 !py-0.5 text-[10px]">
                          <BatteryCharging className="h-3 w-3 text-accent" />
                          BH {product.batteryHealth}%
                        </span>
                      )}
                      <span className="chip !px-2 !py-0.5 text-[10px]">
                        {product.imeiStatus.includes('iBox') ? 'Resmi' : 'All Provider'}
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 border-t border-line/70 pt-3">
                    <div className="font-heading text-sm font-bold tracking-tight text-ink sm:text-[17px]">
                      {formatRupiah(product.price)}
                    </div>

                    <div className="mt-2.5 grid grid-cols-2 gap-1.5 sm:gap-2">
                      <button
                        onClick={() => onSelectProduct(product)}
                        className="btn-soft !px-2 !py-1.5 text-xs"
                      >
                        Detail
                      </button>
                      <a
                        href={createBuyWhatsappUrl(product)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-primary !px-2 !py-1.5 text-xs"
                      >
                        <MessageCircle className="h-3.5 w-3.5" />
                        <span>Beli WA</span>
                      </a>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Bottom CTA */}
        <div className="mt-10 flex flex-col items-center justify-between gap-4 rounded-xl2 border border-dashed border-line bg-paper/60 px-6 py-5 text-center sm:flex-row sm:text-left">
          <div>
            <div className="font-heading text-sm font-semibold text-ink">
              Tidak menemukan varian yang dicari?
            </div>
            <p className="mt-0.5 font-sans text-xs text-ink-faint">
              Kami bisa carikan unit spesifik sesuai budget dan spek yang kamu mau.
            </p>
          </div>
          <a
            href={createGeneralInquiryUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost shrink-0 text-xs"
          >
            <MessageCircle className="h-3.5 w-3.5 text-accent" />
            Request Unit
          </a>
        </div>
      </div>
    </section>
  );
};
