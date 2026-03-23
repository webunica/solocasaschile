import { Building2, MapPin, Mail, Sparkles, Phone, Hash } from "lucide-react";
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
        <div className="min-h-screen bg-[#020010] text-white selection:bg-[#37FFDB] selection:text-[#020010] overflow-hidden flex flex-col items-center justify-between relative font-sans">
            
            {/* Background Blueprint Animation */}
            <div className="absolute inset-0 z-0 flex flex-col justify-around opacity-10 pointer-events-none">
                <div className="flex gap-20 animate-scroll-left whitespace-nowrap">
                    <BlueprintHouse /> <BlueprintHouse /> <BlueprintHouse /> <BlueprintHouse />
                </div>
                <div className="flex gap-20 animate-scroll-right whitespace-nowrap">
                    <BlueprintHouseAlt /> <BlueprintHouseAlt /> <BlueprintHouseAlt /> <BlueprintHouseAlt />
                </div>
                <div className="flex gap-20 animate-scroll-left whitespace-nowrap opacity-50">
                    <BlueprintHouse /> <BlueprintHouse /> <BlueprintHouse /> <BlueprintHouse />
                </div>
            </div>

            {/* Glowing Orbs */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-[#3200C1]/10 rounded-full blur-[120px] z-0"></div>

            {/* Main Content */}
            <main className="flex-1 flex flex-col items-center justify-center text-center px-6 relative z-10 space-y-8 max-w-4xl pt-20">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#37FFDB]/10 border border-[#37FFDB]/20 text-[#37FFDB] text-[10px] font-black uppercase tracking-widest">
                    <Sparkles className="w-3.5 h-3.5" /> Estreno Próximo
                </div>

                <div className="space-y-4">
                    <h1 className="text-5xl md:text-8xl font-black leading-[1.1] tracking-tighter">
                        CONSTRUYENDO EL <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#37FFDB] to-[#3200C1]">COMPARADOR IDEAL</span>
                    </h1>
                    <p className="text-slate-400 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed">
                        Estamos integrando los catálogos de más de <span className="text-white font-black">226 constructoras</span> para que tomes la mejor decisión al comprar tu próxima casa en Chile.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-6 pt-6">
                    <div className="flex items-center gap-3 text-slate-400 group cursor-default">
                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-[#37FFDB]/30 transition-colors">
                            <Mail className="w-4 h-4 text-[#37FFDB]" />
                        </div>
                        <span className="text-sm font-bold">admin@solocasaschile.com</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-400 group cursor-default">
                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-[#3200C1]/30 transition-colors">
                            <Phone className="w-4 h-4 text-[#3200C1]" />
                        </div>
                        <span className="text-sm font-bold">{contactPhone}</span>
                    </div>
                </div>
            </main>

            {/* Bottom Footer - Minimalist */}
            <footer className="w-full px-10 py-12 relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 border-t border-white/5 bg-[#020010]/80 backdrop-blur-xl">
                {/* Logo Section */}
                <div className="flex items-center gap-4">
                    {logoUrl ? (
                        <img src={logoUrl} alt={siteName} className="h-8 md:h-10 w-auto opacity-80" />
                    ) : (
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-[#37FFDB] flex items-center justify-center">
                                <Hash className="w-5 h-5 text-[#3200C1]" />
                            </div>
                            <span className="text-lg font-black tracking-tight">{siteName}</span>
                        </div>
                    )}
                </div>

                {/* Status Indicator */}
                <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#37FFDB] animate-ping"></span>
                        <span className="text-white">Live Tuning</span>
                    </div>
                    <span className="hidden sm:block">Deployment 2024</span>
                    <span className="hidden sm:block opacity-30">Chile</span>
                </div>

                {/* Subtle Access for Admin */}
                <Link href="/dashboard" className="text-[10px] font-bold text-white/5 hover:text-white/40 transition-all uppercase tracking-widest">
                    Panel Admin
                </Link>
            </footer>

        </div>
    );
}

// SVG Components for Blueprints
function BlueprintHouse() {
    return (
        <svg width="240" height="180" viewBox="0 0 240 180" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
            <rect x="20" y="80" width="200" height="80" stroke="white" strokeWidth="0.5" strokeDasharray="4 4" />
            <path d="M20 80 L120 20 L220 80" stroke="white" strokeWidth="0.5" strokeDasharray="4 4" />
            <rect x="100" y="110" width="40" height="50" stroke="white" strokeWidth="0.5" strokeDasharray="2 2" />
            <rect x="40" y="100" width="30" height="30" stroke="white" strokeWidth="0.5" strokeDasharray="2 2" />
            <rect x="170" y="100" width="30" height="30" stroke="white" strokeWidth="0.5" strokeDasharray="2 2" />
            {/* Measurement lines */}
            <path d="M20 170 L220 170" stroke="white" strokeWidth="0.2" />
            <path d="M20 165 L20 175M220 165 L220 175" stroke="white" strokeWidth="0.2" />
        </svg>
    );
}

function BlueprintHouseAlt() {
    return (
        <svg width="240" height="180" viewBox="0 0 240 180" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
            <rect x="40" y="60" width="160" height="100" stroke="white" strokeWidth="0.5" strokeDasharray="4 4" />
            <path d="M40 60 L120 10 L200 60" stroke="white" strokeWidth="0.5" strokeDasharray="4 4" />
            <path d="M80 60 V160M160 60 V160" stroke="white" strokeWidth="0.3" strokeDasharray="2 2" />
            <circle cx="120" cy="40" r="10" stroke="white" strokeWidth="0.5" strokeDasharray="2 2" />
        </svg>
    );
}
