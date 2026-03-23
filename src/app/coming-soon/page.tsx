import { Building2, Mail, Sparkles, Phone, Hash, Globe, ShieldCheck } from "lucide-react";
import { sanityClient } from "@/lib/sanity.client";

export const metadata = {
    title: "Próximamente | solocasaschile.com",
    description: "La plataforma definitiva para comparar constructoras de casas prefabricadas y sólidas en Chile. Lanzamiento Abril 2026.",
};

export default async function ComingSoonPage() {
    
    const settings = await sanityClient.fetch(`*[_type == "siteSettings"][0]{
        site_name,
        "logo_url": site_logo.asset->url
    }`);

    const siteName = settings?.site_name || "solocasaschile.com";
    const contactPhone = "+56 9 6619 8752";
    const contactEmail = "ventas@solocasaschile.com";
    const logoUrl = settings?.logo_url || null;

    return (
        <div className="min-h-screen bg-[#020010] text-white selection:bg-[#37FFDB] selection:text-[#020010] overflow-hidden flex flex-col items-center justify-between relative font-sans">
            
            {/* Background Blueprint Animation - Modern Line Art */}
            <div className="absolute inset-0 z-0 flex flex-col justify-around opacity-[0.07] pointer-events-none">
                <div className="flex gap-40 animate-scroll-left whitespace-nowrap">
                    <ModernBlueprint1 /> <ModernBlueprint2 /> <ModernBlueprint1 /> <ModernBlueprint2 />
                </div>
                <div className="flex gap-40 animate-scroll-right whitespace-nowrap">
                    <ModernBlueprint3 /> <ModernBlueprint1 /> <ModernBlueprint3 /> <ModernBlueprint1 />
                </div>
                <div className="flex gap-40 animate-scroll-left whitespace-nowrap opacity-50">
                    <ModernBlueprint2 /> <ModernBlueprint3 /> <ModernBlueprint2 /> <ModernBlueprint3 />
                </div>
            </div>

            {/* Glowing Effects */}
            <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-[#3200C1]/20 rounded-full blur-[180px] z-0"></div>
            <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-[#37FFDB]/10 rounded-full blur-[180px] z-0 opacity-40"></div>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col items-center justify-center text-center px-6 relative z-10 w-full max-w-7xl pt-20 pb-10">
                
                <div className="relative group">
                    {/* Glass Container */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-[#3200C1] via-[#37FFDB] to-[#3200C1] rounded-[3rem] blur opacity-20 animate-pulse"></div>
                    
                    <div className="relative bg-[#020010]/60 backdrop-blur-3xl border border-white/10 p-12 md:p-20 rounded-[3rem] shadow-2xl space-y-12 max-w-5xl">
                        
                        <div className="space-y-6">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#37FFDB]/10 border border-[#37FFDB]/20 text-[#37FFDB] text-[10px] font-black uppercase tracking-[0.3em]">
                                <Sparkles className="w-4 h-4" /> Lanzamiento Abril 2026
                            </div>

                            <h1 className="text-6xl md:text-9xl font-black leading-[0.9] tracking-tighter">
                                TU HOGAR <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#37FFDB] via-white to-[#37FFDB] bg-[length:200%_auto] animate-gradient-text">REIMAGINADO</span>
                            </h1>

                            <p className="text-slate-400 text-lg md:text-2xl font-medium max-w-3xl mx-auto leading-relaxed">
                                Estamos consolidando el ecosistema de <span className="text-white font-black">226 constructoras</span> líderes en Chile. Comparar modelos nunca fue tan inteligente.
                            </p>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                            <div className="p-8 rounded-[2.5rem] bg-white/5 border border-white/10 flex flex-col items-center">
                                <Building2 className="w-10 h-10 text-[#3200C1] mb-4" />
                                <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-1">Empresas</span>
                                <p className="text-2xl font-black text-white">+226</p>
                            </div>
                            <div className="p-8 rounded-[2.5rem] bg-white/5 border border-white/10 flex flex-col items-center">
                                <ShieldCheck className="w-10 h-10 text-[#37FFDB] mb-4" />
                                <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-1">Seguridad</span>
                                <p className="text-2xl font-black text-white">Certificada</p>
                            </div>
                            <div className="p-8 rounded-[2.5rem] bg-white/5 border border-white/10 flex flex-col items-center">
                                <Globe className="w-10 h-10 text-emerald-500 mb-4" />
                                <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-1">Cobertura</span>
                                <p className="text-2xl font-black text-white">Todo Chile</p>
                            </div>
                        </div>

                        {/* Contact Buttons */}
                        <div className="pt-6 flex flex-col md:flex-row items-center justify-center gap-6">
                            <a href={`mailto:${contactEmail}`} className="w-full md:w-auto px-10 py-5 bg-white text-[#05001A] rounded-2xl font-black text-sm flex items-center justify-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-white/10">
                                <Mail className="w-5 h-5" /> {contactEmail}
                            </a>
                            <a href={`tel:${contactPhone.replace(/\s+/g, '')}`} className="w-full md:w-auto px-10 py-5 bg-[#3200C1] text-white rounded-2xl font-black text-sm flex items-center justify-center gap-3 hover:brightness-110 active:scale-95 transition-all">
                                <Phone className="w-5 h-5 text-[#37FFDB]" /> {contactPhone}
                            </a>
                        </div>
                    </div>
                </div>
            </main>

            {/* Refined Footer */}
            <footer className="w-full px-10 py-12 relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 border-t border-white/5 bg-[#020010]/80 backdrop-blur-3xl">
                <div className="flex items-center gap-4">
                    {logoUrl ? (
                        <img src={logoUrl} alt={siteName} className="h-10 md:h-12 w-auto grayscale brightness-200" />
                    ) : (
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-[#3200C1] flex items-center justify-center">
                                <Hash className="w-6 h-6 text-[#37FFDB]" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xl font-black tracking-tight leading-none">{siteName.toUpperCase()}</span>
                                <span className="text-[9px] font-black text-[#37FFDB] tracking-[0.3em]">PRÓXIMAMENTE 2026</span>
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-10 text-[11px] font-black text-slate-500 tracking-[0.3em] uppercase">
                    <div className="flex items-center gap-3">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#37FFDB] animate-pulse"></span>
                        <span className="text-white">Site Deployment</span>
                    </div>
                    <span className="hidden lg:block opacity-40">Solocasaschile v2.0.0</span>
                    <span className="hidden lg:block">Chile</span>
                </div>
            </footer>
        </div>
    );
}

// MODERN Blueprint SVG Components
function ModernBlueprint1() {
    return (
        <svg width="300" height="200" viewBox="0 0 300 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
            {/* Boxy Modern House */}
            <rect x="20" y="60" width="120" height="100" stroke="white" strokeWidth="0.5" strokeDasharray="4 4" />
            <rect x="140" y="40" width="100" height="120" stroke="white" strokeWidth="0.5" strokeDasharray="4 4" />
            <rect x="60" y="80" width="40" height="40" stroke="white" strokeWidth="0.5" />
            <rect x="160" y="60" width="60" height="80" stroke="white" strokeWidth="0.5" />
            {/* Outline path */}
            <path d="M20 160 H240 M140 40 V160" stroke="white" strokeWidth="0.2" />
        </svg>
    );
}

function ModernBlueprint2() {
    return (
        <svg width="300" height="200" viewBox="0 0 300 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
            {/* Minimalist Multi-level */}
            <rect x="40" y="100" width="220" height="60" stroke="white" strokeWidth="0.5" strokeDasharray="4 4" />
            <rect x="60" y="40" width="100" height="60" stroke="white" strokeWidth="0.5" strokeDasharray="4 4" />
            <line x1="60" y1="40" x2="260" y2="40" stroke="white" strokeWidth="0.5" strokeDasharray="2 2" />
            <circle cx="200" cy="70" r="15" stroke="white" strokeWidth="0.5" strokeDasharray="4 4" />
        </svg>
    );
}

function ModernBlueprint3() {
    return (
        <svg width="300" height="200" viewBox="0 0 300 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
            {/* Geometry house */}
            <path d="M20 160 L100 80 L180 160 Z" stroke="white" strokeWidth="0.5" strokeDasharray="4 4" />
            <rect x="180" y="80" width="100" height="80" stroke="white" strokeWidth="0.5" strokeDasharray="4 4" />
            <path d="M100 80 H280" stroke="white" strokeWidth="0.5" strokeDasharray="2 2" />
        </svg>
    );
}
