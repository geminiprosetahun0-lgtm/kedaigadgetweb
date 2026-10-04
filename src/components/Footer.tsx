import React from 'react';
import { STORE_INFO } from '../data/products';
import { createGeneralInquiryUrl } from '../utils/whatsapp';
import { ShieldCheck, MapPin, Phone } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white font-sans text-ink-soft">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Big brand statement */}
        <div className="flex flex-col gap-6 border-b border-line py-10 sm:flex-row sm:items-center sm:justify-between sm:py-12">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-ink text-paper">
              <ShieldCheck className="h-5 w-5" strokeWidth={2.2} />
            </div>
            <div>
              <div className="font-heading text-lg font-bold tracking-tight text-ink">
                {STORE_INFO.name}
              </div>
              <div className="text-xs text-ink-faint">
                iPhone specialist sejak hari pertama — Angantaka, Badung
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-medium">
            <a href="#katalog" className="transition-colors hover:text-ink">
              Katalog
            </a>
            <a href="#tukar-tambah" className="transition-colors hover:text-ink">
              Tukar Tambah
            </a>
            <a href="#jual-hp" className="transition-colors hover:text-ink">
              Jual iPhone
            </a>
            <a
              href={STORE_INFO.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-ink"
            >
              Instagram
            </a>
          </div>
        </div>

        {/* Meta info */}
        <div className="grid gap-6 py-8 text-xs sm:grid-cols-3 sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-ink-faint" />
            <span>Jl. Raya Angantaka No. 26, Badung, Bali</span>
          </div>
          <div className="flex items-center gap-2 sm:justify-center">
            <Phone className="h-3.5 w-3.5 shrink-0 text-ink-faint" />
            <a
              href={createGeneralInquiryUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-ink transition-colors hover:text-ink/70"
            >
              {STORE_INFO.phoneDisplay}
            </a>
          </div>
          <div className="flex items-center gap-2 text-ink-faint sm:justify-end">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              Buka 24 jam
            </span>
          </div>
        </div>

        {/* Bottom line */}
        <div className="flex flex-col items-center justify-between gap-2 border-t border-line py-6 text-[11px] text-ink-faint sm:flex-row">
          <div>
            © {new Date().getFullYear()} {STORE_INFO.name}. Seluruh hak cipta dilindungi.
          </div>
          <div>Dibuat dengan teliti di Bali.</div>
        </div>
      </div>
    </footer>
  );
};
