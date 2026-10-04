import React from 'react';
import { STORE_INFO } from '../data/products';
import { createGeneralInquiryUrl } from '../utils/whatsapp';
import { ArrowRight, MessageCircle, Check, Clock, MapPin, Phone, ArrowDown } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <section className="relative border-b border-line bg-paper">
      {/* subtle grid texture */}
      <div className="grain pointer-events-none absolute inset-0 opacity-60" />

      <div className="relative mx-auto max-w-6xl px-4 pb-14 pt-10 sm:px-6 sm:pb-20 sm:pt-16">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
          {/* Left: copy */}
          <div className="animate-fade-up lg:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-3 py-1 text-[11px] font-medium text-ink-soft shadow-card">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              Jual • Beli • Tukar Tambah — se-Bali via COD
            </div>

            <h1 className="mt-5 font-heading text-[28px] font-bold leading-[1.15] tracking-tight text-ink sm:text-5xl">
              iPhone berkualitas,
              <br />
              <span className="text-ink-faint">harga masuk akal,</span>
              <br />
              garansi jelas.
            </h1>

            <p className="mt-5 max-w-xl font-sans text-sm leading-relaxed text-ink-soft sm:text-base">
              Semua unit di Kedai Gadget melewati inspeksi 30 titik — mulai dari kesehatan baterai,
              fungsi kamera, hingga legalitas IMEI. Datang langsung atau COD, kami buka 24 jam.
            </p>

            <div className="mt-7 flex flex-col gap-2.5 sm:flex-row sm:gap-3">
              <a href="#katalog" className="btn-primary py-3">
                <span>Lihat Katalog</span>
                <ArrowDown className="h-4 w-4" />
              </a>
              <a href="#tukar-tambah" className="btn-ghost py-3">
                <span>Simulasi Tukar Tambah</span>
              </a>
              <a
                href={createGeneralInquiryUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="btn py-3 px-2 text-sm font-medium tracking-wide text-ink-soft transition-colors hover:text-ink"
              >
                <MessageCircle className="h-4 w-4 text-accent" />
                <span>Tanya Admin</span>
              </a>
            </div>

            <div className="mt-9 grid max-w-lg grid-cols-1 gap-2.5 border-t border-line pt-6 text-xs text-ink-soft sm:grid-cols-3">
              {[
                'Garansi IMEI permanen',
                'Garansi tukar unit toko',
                'Bebas reset iCloud di tempat',
              ].map((text) => (
                <div key={text} className="flex items-center gap-2">
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-accent/10">
                    <Check className="h-3 w-3 text-accent" strokeWidth={3} />
                  </span>
                  <span className="leading-snug">{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: store card */}
          <div className="animate-fade-up lg:col-span-5 [animation-delay:120ms]">
            <div className="panel overflow-hidden">
              {/* Card header */}
              <div className="flex items-center justify-between border-b border-line px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-ink font-heading text-xs font-bold text-paper">
                    KG
                  </div>
                  <div>
                    <div className="font-heading text-sm font-bold text-ink">Kedai Gadget</div>
                    <div className="font-sans text-[11px] text-ink-faint">Angantaka, Badung</div>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-accent">
                  <span className="h-1 w-1 rounded-full bg-accent" />
                  Online
                </span>
              </div>

              {/* Info rows */}
              <div className="divide-y divide-line/70 font-sans text-sm">
                <div className="flex items-center gap-3.5 px-5 py-3.5">
                  <Clock className="h-4 w-4 shrink-0 text-ink-faint" strokeWidth={1.8} />
                  <div className="flex-1">
                    <div className="text-xs text-ink-faint">Jam Buka</div>
                    <div className="font-medium text-ink">24 jam, setiap hari</div>
                  </div>
                </div>
                <div className="flex items-center gap-3.5 px-5 py-3.5">
                  <MapPin className="h-4 w-4 shrink-0 text-ink-faint" strokeWidth={1.8} />
                  <div className="flex-1">
                    <div className="text-xs text-ink-faint">Alamat</div>
                    <div className="font-medium leading-snug text-ink">
                      Jl. Raya Angantaka No. 26, Badung, Bali
                    </div>
                  </div>
                  <a
                    href={STORE_INFO.mapsDirectionUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-soft h-8 w-8 !p-0"
                    aria-label="Buka peta"
                  >
                    <ArrowRight className="h-3.5 w-3.5" />
                  </a>
                </div>
                <div className="flex items-center gap-3.5 px-5 py-3.5">
                  <Phone className="h-4 w-4 shrink-0 text-ink-faint" strokeWidth={1.8} />
                  <div className="flex-1">
                    <div className="text-xs text-ink-faint">WhatsApp</div>
                    <div className="font-medium text-ink">{STORE_INFO.phoneDisplay}</div>
                  </div>
                  <a
                    href={createGeneralInquiryUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-soft h-8 w-8 !p-0"
                    aria-label="Chat WhatsApp"
                  >
                    <MessageCircle className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
