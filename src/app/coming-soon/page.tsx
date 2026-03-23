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
    const contactPhone = "+56 9 6619 8752";
    const contactEmail = "ventas@solocasaschile.com";
    const logoUrl = settings?.logo_url || null;

    return (
        <div className="min-h-screen bg-white text-[#3200C1] selection:bg-[#3200C1] selection:text-white overflow-hidden flex flex-col items-center justify-between relative font-sans antialiased">
            
            {/* Background Carousel of Modern Models */}
            <div className="absolute inset-0 z-0 flex flex-col justify-around py-20 pointer-events-none opacity-[0.08]">
                <div className="flex gap-40 animate-scroll-left whitespace-nowrap">
                    <ModernBlueprint color="#3200C1" /> <ModernBlueprint color="#37FFDB" /> <ModernBlueprint color="#3200C1" /> <ModernBlueprint color="#37FFDB" />
                </div>
                <div className="flex gap-40 animate-scroll-right whitespace-nowrap">
                    <ModernBlueprint variant="alt" color="#37FFDB" /> <ModernBlueprint variant="alt" color="#3200C1" /> <ModernBlueprint variant="alt" color="#37FFDB" /> <ModernBlueprint variant="alt" color="#3200C1" />
                </div>
                <div className="flex gap-40 animate-scroll-left whitespace-nowrap">
                    <ModernBlueprint color="#3200C1" /> <ModernBlueprint color="#37FFDB" /> <ModernBlueprint color="#3200C1" /> <ModernBlueprint color="#37FFDB" />
                </div>
            </div>

            {/* Header Area */}
            <header className="w-full px-10 py-12 relative z-10 flex flex-col items-center gap-8">
                <div className="flex items-center gap-4">
                    {logoUrl ? (
                        <img 
                            src={logoUrl} 
                            alt={siteName} 
                            className="h-12 md:h-16 w-auto drop-shadow-sm" 
                        />
                    ) : (
                        <div className="flex items-center gap-3">
                            <div className="w-14 h-14 rounded-2xl bg-[#3200C1] flex items-center justify-center shadow-xl shadow-[#3200C1]/20">
                                <Hash className="w-8 h-8 text-[#37FFDB]" />
                            </div>
                            <span className="text-3xl font-black tracking-tighter text-[#3200C1] uppercase">
                                {siteName.split('.')[0]}
                            </span>
                        </div>
                    )}
                </div>
                <div className="h-px w-20 bg-gradient-to-r from-transparent via-[#37FFDB] to-transparent"></div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col items-center justify-center text-center px-6 relative z-10 w-full max-w-5xl space-y-12 pb-20">
                
                <div className="space-y-6">
                    <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-[#3200C1] text-[#37FFDB] text-[10px] font-black uppercase tracking-[0.3em] shadow-lg shadow-[#3200C1]/20">
                        <Sparkles className="w-4 h-4" /> Estreno Abril 2026
                    </div>

                    <h1 className="text-6xl md:text-9xl font-black leading-[0.9] tracking-tighter text-[#3200C1]">
                        TU HOGAR <br />
                        <span className="text-[#37FFDB]">EVOLUCIONADO</span>
                    </h1>
                    
                    <p className="text-slate-500 text-lg md:text-2xl font-medium max-w-3xl mx-auto leading-relaxed">
                        Estamos integrando el catálogo digital más grande de <br className="hidden md:block" />
                        <span className="text-[#3200C1] font-black underline decoration-[#37FFDB] decoration-4 underline-offset-4">226 constructoras</span> para tu próxima decisión.
                    </p>
                </div>

                {/* New Refined Info Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
                    <div className="p-8 rounded-[2.5rem] bg-slate-50 border border-slate-100 flex flex-col items-center group hover:bg-white hover:shadow-2xl hover:shadow-[#3200C1]/10 transition-all duration-500">
                        <Building2 className="w-10 h-10 text-[#3200C1] mb-4 group-hover:scale-110 transition-transform" />
                        <p className="text-2xl font-black text-[#3200C1]">+5.000</p>
                        <span className="text-[10px] font-bold uppercase text-slate-400 tracking-widest leading-none mt-1">Modelos Únicos</span>
                    </div>
                    <div className="p-8 rounded-[2.5rem] bg-slate-50 border border-slate-100 flex flex-col items-center group hover:bg-white hover:shadow-2xl hover:shadow-[#3200C1]/10 transition-all duration-500">
                        <ShieldCheck className="w-10 h-10 text-[#37FFDB] mb-4 group-hover:scale-110 transition-transform" />
                        <p className="text-2xl font-black text-[#3200C1]">Certificado</p>
                        <span className="text-[10px] font-bold uppercase text-slate-400 tracking-widest leading-none mt-1">Calidad Garantizada</span>
                    </div>
                    <div className="p-8 rounded-[2.5rem] bg-slate-50 border border-slate-100 flex flex-col items-center group hover:bg-white hover:shadow-2xl hover:shadow-[#3200C1]/10 transition-all duration-500">
                        <Globe className="w-10 h-10 text-emerald-500 mb-4 group-hover:scale-110 transition-transform" />
                        <p className="text-2xl font-black text-[#3200C1]">Nacional</p>
                        <span className="text-[10px] font-bold uppercase text-slate-400 tracking-widest leading-none mt-1">Todas las Regiones</span>
                    </div>
                </div>

                <div className="pt-6 flex flex-col md:flex-row items-center justify-center gap-8">
                    <a href={`mailto:${contactEmail}`} className="flex items-center gap-3 text-slate-600 hover:text-[#3200C1] transition-colors font-bold text-sm">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
                            <Mail className="w-4.5 h-4.5 text-[#3200C1]" />
                        </div>
                        {contactEmail}
                    </a>
                    <a href={`tel:${contactPhone.replace(/\s+/g, '')}`} className="flex items-center gap-3 text-slate-600 hover:text-[#3200C1] transition-colors font-bold text-sm">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
                            <Phone className="w-4.5 h-4.5 text-[#3200C1]" />
                        </div>
                        {contactPhone}
                    </a>
                    <a href="tel:+56964130601" className="flex items-center gap-3 text-slate-600 hover:text-[#3200C1] transition-colors font-bold text-sm">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
                            <Phone className="w-4.5 h-4.5 text-[#3200C1]" />
                        </div>
                        +56 9 6413 0601
                    </a>
                </div>
            </main>

            {/* Footer */}
            <footer className="w-full px-10 py-10 relative z-10 flex flex-col md:flex-row justify-between items-center gap-6 border-t border-slate-100 bg-white">
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em]">
                    © 2024 solocasaschile.com — El Comparador de Chile
                </p>
                <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] text-[#3200C1]/30">
                    <span className="text-amber-500">Modo Desarrollo</span>
                    <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                    <span>Deployment 2026</span>
                </div>
            </footer>
        </div>
    );
}

// MODERN Blueprint SVG Components with Color Props
function ModernBlueprint({ color = "#3200C1", variant = "base" }: { color?: string; variant?: string }) {
    if (variant === "alt") {
        return (
            <svg width="280" height="180" viewBox="0 0 280 180" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
                <rect x="40" y="60" width="160" height="100" stroke={color} strokeWidth="1" strokeDasharray="4 4" />
                <path d="M40 60 L120 10 L200 60" stroke={color} strokeWidth="1" strokeDasharray="4 4" />
                <rect x="70" y="100" width="40" height="60" stroke={color} strokeWidth="0.5" />
                <rect x="140" y="80" width="40" height="40" stroke={color} strokeWidth="0.5" />
            </svg>
        );
    }
    return (
        <svg width="280" height="180" viewBox="0 0 280 180" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
            <rect x="20" y="80" width="120" height="80" stroke={color} strokeWidth="1" strokeDasharray="4 4" />
            <rect x="140" y="40" width="100" height="120" stroke={color} strokeWidth="1" strokeDasharray="4 4" />
            <rect x="60" y="110" width="40" height="50" stroke={color} strokeWidth="0.5" />
            <path d="M20 160 H240" stroke={color} strokeWidth="0.5" strokeDasharray="2 2" />
        </svg>
    );
}
