import React from 'react';
import { STORE_INFO } from '../data/products';
import { Navigation, Clock, MapPin, Phone } from 'lucide-react';

export const LocationSection: React.FC = () => {
  return (
    <section id="lokasi" className="border-b border-line bg-white">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
        {/* Header */}
        <div className="animate-fade-up mb-10 max-w-xl">
          <div className="eyebrow">Kunjungi kami</div>
          <h2 className="mt-2 font-heading text-2xl font-bold tracking-tight text-ink sm:text-3xl">
            Cek unit langsung di toko
          </h2>
          <p className="mt-1.5 font-sans text-sm leading-relaxed text-ink-soft">
            Bebas lihat, coba, dan tes fungsi unit sebelum memutuskan. Datang kapan saja — kami buka 24 jam.
          </p>
        </div>

        <div className="grid items-stretch gap-6 md:grid-cols-12">
          {/* Info card */}
          <div className="panel animate-fade-up flex flex-col justify-between overflow-hidden md:col-span-5 [animation-delay:80ms]">
            <div className="divide-y divide-line/70 font-sans">
              <div className="flex items-start gap-4 px-6 py-5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-ink/[0.05]">
                  <MapPin className="h-4.5 w-4.5 text-ink" strokeWidth={1.8} />
                </div>
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-faint">
                    Alamat
                  </div>
                  <p className="mt-1 text-sm font-medium leading-relaxed text-ink">
                    {STORE_INFO.address}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 px-6 py-5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/10">
                  <Clock className="h-4.5 w-4.5 text-accent" strokeWidth={1.8} />
                </div>
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-faint">
                    Jam buka
                  </div>
                  <p className="mt-1 text-sm font-medium text-ink">24 jam, setiap hari</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-ink-faint">
                    Termasuk COD malam hari — konfirmasi dulu via WA.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 px-6 py-5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-ink/[0.05]">
                  <Phone className="h-4.5 w-4.5 text-ink" strokeWidth={1.8} />
                </div>
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-faint">
                    Kontak
                  </div>
                  <p className="mt-1 font-heading text-sm font-bold tracking-tight text-ink">
                    {STORE_INFO.phoneDisplay}
                  </p>
                  <p className="mt-0.5 text-xs text-ink-faint">Telepon & WhatsApp aktif terus</p>
                </div>
              </div>
            </div>

            <div className="border-t border-line bg-paper/60 p-4">
              <a
                href={STORE_INFO.mapsDirectionUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary w-full py-3"
              >
                <Navigation className="h-4 w-4" />
                <span>Buka Rute di Google Maps</span>
              </a>
            </div>
          </div>

          {/* Map */}
          <div className="panel animate-fade-up flex min-h-[340px] flex-col overflow-hidden md:col-span-7 [animation-delay:160ms]">
            <div className="flex items-center justify-between border-b border-line bg-paper/70 px-4 py-2.5 font-sans text-[11px] text-ink-faint">
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                Google Maps
              </span>
              <span className="font-medium text-ink">Kedai Gadget — Angantaka</span>
            </div>
            <div className="relative min-h-[300px] flex-1">
              <iframe
                title="Peta Kedai Gadget"
                src={STORE_INFO.mapsEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0, position: 'absolute', inset: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
