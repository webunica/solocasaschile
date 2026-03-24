import { Mail, Sparkles, Phone, Hash, Globe, ShieldCheck, Building2 } from "lucide-react";
import { sanityClient } from "@/lib/sanity.client";

export const metadata = {
    title: "Próximamente | solocasaschile.com",
    description: "Encuentra tu casa ideal. Lanzamiento Abril 2026.",
};

export default async function ComingSoonPage() {
    
    const settings = await sanityClient.fetch(`*[_type == "siteSettings"][0]{
        site_name,
        "logo_url": site_logo.asset->url
    }`);

    const siteName = settings?.site_name || "solocasaschile.com";
    const contactPhone1 = "+56 9 6619 8752";
    const contactPhone2 = "+56 9 6413 0601";
    const contactEmail = "ventas@solocasaschile.com";
    const logoUrl = settings?.logo_url || null;

    return (
        <div className="min-h-screen bg-[#020110] text-white selection:bg-[#37FFDB] selection:text-[#3200C1] overflow-hidden flex flex-col items-center justify-between relative font-sans antialiased">
            
            {/* Background Carousel - Ultra subtle */}
            <div className="absolute inset-0 z-0 flex flex-col justify-around py-10 md:py-20 pointer-events-none opacity-[0.02] md:opacity-[0.04]">
                <div className="flex gap-20 md:gap-40 animate-scroll-left whitespace-nowrap">
                    <ModernBlueprint color="#FFFFFF" /> <ModernBlueprint color="#37FFDB" /> <ModernBlueprint color="#FFFFFF" /> <ModernBlueprint color="#37FFDB" />
                </div>
                <div className="flex gap-20 md:gap-40 animate-scroll-right whitespace-nowrap">
                    <ModernBlueprint variant="alt" color="#37FFDB" /> <ModernBlueprint variant="alt" color="#FFFFFF" /> <ModernBlueprint variant="alt" color="#37FFDB" /> <ModernBlueprint variant="alt" color="#FFFFFF" />
                </div>
                <div className="flex gap-20 md:gap-40 animate-scroll-left whitespace-nowrap">
                    <ModernBlueprint color="#FFFFFF" /> <ModernBlueprint color="#37FFDB" /> <ModernBlueprint color="#FFFFFF" /> <ModernBlueprint color="#37FFDB" />
                </div>
            </div>

            {/* Andes Cordillera - Taller for more impact */}
            <div className="absolute bottom-[60px] md:bottom-[80px] left-0 w-full z-0 opacity-[0.3] pointer-events-none transition-opacity duration-1000">
                <AndesSilhouette color="#FFFFFF" />
            </div>

            <div className="absolute top-[-10%] left-[-5%] w-[50%] h-[50%] bg-[#3200C1]/10 rounded-full blur-[140px] z-0"></div>
            <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-[#37FFDB]/5 rounded-full blur-[120px] z-0"></div>

            {/* Top Status Bar */}
            <header className="w-full px-6 py-6 md:px-10 md:py-8 relative z-10 flex flex-col items-center">
                <div className="inline-flex items-center gap-2.5 px-4 md:px-6 py-2 rounded-full bg-[#37FFDB]/10 border border-[#37FFDB]/20 text-[#37FFDB] text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] shadow-xl shadow-[#37FFDB]/5 backdrop-blur-sm">
                    <Sparkles className="w-3.5 h-3.5 md:w-4 md:h-4 animate-pulse" /> Lanzamiento Abril 2026
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col items-center justify-center text-center px-6 relative z-10 w-full max-w-7xl space-y-16 md:space-y-24 pb-20 md:pb-32">
                
                {/* Hero Section with Logo on the Left */}
                <div className="flex flex-col xl:flex-row items-center justify-center gap-10 md:gap-20">
                    
                    {/* Logo Section */}
                    <div className="relative group shrink-0">
                        {logoUrl ? (
                            <img 
                                src={logoUrl} 
                                alt={siteName} 
                                className="h-auto w-auto max-w-[280px] md:max-w-[500px] drop-shadow-[0_0_40px_rgba(55,255,219,0.15)] md:drop-shadow-[0_0_60px_rgba(55,255,219,0.25)] brightness-110 group-hover:scale-[1.03] transition-transform duration-700 ease-out" 
                            />
                        ) : (
                            <div className="w-28 h-28 md:w-40 md:h-40 rounded-[2.5rem] bg-gradient-to-br from-[#3200C1] to-[#020110] flex items-center justify-center shadow-2xl shadow-[#3200C1]/40 border border-[#37FFDB]/30">
                                <Hash className="w-14 h-14 md:w-20 md:h-20 text-[#37FFDB]" />
                            </div>
                        )}
                    </div>

                    {/* Title & Description */}
                    <div className="text-center xl:text-left space-y-8">
                        <h1 className="text-5xl md:text-9xl font-black leading-[0.9] tracking-tighter">
                            TU HOGAR <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#37FFDB] via-[#FFFFFF] to-[#3200C1] animate-gradient-x">EVOLUCIONADO</span>
                        </h1>
                        <p className="text-slate-400 text-lg md:text-3xl font-medium max-w-2xl mx-auto xl:mx-0 leading-relaxed md:leading-snug opacity-90">
                            Estamos integrando el catálogo digital más grande de <br className="hidden md:block" />
                            <span className="text-white font-black underline decoration-[#37FFDB] decoration-2 md:decoration-4 underline-offset-4 pointer-events-none">226 constructoras</span> para tu próxima decisión.
                        </p>
                    </div>
                </div>

                {/* Info Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 md:gap-8 w-full max-w-5xl">
                    <div className="p-8 md:p-10 rounded-[2rem] md:rounded-[3rem] bg-white/5 backdrop-blur-md border border-white/10 flex flex-col items-center group hover:bg-white/10 hover:border-[#37FFDB]/40 transition-all duration-500 shadow-2xl">
                        <Building2 className="w-10 h-10 md:w-12 md:h-12 text-[#3200C1] mb-4 md:mb-5 group-hover:scale-110 transition-transform" />
                        <p className="text-2xl md:text-3xl font-black text-white">+5.000</p>
                        <span className="text-[10px] md:text-[11px] font-bold uppercase text-slate-500 tracking-widest leading-none mt-2">Modelos Únicos</span>
                    </div>
                    <div className="p-8 md:p-10 rounded-[2rem] md:rounded-[3rem] bg-white/5 backdrop-blur-md border border-white/10 flex flex-col items-center group hover:bg-white/10 hover:border-[#37FFDB]/40 transition-all duration-500 shadow-2xl">
                        <ShieldCheck className="w-10 h-10 md:w-12 md:h-12 text-[#37FFDB] mb-4 md:mb-5 group-hover:scale-110 transition-transform" />
                        <p className="text-2xl md:text-3xl font-black text-white">Certificado</p>
                        <span className="text-[10px] md:text-[11px] font-bold uppercase text-slate-500 tracking-widest leading-none mt-2">Calidad Garantizada</span>
                    </div>
                    <div className="p-8 md:p-10 rounded-[2rem] md:rounded-[3rem] bg-white/5 backdrop-blur-md border border-white/10 flex flex-col items-center group hover:bg-white/10 hover:border-[#37FFDB]/40 transition-all duration-500 shadow-2xl">
                        <Globe className="w-10 h-10 md:w-12 md:h-12 text-emerald-400 mb-4 md:mb-5 group-hover:scale-110 transition-transform" />
                        <p className="text-2xl md:text-3xl font-black text-white">Nacional</p>
                        <span className="text-[10px] md:text-[11px] font-bold uppercase text-slate-500 tracking-widest leading-none mt-2">Todas las Regiones</span>
                    </div>
                </div>

                {/* Contact Links */}
                <div className="pt-6 flex flex-col md:flex-row flex-wrap items-center justify-center gap-6 md:gap-12 px-4 relative">
                    <a href={`mailto:${contactEmail}`} className="flex items-center gap-4 text-slate-400 hover:text-white transition-all font-bold text-sm md:text-base group">
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-[#37FFDB]/50 group-hover:bg-[#37FFDB]/10 transition-all">
                            <Mail className="w-5 h-5 md:w-6 md:h-6 text-[#37FFDB]" />
                        </div>
                        <span className="truncate max-w-[250px] md:max-w-none">{contactEmail}</span>
                    </a>
                    <div className="flex flex-col sm:flex-row gap-6 md:gap-12">
                        <a href={`tel:${contactPhone1.replace(/\s+/g, '')}`} className="flex items-center gap-4 text-slate-400 hover:text-white transition-all font-bold text-sm md:text-base group">
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-[#37FFDB]/50 group-hover:bg-[#37FFDB]/10 transition-all">
                                <Phone className="w-5 h-5 md:w-6 md:h-6 text-[#37FFDB]" />
                            </div>
                            {contactPhone1}
                        </a>
                        <a href={`tel:${contactPhone2.replace(/\s+/g, '')}`} className="flex items-center gap-4 text-slate-400 hover:text-white transition-all font-bold text-sm md:text-base group">
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-[#37FFDB]/50 group-hover:bg-[#37FFDB]/10 transition-all">
                                <Phone className="w-5 h-5 md:w-6 md:h-6 text-[#37FFDB]" />
                            </div>
                            {contactPhone2}
                        </a>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="w-full px-6 py-10 md:px-12 md:py-12 relative z-10 flex flex-col md:flex-row justify-between items-center gap-6 border-t border-white/5 bg-[#020110]/95 backdrop-blur-xl">
                <p className="text-slate-500 text-[10px] md:text-[11px] font-black uppercase tracking-[0.3em] text-center md:text-left leading-relaxed">
                    © 2024 solocasaschile.com — El Comparador de Chile
                </p>
                <div className="flex items-center gap-6 text-[10px] md:text-[11px] font-black uppercase tracking-[0.3em] text-[#37FFDB]/40">
                    <span className="text-[#37FFDB] animate-pulse">Chile Edition</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-white/10"></span>
                    <span>Lanzamiento v2.0</span>
                </div>
            </footer>
        </div>
    );
}

// MODERN Blueprint SVG Components
function ModernBlueprint({ color = "#FFFFFF", variant = "base" }: { color?: string; variant?: string }) {
    if (variant === "alt") {
        return (
            <svg width="220" height="140" viewBox="0 0 280 180" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
                <rect x="40" y="60" width="160" height="100" stroke={color} strokeWidth="1" strokeDasharray="4 4" />
                <path d="M40 60 L120 10 L200 60" stroke={color} strokeWidth="1" strokeDasharray="4 4" />
                <rect x="70" y="100" width="40" height="60" stroke={color} strokeWidth="0.5" />
                <rect x="140" y="80" width="40" height="40" stroke={color} strokeWidth="0.5" />
            </svg>
        );
    }
    return (
        <svg width="220" height="140" viewBox="0 0 280 180" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
            <rect x="20" y="80" width="120" height="80" stroke={color} strokeWidth="1" strokeDasharray="4 4" />
            <rect x="140" y="40" width="100" height="120" stroke={color} strokeWidth="1" strokeDasharray="4 4" />
            <rect x="60" y="110" width="40" height="50" stroke={color} strokeWidth="0.5" />
            <path d="M20 160 H240" stroke={color} strokeWidth="0.5" strokeDasharray="2 2" />
        </svg>
    );
}

// Andes Silhouette Component
function AndesSilhouette({ color = "#FFFFFF" }: { color?: string }) {
    return (
        <svg width="100%" height="200" viewBox="0 0 1440 200" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-auto">
            <path 
                d="M0 200 L120 140 L240 170 L360 110 L480 150 L600 60 L720 130 L840 90 L960 160 L1080 40 L1200 110 L1320 160 L1440 190 V200 H0Z" 
                stroke={color} 
                strokeWidth="1.2" 
                strokeDasharray="6 6"
                className="opacity-60"
            />
            <path 
                d="M0 190 L150 150 L300 185 L450 125 L600 170 L750 90 L900 140 L1050 115 L1200 170 L1350 155 L1440 195" 
                stroke={color} 
                strokeWidth="0.6" 
                strokeDasharray="3 3"
                className="opacity-40"
            />
        </svg>
    );
}
