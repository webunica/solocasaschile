import { Mail, Sparkles, Phone, Hash, Globe, ShieldCheck, Building2, MousePointer2 } from "lucide-react";
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
        <div className="min-h-screen bg-[#FDFDFF] text-[#1A1A1A] selection:bg-[#3200C1] selection:text-white overflow-hidden flex flex-col items-center justify-between relative font-sans antialiased">
            
            {/* Background Architecture - Very subtle fine lines */}
            <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none">
                <div className="absolute inset-0" style={{ 
                    backgroundImage: 'radial-gradient(#000 0.5px, transparent 0.5px)', 
                    backgroundSize: '40px 40px' 
                }}></div>
                
                {/* Floating Detailed Blueprints */}
                <div className="absolute top-[10%] left-[5%] animate-float-slow">
                    <DetailedBlueprint />
                </div>
                <div className="absolute bottom-[10%] right-[5%] animate-float-delayed">
                    <DetailedBlueprintAlt />
                </div>
            </div>

            {/* Subtle Gradient Glows (Light mode style) */}
            <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-[#3200C1]/5 rounded-full blur-[120px] z-0"></div>
            <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-[#37FFDB]/5 rounded-full blur-[120px] z-0"></div>

            {/* Header / Logo Area */}
            <header className="w-full px-10 py-10 relative z-10 flex justify-between items-center max-w-7xl">
                <div className="flex items-center gap-3">
                    {logoUrl ? (
                        <img src={logoUrl} alt={siteName} className="h-8 md:h-9 w-auto grayscale contrast-125" />
                    ) : (
                        <div className="flex items-center gap-2.5">
                            <div className="w-9 h-9 rounded-lg bg-[#3200C1] flex items-center justify-center shadow-lg shadow-[#3200C1]/10">
                                <Hash className="w-5.5 h-5.5 text-white" />
                            </div>
                            <span className="text-xl font-bold tracking-tight text-[#3200C1]">{siteName.toUpperCase()}</span>
                        </div>
                    )}
                </div>
                <div className="hidden md:flex items-center gap-6 text-[10px] font-bold uppercase tracking-[0.2em] text-[#A0A0A0]">
                    <span>Architecture</span>
                    <span className="w-1 h-1 rounded-full bg-[#3200C1]"></span>
                    <span>Technology</span>
                    <span className="w-1 h-1 rounded-full bg-[#3200C1]"></span>
                    <span>Chile</span>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col items-center justify-center text-center px-6 relative z-10 w-full max-w-5xl space-y-12">
                
                <div className="space-y-8">
                    <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#3200C1]/5 border border-[#3200C1]/10 text-[#3200C1] text-[10px] font-bold uppercase tracking-[0.25em]">
                        <Sparkles className="w-3.5 h-3.5" /> Estreno Abril 2026
                    </div>

                    <div className="space-y-4">
                        <h1 className="text-5xl md:text-8xl font-medium leading-[1] tracking-tight text-[#1A1A1A]">
                            Comparar casas nunca <br />
                            <span className="font-light italic text-[#3200C1]">fue tan sofisticado.</span>
                        </h1>
                        <p className="text-slate-500 text-lg md:text-2xl font-normal max-w-3xl mx-auto leading-relaxed">
                            Diseñando el directorio más completo de <span className="text-[#3200C1] font-semibold">226 constructoras</span>. 
                            Transparencia y diseño en cada detalle.
                        </p>
                    </div>
                </div>

                {/* Delicate Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl">
                    <div className="group p-8 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-[#3200C1]/5 transition-all duration-500 flex flex-col items-center text-center">
                        <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center mb-6 group-hover:bg-[#3200C1] transition-colors duration-500">
                            <Building2 className="w-6 h-6 text-[#3200C1] group-hover:text-white transition-colors duration-500" />
                        </div>
                        <h3 className="text-xs font-bold uppercase text-slate-400 tracking-widest mb-1">Catálogo</h3>
                        <p className="text-xl font-medium text-[#1A1A1A]">+5.000 Modelos</p>
                    </div>
                    <div className="group p-8 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-[#3200C1]/5 transition-all duration-500 flex flex-col items-center text-center">
                        <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center mb-6 group-hover:bg-[#3200C1] transition-colors duration-500">
                            <ShieldCheck className="w-6 h-6 text-[#3200C1] group-hover:text-white transition-colors duration-500" />
                        </div>
                        <h3 className="text-xs font-bold uppercase text-slate-400 tracking-widest mb-1">Calidad</h3>
                        <p className="text-xl font-medium text-[#1A1A1A]">Sello de Confianza</p>
                    </div>
                    <div className="group p-8 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-[#3200C1]/5 transition-all duration-500 flex flex-col items-center text-center">
                        <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center mb-6 group-hover:bg-[#3200C1] transition-colors duration-500">
                            <Globe className="w-6 h-6 text-[#3200C1] group-hover:text-white transition-colors duration-500" />
                        </div>
                        <h3 className="text-xs font-bold uppercase text-slate-400 tracking-widest mb-1">Alcance</h3>
                        <p className="text-xl font-medium text-[#1A1A1A]">Todo Chile</p>
                    </div>
                </div>

                {/* Contact Section - Minimalist */}
                <div className="pt-8 flex flex-col md:flex-row items-center justify-center gap-10 text-slate-400 font-medium text-sm">
                    <a href={`mailto:${contactEmail}`} className="flex items-center gap-3 hover:text-[#3200C1] transition-colors">
                        <Mail className="w-4.5 h-4.5" /> {contactEmail}
                    </a>
                    <a href={`tel:${contactPhone.replace(/\s+/g, '')}`} className="flex items-center gap-3 hover:text-[#3200C1] transition-colors">
                        <Phone className="w-4.5 h-4.5" /> {contactPhone}
                    </a>
                </div>
            </main>

            {/* Footer / Status */}
            <footer className="w-full px-10 py-12 relative z-10 flex flex-col md:flex-row justify-between items-center gap-6 max-w-7xl border-t border-slate-100">
                <p className="text-[#A0A0A0] text-[10px] font-bold uppercase tracking-widest">
                    © 2024 solocasaschile.com — Todos los derechos reservados.
                </p>
                <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.2em] text-[#3200C1]">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#3200C1] opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#3200C1]"></span>
                    </span>
                    <span>Auditando Sistemas</span>
                </div>
            </footer>

        </div>
    );
}

// DELICATE Blueprint SVG Components
function DetailedBlueprint() {
    return (
        <svg width="400" height="300" viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-40">
            <rect x="50" y="50" width="300" height="200" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 4" />
            <path d="M50 150 H350 M200 50 V250" stroke="currentColor" strokeWidth="0.3" strokeDasharray="1 2" />
            <rect x="70" y="70" width="100" height="60" stroke="currentColor" strokeWidth="0.5" />
            <rect x="230" y="70" width="100" height="100" stroke="currentColor" strokeWidth="0.5" />
            <path d="M70 200 Q150 180 230 200" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 2" />
        </svg>
    );
}

function DetailedBlueprintAlt() {
    return (
        <svg width="400" height="300" viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-40">
            <circle cx="200" cy="150" r="100" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 8" />
            <path d="M100 150 L200 50 L300 150 L200 250 Z" stroke="currentColor" strokeWidth="0.3" />
            <rect x="150" y="100" width="100" height="100" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 2" />
        </svg>
    );
}
