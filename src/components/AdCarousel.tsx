"use client";

import { Building2, ShieldCheck, HomeIcon, Hammer, Truck, BadgeCheck, Zap } from "lucide-react";

export function AdCarousel() {
  const ads = [
    { icon: <ShieldCheck className="w-5 h-5 text-emerald-400" />, text: "Garantía de calidad en materiales" },
    { icon: <Building2 className="w-5 h-5 text-brand-400" />, text: "Más de 250 modelos disponibles" },
    { icon: <HomeIcon className="w-5 h-5 text-cyan-400" />, text: "Tu casa propia sin pagar de más" },
    { icon: <Hammer className="w-5 h-5 text-amber-400" />, text: "Desde kits básicos hasta llave en mano" },
    { icon: <Truck className="w-5 h-5 text-indigo-400" />, text: "Opciones con despacho nacional" },
    { icon: <BadgeCheck className="w-5 h-5 text-purple-400" />, text: "Compara entre las mejores constructoras" },
    { icon: <Zap className="w-5 h-5 text-yellow-400" />, text: "Cotiza más rápido, decide mejor" }
  ];

  return (
    <div className="w-full bg-white border-y border-slate-100 mt-16 mb-8 py-5 overflow-hidden relative flex flex-col justify-center shadow-sm">
      {/* Decorative gradients */}
      <div className="absolute left-0 top-0 bottom-0 w-24 md:w-48 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 md:w-48 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

      {/* Marquee implementation via CSS animations */}
      <div className="flex gap-8 md:gap-16 items-center whitespace-nowrap animate-marquee relative z-0 w-max">
        {[...ads, ...ads, ...ads].map((ad, idx) => (
          <div key={idx} className="flex items-center gap-3 text-[#3200C1] font-black tracking-widest uppercase text-xs sm:text-sm bg-slate-50 px-6 py-2.5 rounded-[4px] border border-slate-100 hover:border-[#37FFDB] hover:shadow-sm transition-all duration-300">
            <span className="text-[#37FFDB]">{ad.icon}</span>
            {ad.text}
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-33.333% - 1rem)); }
        }
        .animate-marquee {
          animation: marquee 25s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}
