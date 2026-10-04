import React, { useEffect } from 'react';
import type { Product } from '../data/products';
import { formatRupiah, createBuyWhatsappUrl } from '../utils/whatsapp';
import { X, MessageCircle, MapPin } from 'lucide-react';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({ product, onClose }) => {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (product) {
      document.addEventListener('keydown', onKey);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [product, onClose]);

  if (!product) return null;

  const specs: { label: string; value: React.ReactNode }[] = [
    { label: 'Kondisi', value: product.condition },
    {
      label: 'Battery Health',
      value: product.batteryHealth ? `${product.batteryHealth}%` : '100% (BNIB)',
    },
    { label: 'IMEI', value: product.imeiStatus },
    { label: 'Kelengkapan', value: product.completeness },
    { label: 'Garansi', value: <span className="text-accent">{product.warranty}</span> },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 backdrop-blur-sm animate-fade-in sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        className="relative flex max-h-[92vh] w-full max-w-xl flex-col overflow-hidden rounded-t-xl2 border border-line bg-white shadow-pop animate-fade-up sm:rounded-xl2"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-ink shadow-card backdrop-blur-sm transition-colors hover:bg-white"
          aria-label="Tutup"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="grid overflow-y-auto sm:grid-cols-2">
          {/* Photo */}
          <div className="relative aspect-[4/3] bg-paper sm:aspect-auto sm:min-h-[320px]">
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-cover"
            />
            <div className="absolute left-3 top-3 flex gap-1.5">
              <span className="rounded-md bg-white/90 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-ink backdrop-blur-sm">
                {product.condition.includes('BNIB') ? 'BNIB' : 'Second'}
              </span>
              <span
                className={`rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                  product.isReadyStock ? 'bg-accent text-white' : 'bg-white/90 text-ink'
                }`}
              >
                {product.isReadyStock ? 'Ready' : 'Pre-Order'}
              </span>
            </div>
          </div>

          {/* Details */}
          <div className="flex flex-col justify-between gap-4 p-5 sm:p-6">
            <div>
              <div className="eyebrow">
                {product.series} · {product.storage}
              </div>
              <h3 className="mt-1.5 font-heading text-lg font-bold leading-snug tracking-tight text-ink">
                {product.name}
              </h3>
              <p className="mt-1 font-sans text-xs text-ink-soft">
                Warna <span className="font-medium text-ink">{product.color}</span>
              </p>

              <div className="mt-4 rounded-xl border border-line bg-paper px-4 py-3">
                <div className="font-sans text-[10px] font-medium uppercase tracking-wider text-ink-faint">
                  Harga unit
                </div>
                <div className="mt-0.5 font-heading text-xl font-bold tracking-tight text-ink">
                  {formatRupiah(product.price)}
                </div>
                <div className="mt-0.5 font-sans text-[11px] text-ink-faint">
                  Nego tipis untuk cash / tukar tambah
                </div>
              </div>

              <div className="mt-4 font-sans text-xs">
                {specs.map((s) => (
                  <div
                    key={s.label}
                    className="flex items-baseline justify-between gap-4 border-b border-line/60 py-2 last:border-0"
                  >
                    <span className="shrink-0 text-ink-faint">{s.label}</span>
                    <span className="text-right font-medium text-ink">{s.value}</span>
                  </div>
                ))}
              </div>

              <p className="mt-3 rounded-xl bg-paper p-3 font-sans text-[11px] leading-relaxed text-ink-soft sm:text-xs">
                {product.description}
              </p>
            </div>

            <div className="space-y-2">
              <a
                href={createBuyWhatsappUrl(product)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary w-full py-3 text-xs"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Pesan via WhatsApp</span>
              </a>
              <p className="flex items-center justify-center gap-1.5 font-sans text-[10px] text-ink-faint">
                <MapPin className="h-3 w-3" />
                Ambil langsung di Angantaka No. 26 atau COD
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
