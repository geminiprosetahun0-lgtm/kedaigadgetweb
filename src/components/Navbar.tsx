import React, { useState } from 'react';
import { STORE_INFO } from '../data/products';
import { MessageCircle, MapPin, Store, Settings, Menu, X, ShieldCheck } from 'lucide-react';
import { createGeneralInquiryUrl } from '../utils/whatsapp';

interface NavbarProps {
  currentView: 'store' | 'admin';
  onViewChange: (view: 'store' | 'admin') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onViewChange }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = () => setMobileMenuOpen(false);

  const navLinks = [
    { href: '#katalog', label: 'Katalog' },
    { href: '#tukar-tambah', label: 'Tukar Tambah' },
    { href: '#jual-hp', label: 'Jual iPhone' },
    { href: '#lokasi', label: 'Lokasi' },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-paper/85 backdrop-blur-xl">
      {/* Announcement bar */}
      <div className="border-b border-ink/10 bg-ink text-[11px] text-paper/80">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-1.5 sm:px-6">
          <div className="flex items-center gap-2">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
            </span>
            <span className="font-medium tracking-wide text-paper">Buka 24 Jam</span>
            <span className="hidden text-paper/40 sm:inline">—</span>
            <span className="hidden text-paper/60 sm:inline">COD & datang langsung, kapan pun</span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href={STORE_INFO.mapsDirectionUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-paper/70 transition-colors hover:text-paper"
            >
              <MapPin className="h-3 w-3 shrink-0" />
              <span>Angantaka</span>
            </a>
            <span className="text-paper/25">/</span>
            <a
              href={STORE_INFO.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-paper/70 transition-colors hover:text-paper"
            >
              @{STORE_INFO.instagram}
            </a>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Brand */}
          <div
            className="flex cursor-pointer items-center gap-2.5"
            onClick={() => {
              onViewChange('store');
              setMobileMenuOpen(false);
            }}
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-ink text-paper shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]">
              <ShieldCheck className="h-4 w-4" strokeWidth={2.2} />
            </div>
            <div>
              <div className="font-heading text-[15px] font-bold leading-none tracking-tight text-ink">
                {STORE_INFO.name}
              </div>
              <div className="mt-1 font-sans text-[10px] uppercase tracking-[0.14em] text-ink-faint">
                iPhone Specialist
              </div>
            </div>
          </div>

          {/* Desktop links */}
          {currentView === 'store' && (
            <nav className="hidden items-center gap-8 text-sm font-medium text-ink-soft md:flex">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="relative py-1 transition-colors after:absolute after:-bottom-0.5 after:left-0 after:h-px after:w-0 after:bg-ink after:transition-all after:duration-300 hover:text-ink hover:after:w-full"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          )}

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onViewChange(currentView === 'store' ? 'admin' : 'store');
                setMobileMenuOpen(false);
              }}
              className="btn-soft px-3 py-2 text-xs"
            >
              {currentView === 'store' ? (
                <>
                  <Settings className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Kelola Toko</span>
                </>
              ) : (
                <>
                  <Store className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Lihat Toko</span>
                </>
              )}
            </button>

            <a
              href={createGeneralInquiryUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary px-4 py-2 text-xs"
            >
              <MessageCircle className="h-3.5 w-3.5" />
              <span>WhatsApp</span>
            </a>

            {/* Mobile menu toggle */}
            {currentView === 'store' && (
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-line bg-white text-ink transition-colors hover:border-ink/25 md:hidden"
                aria-label="Toggle menu"
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && currentView === 'store' && (
        <div className="animate-fade-in border-t border-line bg-paper md:hidden">
          <nav className="mx-auto max-w-6xl px-4 py-2">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={handleNavClick}
                className="flex items-center justify-between border-b border-line/70 py-3.5 text-sm font-medium text-ink-soft transition-colors last:border-0 hover:text-ink"
              >
                <span>{link.label}</span>
                <span className="text-ink-faint">→</span>
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};
