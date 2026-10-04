import React from 'react';
import { ShieldCheck, CheckCircle2, Lock, Headphones, RotateCcw } from 'lucide-react';
import { createGeneralInquiryUrl } from '../utils/whatsapp';

export const GuaranteeSection: React.FC = () => {
  const guarantees = [
    {
      icon: <ShieldCheck className="w-6 h-6 text-cyan-400" />,
      title: 'Garansi IMEI Sinyal Seumur Hidup',
      description: 'Seluruh unit iPhone second dan baru dijamin bebas blokir sinyal all-provider (Telkomsel, Indosat, XL, Smartfren). Jika ada kendala sinyal, toko bertanggung jawab penuh.'
    },
    {
      icon: <RotateCcw className="w-6 h-6 text-blue-400" />,
      title: 'Garansi Tukar Unit Toko',
      description: 'Garansi personal toko berlaku untuk pengetesan mesin, fungsi kamera, speaker, sensor FaceID, dan komponen internal. Rusak fungsi pabrik langsung ganti unit.'
    },
    {
      icon: <Lock className="w-6 h-6 text-emerald-400" />,
      title: 'iCloud Bebas & 100% Bersih',
      description: 'Semua unit telah di-reset pabrik (Clean iCloud) bebas kait akun pemilik lama. Anda bisa login iCloud dan update iOS langsung di tempat.'
    },
    {
      icon: <Headphones className="w-6 h-6 text-purple-400" />,
      title: 'Dukungan Pelayanan 24 Jam',
      description: 'Admin toko siap membantu keluhan, konsultasi pemakaian, atau pengiriman darurat 24 jam nonstop untuk seluruh area Denpasar, Badung, dan sekitarnya.'
    }
  ];

  return (
    <section id="garansi" className="py-16 sm:py-24 bg-slate-950 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-400 mb-3">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Standar Kualitas & Keamanan
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Transparansi Tanpa Keraguan
          </h2>
          <p className="text-slate-400 text-sm mt-2">
            Di Kedai Gadget, kami mengedepankan integritas kualitas. Tidak ada unit rekondisi abal-abal atau bypass sinyal.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {guarantees.map((item, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center mb-4">
                  {item.icon}
                </div>
                <h3 className="font-bold text-base text-white mb-2 leading-snug">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Quality Banner */}
        <div className="mt-12 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-950/40 via-slate-900 to-indigo-950/30 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h4 className="text-lg font-bold text-white">Ingin Cek Kondisi Unit Sebelum Datang ke Toko?</h4>
            <p className="text-xs text-slate-400">Tim kami bisa kirimkan video 360° fisik, foto 3uTools, dan skor Battery Health via WhatsApp.</p>
          </div>
          <a
            href={createGeneralInquiryUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="whitespace-nowrap px-6 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs sm:text-sm transition-all"
          >
            Minta Video Kondisi Unit
          </a>
        </div>

      </div>
    </section>
  );
};
