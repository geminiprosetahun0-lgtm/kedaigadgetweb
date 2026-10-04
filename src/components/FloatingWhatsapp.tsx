import React from 'react';
import { MessageCircle } from 'lucide-react';
import { createGeneralInquiryUrl } from '../utils/whatsapp';

export const FloatingWhatsapp: React.FC = () => {
  return (
    <aside
      aria-label="Chat WhatsApp"
      className="group fixed bottom-5 right-4 z-40 flex items-center gap-2.5 sm:right-6"
    >
      {/* Label bubble — desktop only */}
      <span className="pointer-events-none hidden translate-x-1 rounded-full border border-line bg-white px-3 py-1.5 font-sans text-[11px] font-medium text-ink-soft opacity-0 shadow-card transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 md:block">
        Tanya stok, fast response
      </span>

      <a
        href={createGeneralInquiryUrl()}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat WhatsApp Admin"
        className="flex h-12 w-12 items-center justify-center rounded-full bg-ink text-paper shadow-lift transition-all duration-300 hover:scale-105 hover:shadow-pop active:scale-95 sm:h-13 sm:w-13"
      >
        <MessageCircle className="h-5 w-5" />
      </a>
    </aside>
  );
};
