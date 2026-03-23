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
            <div className="absolute inset-0 z-0 flex flex-col justify-around py-10 md:py-20 pointer-events-none opacity-[0.03] md:opacity-[0.05]">
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

            {/* Andes Cordillera */}
            <div className="absolute bottom-[80px] md:bottom-[100px] left-0 w-full z-0 opacity-[0.25] pointer-events-none">
                <AndesSilhouette color="#FFFFFF" />
            </div>

            <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-[#3200C1]/20 rounded-full blur-[120px] z-0"></div>

            {/* Top Status Bar (instead of Logo Header) */}
            <header className="w-full px-6 py-8 md:px-10 md:py-10 relative z-10 flex flex-col items-center">
                <div className="inline-flex items-center gap-2.5 px-4 md:px-5 py-2 rounded-full bg-[#37FFDB]/10 border border-[#37FFDB]/20 text-[#37FFDB] text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] shadow-lg shadow-[#37FFDB]/5">
                    <Sparkles className="w-3.5 h-3.5 md:w-4 md:h-4" /> Lanzamiento Abril 2026
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col items-center justify-center text-center px-6 relative z-10 w-full max-w-7xl space-y-12 pb-16 md:pb-24">
                
                {/* Hero Section with Logo on the Left */}
                <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
                    
                    {/* Logo on the Left Side */}
                    <div className="relative group shrink-0">
                        {logoUrl ? (
                            <img 
                                src={logoUrl} 
                                alt={siteName} 
                                className="h-24 md:h-48 w-auto drop-shadow-[0_0_30px_rgba(55,255,219,0.2)] brightness-110 group-hover:scale-105 transition-transform duration-500" 
                            />
                        ) : (
                            <div className="w-24 h-24 md:w-32 md:h-32 rounded-[2rem] bg-[#3200C1] flex items-center justify-center shadow-2xl shadow-[#3200C1]/40 border border-[#37FFDB]/30">
                                <Hash className="w-12 h-12 md:w-16 md:h-16 text-[#37FFDB]" />
                            </div>
                        )}
                    </div>

                    {/* Title Text on the Right Height */}
                    <div className="text-center md:text-left space-y-6">
                        <h1 className="text-5xl md:text-9xl font-black leading-[0.9] tracking-tighter">
                            TU HOGAR <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#37FFDB] to-[#3200C1]">EVOLUCIONADO</span>
                        </h1>
                        <p className="text-slate-400 text-lg md:text-2xl font-medium max-w-xl mx-auto md:mx-0 leading-relaxed">
                            Estamos integrando el catálogo digital más grande de <br className="hidden md:block" />
                            <span className="text-white font-black underline decoration-[#37FFDB] decoration-2 md:decoration-4 underline-offset-2 md:underline-offset-4">226 constructoras</span> para tu próxima decisión.
                        </p>
                    </div>
                </div>

                {/* Info Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 w-full max-w-4xl pt-8">
                    <div className="p-6 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] bg-white/5 backdrop-blur-sm border border-white/10 flex flex-col items-center group hover:bg-white/10 hover:border-[#37FFDB]/30 transition-all duration-500">
                        <Building2 className="w-8 h-8 md:w-10 md:h-10 text-[#3200C1] mb-3 md:mb-4 group-hover:scale-110 transition-transform" />
                        <p className="text-xl md:text-2xl font-black text-white">+5.000</p>
                        <span className="text-[9px] md:text-[10px] font-bold uppercase text-slate-500 tracking-widest leading-none mt-1">Modelos Únicos</span>
                    </div>
                    <div className="p-6 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] bg-white/5 backdrop-blur-sm border border-white/10 flex flex-col items-center group hover:bg-white/10 hover:border-[#37FFDB]/30 transition-all duration-500">
                        <ShieldCheck className="w-8 h-8 md:w-10 md:h-10 text-[#37FFDB] mb-3 md:mb-4 group-hover:scale-110 transition-transform" />
                        <p className="text-xl md:text-2xl font-black text-white">Certificado</p>
                        <span className="text-[9px] md:text-[10px] font-bold uppercase text-slate-500 tracking-widest leading-none mt-1">Calidad Garantizada</span>
                    </div>
                    <div className="p-6 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] bg-white/5 backdrop-blur-sm border border-white/10 flex flex-col items-center group hover:bg-white/10 hover:border-[#37FFDB]/30 transition-all duration-500">
                        <Globe className="w-8 h-8 md:w-10 md:h-10 text-emerald-400 mb-3 md:mb-4 group-hover:scale-110 transition-transform" />
                        <p className="text-xl md:text-2xl font-black text-white">Nacional</p>
                        <span className="text-[9px] md:text-[10px] font-bold uppercase text-slate-500 tracking-widest leading-none mt-1">Todas las Regiones</span>
                    </div>
                </div>

                {/* Contact Links */}
                <div className="pt-4 flex flex-col md:flex-row flex-wrap items-center justify-center gap-4 md:gap-8 px-4">
                    <a href={`mailto:${contactEmail}`} className="flex items-center gap-3 text-slate-400 hover:text-white transition-colors font-bold text-sm">
                        <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                            <Mail className="w-4 h-4 md:w-4.5 md:h-4.5 text-[#37FFDB]" />
                        </div>
                        <span className="truncate max-w-[200px] md:max-w-none">{contactEmail}</span>
                    </a>
                    <div className="flex flex-col sm:flex-row gap-4 md:gap-8">
                        <a href={`tel:${contactPhone1.replace(/\s+/g, '')}`} className="flex items-center gap-3 text-slate-400 hover:text-white transition-colors font-bold text-sm">
                            <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                                <Phone className="w-4 h-4 md:w-4.5 md:h-4.5 text-[#37FFDB]" />
                            </div>
                            {contactPhone1}
                        </a>
                        <a href={`tel:${contactPhone2.replace(/\s+/g, '')}`} className="flex items-center gap-3 text-slate-400 hover:text-white transition-colors font-bold text-sm">
                            <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                                <Phone className="w-4 h-4 md:w-4.5 md:h-4.5 text-[#37FFDB]" />
                            </div>
                            {contactPhone2}
                        </a>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="w-full px-6 py-8 md:px-10 md:py-10 relative z-10 flex flex-col md:flex-row justify-between items-center gap-4 border-t border-white/5 bg-[#020110]/80 backdrop-blur-md">
                <p className="text-slate-500 text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-center md:text-left leading-relaxed">
                    © 2024 solocasaschile.com — El Comparador de Chile
                </p>
                <div className="flex items-center gap-4 text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-[#37FFDB]/30">
                    <span className="text-[#37FFDB]">Official Launch</span>
                    <span className="w-1 h-1 rounded-full bg-white/10"></span>
                    <span>v2.0 2026 Chile</span>
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
        <svg width="100%" height="150" viewBox="0 0 1440 150" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-auto">
            <path 
                d="M0 150 L120 100 L240 130 L360 80 L480 110 L600 40 L720 90 L840 60 L960 110 L1080 30 L1200 80 L1320 110 L1440 140 V150 H0Z" 
                stroke={color} 
                strokeWidth="1" 
                strokeDasharray="4 4"
            />
            <path 
                d="M0 140 L150 110 L300 145 L450 95 L600 120 L750 50 L900 100 L1050 75 L1200 130 L1350 115 L1440 145" 
                stroke={color} 
                strokeWidth="0.5" 
                strokeDasharray="2 2"
            />
        </svg>
    );
}
