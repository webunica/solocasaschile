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
        <div className="min-h-screen bg-white text-[#3200C1] selection:bg-[#3200C1] selection:text-white overflow-hidden flex flex-col items-center justify-between relative font-sans antialiased">
            
            {/* Background Carousel of Modern Models */}
            <div className="absolute inset-0 z-0 flex flex-col justify-around py-10 md:py-20 pointer-events-none opacity-[0.04] md:opacity-[0.06]">
                <div className="flex gap-20 md:gap-40 animate-scroll-left whitespace-nowrap">
                    <ModernBlueprint color="#3200C1" /> <ModernBlueprint color="#37FFDB" /> <ModernBlueprint color="#3200C1" /> <ModernBlueprint color="#37FFDB" />
                </div>
                <div className="flex gap-20 md:gap-40 animate-scroll-right whitespace-nowrap">
                    <ModernBlueprint variant="alt" color="#37FFDB" /> <ModernBlueprint variant="alt" color="#3200C1" /> <ModernBlueprint variant="alt" color="#37FFDB" /> <ModernBlueprint variant="alt" color="#3200C1" />
                </div>
                <div className="flex gap-20 md:gap-40 animate-scroll-left whitespace-nowrap">
                    <ModernBlueprint color="#3200C1" /> <ModernBlueprint color="#37FFDB" /> <ModernBlueprint color="#3200C1" /> <ModernBlueprint color="#37FFDB" />
                </div>
            </div>

            {/* Andes Cordillera Line Drawing - Subtle at bottom */}
            <div className="absolute bottom-[80px] md:bottom-[100px] left-0 w-full z-0 opacity-[0.15] pointer-events-none">
                <AndesSilhouette color="#3200C1" />
            </div>

            {/* Top Logo Area */}
            <header className="w-full px-6 py-8 md:px-10 md:py-12 relative z-10 flex flex-col items-center gap-6 md:gap-8">
                <div className="flex items-center gap-4">
                    {logoUrl ? (
                        <img 
                            src={logoUrl} 
                            alt={siteName} 
                            className="h-10 md:h-16 w-auto drop-shadow-sm" 
                        />
                    ) : (
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-[#3200C1] flex items-center justify-center shadow-lg md:shadow-xl shadow-[#3200C1]/20">
                                <Hash className="w-6 h-6 md:w-8 md:h-8 text-[#37FFDB]" />
                            </div>
                            <span className="text-xl md:text-3xl font-black tracking-tighter text-[#3200C1] uppercase">
                                {siteName.split('.')[0]}
                            </span>
                        </div>
                    )}
                </div>
                <div className="h-px w-12 md:w-20 bg-gradient-to-r from-transparent via-[#37FFDB] to-transparent"></div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col items-center justify-center text-center px-6 relative z-10 w-full max-w-5xl space-y-10 md:space-y-12 pb-16 md:pb-24">
                
                <div className="space-y-6">
                    <div className="inline-flex items-center gap-2.5 px-4 md:px-5 py-2 rounded-full bg-[#3200C1] text-[#37FFDB] text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] shadow-lg shadow-[#3200C1]/20">
                        <Sparkles className="w-3.5 h-3.5 md:w-4 md:h-4" /> Estreno Abril 2026
                    </div>

                    <h1 className="text-4xl md:text-9xl font-black leading-[1] md:leading-[0.9] tracking-tighter text-[#3200C1]">
                        TU HOGAR <br />
                        <span className="text-[#37FFDB]">EVOLUCIONADO</span>
                    </h1>
                    
                    <p className="text-slate-500 text-base md:text-2xl font-medium max-w-3xl mx-auto leading-relaxed px-2">
                        Estamos integrando el catálogo digital más grande de <br className="hidden md:block" />
                        <span className="text-[#3200C1] font-black underline decoration-[#37FFDB] decoration-2 md:decoration-4 underline-offset-2 md:underline-offset-4">226 constructoras</span> para tu próxima decisión.
                    </p>
                </div>

                {/* Info Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 w-full max-w-4xl px-2">
                    <div className="p-6 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] bg-slate-50/50 backdrop-blur-sm border border-slate-100 flex flex-col items-center group hover:bg-white hover:shadow-xl md:hover:shadow-2xl hover:shadow-[#3200C1]/10 transition-all duration-500">
                        <Building2 className="w-8 h-8 md:w-10 md:h-10 text-[#3200C1] mb-3 md:mb-4 group-hover:scale-110 transition-transform" />
                        <p className="text-xl md:text-2xl font-black text-[#3200C1]">+5.000</p>
                        <span className="text-[9px] md:text-[10px] font-bold uppercase text-slate-400 tracking-widest leading-none mt-1">Modelos Únicos</span>
                    </div>
                    <div className="p-6 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] bg-slate-50/50 backdrop-blur-sm border border-slate-100 flex flex-col items-center group hover:bg-white hover:shadow-xl md:hover:shadow-2xl hover:shadow-[#3200C1]/10 transition-all duration-500">
                        <ShieldCheck className="w-8 h-8 md:w-10 md:h-10 text-[#37FFDB] mb-3 md:mb-4 group-hover:scale-110 transition-transform" />
                        <p className="text-xl md:text-2xl font-black text-[#3200C1]">Certificado</p>
                        <span className="text-[9px] md:text-[10px] font-bold uppercase text-slate-400 tracking-widest leading-none mt-1">Calidad Garantizada</span>
                    </div>
                    <div className="p-6 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] bg-slate-50/50 backdrop-blur-sm border border-slate-100 flex flex-col items-center group hover:bg-white hover:shadow-xl md:hover:shadow-2xl hover:shadow-[#3200C1]/10 transition-all duration-500">
                        <Globe className="w-8 h-8 md:w-10 md:h-10 text-emerald-500 mb-3 md:mb-4 group-hover:scale-110 transition-transform" />
                        <p className="text-xl md:text-2xl font-black text-[#3200C1]">Nacional</p>
                        <span className="text-[9px] md:text-[10px] font-bold uppercase text-slate-400 tracking-widest leading-none mt-1">Todas las Regiones</span>
                    </div>
                </div>

                {/* Contact Section */}
                <div className="pt-4 flex flex-col md:flex-row flex-wrap items-center justify-center gap-4 md:gap-8 px-4">
                    <a href={`mailto:${contactEmail}`} className="flex items-center gap-3 text-slate-600 hover:text-[#3200C1] transition-colors font-bold text-sm">
                        <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-slate-50 flex items-center justify-center border border-slate-200">
                            <Mail className="w-4 h-4 md:w-4.5 md:h-4.5 text-[#3200C1]" />
                        </div>
                        <span className="truncate max-w-[200px] md:max-w-none">{contactEmail}</span>
                    </a>
                    <div className="flex flex-col sm:flex-row gap-4 md:gap-8">
                        <a href={`tel:${contactPhone1.replace(/\s+/g, '')}`} className="flex items-center gap-3 text-slate-600 hover:text-[#3200C1] transition-colors font-bold text-sm">
                            <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-slate-50 flex items-center justify-center border border-slate-200">
                                <Phone className="w-4 h-4 md:w-4.5 md:h-4.5 text-[#3200C1]" />
                            </div>
                            {contactPhone1}
                        </a>
                        <a href={`tel:${contactPhone2.replace(/\s+/g, '')}`} className="flex items-center gap-3 text-slate-600 hover:text-[#3200C1] transition-colors font-bold text-sm">
                            <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-slate-50 flex items-center justify-center border border-slate-200">
                                <Phone className="w-4 h-4 md:w-4.5 md:h-4.5 text-[#3200C1]" />
                            </div>
                            {contactPhone2}
                        </a>
                    </div>
                </div>
            </main>

            {/* Simple Footer */}
            <footer className="w-full px-6 py-8 md:px-10 md:py-10 relative z-10 flex flex-col md:flex-row justify-between items-center gap-4 border-t border-slate-100 bg-white/80 backdrop-blur-md">
                <p className="text-slate-400 text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-center md:text-left leading-relaxed">
                    © 2024 solocasaschile.com — El Comparador de Chile
                </p>
                <div className="flex items-center gap-4 text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-[#3200C1]/30">
                    <span className="text-amber-500">Official Release</span>
                    <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                    <span>v2.0 2026 Chile</span>
                </div>
            </footer>
        </div>
    );
}

// MODERN Blueprint SVG Components
function ModernBlueprint({ color = "#3200C1", variant = "base" }: { color?: string; variant?: string }) {
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
function AndesSilhouette({ color = "#3200C1" }: { color?: string }) {
    return (
        <svg width="100%" height="150" viewBox="0 0 1440 150" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-auto">
            <path 
                d="M0 150 L120 100 L240 130 L360 80 L480 110 L600 40 L720 90 L840 60 L960 110 L1080 30 L1200 80 L1320 110 L1440 140 V150 H0Z" 
                stroke={color} 
                strokeWidth="0.5" 
                strokeDasharray="2 4"
            />
            {/* Secondary line for depth */}
            <path 
                d="M0 140 L150 110 L300 145 L450 95 L600 120 L750 50 L900 100 L1050 75 L1200 130 L1350 115 L1440 145" 
                stroke={color} 
                strokeWidth="0.3" 
                strokeDasharray="1 1"
            />
        </svg>
    );
}
