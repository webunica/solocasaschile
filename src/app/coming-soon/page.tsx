import { Building2, MapPin, Mail, Sparkles, Phone, Hash, Globe, ShieldCheck, Zap } from "lucide-react";
import Link from "next/link";
import { sanityClient } from "@/lib/sanity.client";

export const metadata = {
    title: "Próximamente | solocasaschile.com",
    description: "La plataforma definitiva para comparar constructoras de casas prefabricadas y sólidas en Chile. Lanzamiento 2024.",
};

export default async function ComingSoonPage({ searchParams }: { searchParams: { dev?: string } }) {
    
    const settings = await sanityClient.fetch(`*[_type == "siteSettings"][0]{
        site_name,
        contact_phones,
        "logo_url": site_logo.asset->url
    }`);

    const siteName = settings?.site_name || "solocasaschile.com";
    const contactPhone = settings?.contact_phones?.[0] || "+56 9 6413 0601";
    const logoUrl = settings?.logo_url || null;

    return (
        <div className="min-h-screen bg-[#05001A] text-white selection:bg-[#37FFDB] selection:text-[#05001A] overflow-hidden flex flex-col items-center justify-between relative font-sans">
            
            {/* Background Blueprint Animation - Static lines with slow float */}
            <div className="absolute inset-0 z-0 flex flex-col justify-around opacity-[0.05] pointer-events-none">
                <div className="flex gap-40 animate-scroll-left whitespace-nowrap">
                    <BlueprintHouse /> <BlueprintHouse /> <BlueprintHouse /> <BlueprintHouse />
                </div>
                <div className="flex gap-40 animate-scroll-right whitespace-nowrap">
                    <BlueprintHouseAlt /> <BlueprintHouseAlt /> <BlueprintHouseAlt /> <BlueprintHouseAlt />
                </div>
            </div>

            {/* Premium Glowing Background */}
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#3200C1]/20 rounded-full blur-[180px] z-0 animate-pulse"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#37FFDB]/10 rounded-full blur-[180px] z-0 opacity-50"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40%] h-[40%] bg-[#3200C1]/5 rounded-full blur-[120px] z-0"></div>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col items-center justify-center text-center px-6 relative z-10 w-full max-w-7xl pt-20 pb-10">
                
                {/* Float Card Container */}
                <div className="relative group">
                    {/* Glowing Backgrop */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-[#3200C1] to-[#37FFDB] rounded-[3rem] blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
                    
                    <div className="relative bg-[#05001A]/60 backdrop-blur-3xl border border-white/10 p-10 md:p-16 rounded-[3rem] shadow-2xl space-y-12 max-w-4xl">
                        
                        <div className="space-y-6">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#37FFDB]/10 border border-[#37FFDB]/20 text-[#37FFDB] text-[10px] font-black uppercase tracking-[0.2em]">
                                <Sparkles className="w-4 h-4 animate-spin-slow" /> Lanzamiento Inminente
                            </div>

                            <h1 className="text-5xl md:text-8xl font-black leading-[0.95] tracking-tighter">
                                EL FUTURO DE <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#37FFDB] via-[#3200C1] to-[#37FFDB] bg-[length:200%_auto] animate-gradient-text">TU PROPIO HOGAR</span>
                            </h1>

                            <p className="text-slate-400 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed">
                                Estamos auditando <span className="text-white font-black underline decoration-[#37FFDB]">226 constructoras</span> para que compares precios y modelos con transparencia total.
                            </p>
                        </div>

                        {/* Interactive Info Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            <div className="p-6 rounded-3xl bg-white/5 border border-white/10 hover:border-[#37FFDB]/30 transition-all group/card">
                                <Building2 className="w-8 h-8 text-[#3200C1] mb-3 group-hover/card:scale-110 transition-transform" />
                                <h3 className="text-xs font-black uppercase text-slate-500 tracking-widest mb-1">Catálogo</h3>
                                <p className="text-xl font-black text-white">+5.000 Modelos</p>
                            </div>
                            <div className="p-6 rounded-3xl bg-white/5 border border-white/10 hover:border-[#37FFDB]/30 transition-all group/card">
                                <ShieldCheck className="w-8 h-8 text-emerald-500 mb-3 group-hover/card:scale-110 transition-transform" />
                                <h3 className="text-xs font-black uppercase text-slate-500 tracking-widest mb-1">Confianza</h3>
                                <p className="text-xl font-black text-white">Sello Certificado</p>
                            </div>
                            <div className="p-6 rounded-3xl bg-white/5 border border-white/10 hover:border-[#37FFDB]/30 transition-all group/card">
                                <Globe className="w-8 h-8 text-[#37FFDB] mb-3 group-hover/card:scale-110 transition-transform" />
                                <h3 className="text-xs font-black uppercase text-slate-500 tracking-widest mb-1">Alcance</h3>
                                <p className="text-xl font-black text-white">16 Regiones</p>
                            </div>
                        </div>

                        {/* Contact CTA */}
                        <div className="pt-4 flex flex-col md:flex-row items-center justify-center gap-4">
                            <a href="mailto:admin@solocasaschile.com" className="w-full md:w-auto px-8 py-4 bg-white text-[#05001A] rounded-2xl font-black text-sm flex items-center justify-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-white/5">
                                <Mail className="w-4 h-4" /> admin@solocasaschile.com
                            </a>
                            <div className="w-full md:w-auto px-8 py-4 bg-[#3200C1]/20 border border-[#3200C1]/40 text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2">
                                <Phone className="w-4 h-4 text-[#37FFDB]" /> {contactPhone}
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Enhanced Modern Footer */}
            <footer className="w-full px-8 py-10 relative z-10">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 p-8 rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-md">
                    {/* Logo Section */}
                    <div className="flex items-center gap-4">
                        {logoUrl ? (
                            <img src={logoUrl} alt={siteName} className="h-8 md:h-12 w-auto" />
                        ) : (
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-2xl bg-[#3200C1] flex items-center justify-center shadow-lg shadow-[#3200C1]/40">
                                    <Hash className="w-6 h-6 text-[#37FFDB]" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xl font-black tracking-tight leading-none uppercase">{siteName.split('.')[0]}</span>
                                    <span className="text-[10px] font-bold text-[#37FFDB] tracking-widest uppercase">PROYECTO ALPHA</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Meta Info */}
                    <div className="flex flex-wrap items-center justify-center gap-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.25em]">
                        <div className="flex items-center gap-2">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#37FFDB] opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#37FFDB]"></span>
                            </span>
                            <span className="text-white">Servidor Activo</span>
                        </div>
                        <span>Chile v1.0.4</span>
                        <span>Lanzamiento 2024</span>
                    </div>

                    {/* Admin Trigger */}
                    <Link href="/dashboard" className="px-5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-all border border-white/5">
                        Admin
                    </Link>
                </div>
            </footer>

            {/* Global animations moved to globals.css in previous step, but adding dynamic ones here for better UX if supported */}
        </div>
    );
}

// SVG Components for Blueprints
function BlueprintHouse() {
    return (
        <svg width="240" height="180" viewBox="0 0 240 180" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
            <rect x="20" y="80" width="200" height="80" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 4" className="text-white/20" />
            <path d="M20 80 L120 20 L220 80" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 4" className="text-white/20" />
            <rect x="100" y="110" width="40" height="50" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 2" className="text-white/10" />
        </svg>
    );
}

function BlueprintHouseAlt() {
    return (
        <svg width="240" height="180" viewBox="0 0 240 180" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
            <rect x="40" y="60" width="160" height="100" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 4" className="text-white/20" />
            <path d="M40 60 L120 10 L200 60" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 4" className="text-white/20" />
            <circle cx="120" cy="40" r="10" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 2" className="text-white/10" />
        </svg>
    );
}
