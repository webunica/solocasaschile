import { Mail, Sparkles, Phone, Globe, ShieldCheck, Building2 } from "lucide-react";
import { sanityClient } from "@/lib/sanity.client";
import ConsultationForm from "@/components/ConsultationForm";

export const metadata = {
    title: "Próximamente | solocasaschile.com",
    description: "Encuentra tu casa ideal. Lanzamiento Abril 2026.",
};

export default async function ComingSoonPage() {
    
    const settings = await sanityClient.fetch(`*[_type == "siteSettings"][0]{
        site_name
    }`);

    const contactPhone1 = "+56 9 6619 8752";
    const contactPhone2 = "+56 9 6413 0601";
    const contactEmail = "ventas@solocasaschile.com";

    return (
        <div className="min-h-screen bg-[#020110] text-white selection:bg-[#37FFDB] selection:text-[#3200C1] overflow-hidden flex flex-col items-center justify-between relative font-sans antialiased">
            
            {/* Background Carousel */}
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

            {/* Andes Cordillera */}
            <div className="absolute bottom-[60px] md:bottom-[80px] left-0 w-full z-0 opacity-[0.3] pointer-events-none transition-opacity duration-1000">
                <AndesSilhouette color="#FFFFFF" />
            </div>

            <div className="absolute top-[-10%] left-[-5%] w-[50%] h-[50%] bg-[#3200C1]/10 rounded-full blur-[140px] z-0"></div>

            {/* Top Status Bar */}
            <header className="w-full px-6 py-6 md:px-10 md:py-8 relative z-20 flex flex-col items-center">
                <div className="inline-flex items-center gap-2.5 px-4 md:px-6 py-2 rounded-full bg-[#37FFDB]/10 border border-[#37FFDB]/20 text-[#37FFDB] text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] shadow-xl shadow-[#37FFDB]/5 backdrop-blur-sm">
                    <Sparkles className="w-3.5 h-3.5 md:w-4 md:h-4 animate-pulse" /> Lanzamiento Abril 2026
                </div>
            </header>

            {/* Main Content Area - Two Column Layout */}
            <main className="flex-1 w-full max-w-7xl px-6 py-12 md:py-20 flex flex-col xl:flex-row items-center justify-center gap-12 xl:gap-24 relative z-20">
                
                {/* Left Column: Consultation Form (Client Component) */}
                <div className="w-full xl:w-[450px] shrink-0 animate-in fade-in slide-in-from-left duration-1000">
                    <ConsultationForm />
                </div>

                {/* Right Column: Information */}
                <div className="flex-1 text-center xl:text-left space-y-12 animate-in fade-in slide-in-from-right duration-1000">
                    
                    <div className="space-y-8">
                        <h1 className="text-4xl md:text-8xl xl:text-9xl font-black leading-[0.9] tracking-tighter">
                            TU HOGAR <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#37FFDB] via-[#FFFFFF] to-[#3200C1] animate-gradient-x">EVOLUCIONADO</span>
                        </h1>
                        <p className="text-slate-400 text-lg md:text-2xl font-medium max-w-2xl mx-auto xl:mx-0 leading-relaxed md:leading-snug opacity-90">
                            Estamos integrando el catálogo digital más grande de <br className="hidden md:block" />
                            <span className="text-white font-black underline decoration-[#37FFDB] decoration-2 md:decoration-4 underline-offset-4 pointer-events-none">226 constructoras</span> para tu próxima decisión.
                        </p>
                    </div>

                    {/* Feature Cards Inline for Right Column */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 xl:gap-6 pt-4">
                        <div className="p-6 rounded-[1.5rem] bg-white/5 border border-white/10 flex flex-col items-center xl:items-start group hover:bg-white/10 transition-all duration-500">
                            <Building2 className="w-8 h-8 text-[#3200C1] mb-3 group-hover:scale-110 transition-transform" />
                            <p className="text-xl font-black text-white">+5.000</p>
                            <span className="text-[9px] font-bold uppercase text-slate-500 tracking-widest leading-none mt-1 text-center xl:text-left">Modelos Únicos</span>
                        </div>
                        <div className="p-6 rounded-[1.5rem] bg-white/5 border border-white/10 flex flex-col items-center xl:items-start group hover:bg-white/10 transition-all duration-500">
                            <ShieldCheck className="w-8 h-8 text-[#37FFDB] mb-3 group-hover:scale-110 transition-transform" />
                            <p className="text-xl font-black text-white">Certificado</p>
                            <span className="text-[9px] font-bold uppercase text-slate-500 tracking-widest leading-none mt-1 text-center xl:text-left">Calidad Segura</span>
                        </div>
                        <div className="p-6 rounded-[1.5rem] bg-white/5 border border-white/10 flex flex-col items-center xl:items-start group hover:bg-white/10 transition-all duration-500">
                            <Globe className="w-8 h-8 text-emerald-400 mb-3 group-hover:scale-110 transition-transform" />
                            <p className="text-xl font-black text-white">Nacional</p>
                            <span className="text-[9px] font-bold uppercase text-slate-500 tracking-widest leading-none mt-1 text-center xl:text-left">Todas las Regiones</span>
                        </div>
                    </div>

                    {/* Contact Links */}
                    <div className="flex flex-col md:flex-row flex-wrap items-center xl:items-start gap-6 md:gap-10">
                        <a href={`mailto:${contactEmail}`} className="flex items-center gap-3 text-slate-400 hover:text-white transition-all font-bold text-sm group">
                            <div className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-[#37FFDB]/10 transition-all">
                                <Mail className="w-4 h-4 text-[#37FFDB]" />
                            </div>
                            {contactEmail}
                        </a>
                        <div className="flex gap-10">
                            <a href={`tel:${contactPhone1.replace(/\s+/g, '')}`} className="flex items-center gap-3 text-slate-400 hover:text-white transition-all font-bold text-sm group">
                                <div className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-[#37FFDB]/10 transition-all">
                                    <Phone className="w-4 h-4 text-[#37FFDB]" />
                                </div>
                                {contactPhone1}
                            </a>
                            <a href={`tel:${contactPhone2.replace(/\s+/g, '')}`} className="flex items-center gap-3 text-slate-400 hover:text-white transition-all font-bold text-sm group">
                                <div className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-[#37FFDB]/10 transition-all">
                                    <Phone className="w-4 h-4 text-[#37FFDB]" />
                                </div>
                                {contactPhone2}
                            </a>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="w-full px-6 py-8 md:px-12 md:py-10 relative z-20 flex flex-col md:flex-row justify-between items-center gap-6 border-t border-white/5 bg-[#020110]/95 backdrop-blur-xl">
                <p className="text-slate-500 text-[10px] md:text-[11px] font-black uppercase tracking-[0.3em] text-center md:text-left leading-relaxed">
                    © 2024 solocasaschile.com — El Comparador de Chile
                </p>
                <div className="flex items-center gap-6 text-[10px] md:text-[11px] font-black uppercase tracking-[0.4em] text-[#37FFDB]/30">
                    <span className="text-[#37FFDB]">Official Launch</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-white/10"></span>
                    <span>Chile v2.0</span>
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
                className="opacity-50"
            />
            <path 
                d="M0 190 L150 150 L300 185 L450 125 L600 170 L750 90 L900 140 L1050 115 L1200 170 L1350 155 L1440 195" 
                stroke={color} 
                strokeWidth="0.6" 
                strokeDasharray="3 3"
                className="opacity-20"
            />
        </svg>
    );
}
