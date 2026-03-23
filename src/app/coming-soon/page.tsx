import { Building2, MapPin, Mail, ArrowRight, ShieldCheck, Sparkles, Zap, Lock } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export const metadata = {
    title: "Próximamente | solocasaschile.com",
    description: "La plataforma definitiva para comparar constructoras de casas prefabricadas y sólidas en Chile. Lanzamiento 2024.",
};

export default function ComingSoonPage({ searchParams }: { searchParams: { dev?: string } }) {
    // Si el usuario quiere ver el sitio (usando ?dev=true), lo dejamos navegar. No es seguro, pero es funcional para ajustes.
    // Opcional: Podríamos dejar el redireccionamiento para que el usuario elija.

    return (
        <div className="min-h-screen bg-[#05001A] text-white selection:bg-[#37FFDB] selection:text-[#05001A] overflow-hidden flex flex-col items-center justify-center relative font-sans">
            
            {/* Background elements */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[50%] bg-[#3200C1]/20 rounded-full blur-[150px] animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[50%] bg-[#37FFDB]/10 rounded-full blur-[150px] opacity-20"></div>
                
                {/* Dots grid */}
                <div className="absolute inset-0 opacity-10" style={{ 
                    backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', 
                    backgroundSize: '24px 24px' 
                }}></div>
            </div>

            {/* Container */}
            <main className="max-w-6xl w-full mx-auto px-6 py-20 relative z-10 flex flex-col lg:flex-row items-center gap-16">
                
                {/* Left Content - Information */}
                <div className="flex-1 space-y-10 text-center lg:text-left">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#37FFDB]/10 border border-[#37FFDB]/20 text-[#37FFDB] text-[10px] font-black uppercase tracking-widest animate-bounce">
                        <Sparkles className="w-3.5 h-3.5" /> Estreno muy pronto
                    </div>

                    <div className="space-y-4">
                        <h1 className="text-5xl md:text-8xl font-black leading-tight tracking-tight">
                            El futuro de tu <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#37FFDB] to-[#3200C1]">nuevo hogar.</span>
                        </h1>
                        <p className="text-lg md:text-xl text-slate-400 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                            Estamos ajustando los últimos detalles para brindarte el comparador más preciso de todas las 
                            <span className="text-white font-bold"> constructoras de Chile</span>. Transparencia, calidad y variedad en un solo lugar.
                        </p>
                    </div>

                    {/* Basic Info - Features Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto lg:mx-0">
                        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-[#3200C1]/20 flex items-center justify-center shrink-0">
                                <Building2 className="w-5 h-5 text-[#3200C1]" />
                            </div>
                            <div className="text-left">
                                <p className="text-xs font-bold text-slate-500 uppercase">Empresas</p>
                                <p className="text-sm font-black text-white">+226 Constructoras</p>
                            </div>
                        </div>
                        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center shrink-0">
                                <ShieldCheck className="w-5 h-5 text-emerald-500/80" />
                            </div>
                            <div className="text-left">
                                <p className="text-xs font-bold text-slate-500 uppercase">Calidad</p>
                                <p className="text-sm font-black text-white">Sello Verificado</p>
                            </div>
                        </div>
                        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center shrink-0">
                                <Zap className="w-5 h-5 text-amber-500/80" />
                            </div>
                            <div className="text-left">
                                <p className="text-xs font-bold text-slate-500 uppercase">Velocidad</p>
                                <p className="text-sm font-black text-white">Cotizador Rápido</p>
                            </div>
                        </div>
                        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-[#37FFDB]/20 flex items-center justify-center shrink-0">
                                <MapPin className="w-5 h-5 text-[#37FFDB]" />
                            </div>
                            <div className="text-left">
                                <p className="text-xs font-bold text-slate-500 uppercase">Alcance</p>
                                <p className="text-sm font-black text-white">Todo Chile</p>
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                        <a 
                            href="mailto:admin@solocasaschile.com" 
                            className="w-full sm:w-auto px-8 py-4 bg-white text-[#05001A] rounded-2xl font-black text-sm flex items-center justify-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-white/5"
                        >
                            <Mail className="w-4 h-4" /> admin@solocasaschile.com
                        </a>
                        <Link 
                            href="/dashboard"
                            className="w-full sm:w-auto px-8 py-4 bg-[#3200C1]/20 border border-[#3200C1] text-white rounded-2xl font-bold text-sm hover:bg-[#3200C1] transition-all flex items-center justify-center gap-2"
                        >
                            Acceso Panel <Lock className="w-4 h-4" />
                        </Link>
                    </div>
                </div>

                {/* Right Area - Visual - A Card Preview */}
                <div className="flex-1 w-full max-w-md perspective-1000 hidden lg:block">
                    <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl p-1 rounded-[3rem] border border-white/10 shadow-2xl relative animate-float">
                        <div className="bg-[#05001A]/80 rounded-[2.8rem] p-10 space-y-8 overflow-hidden relative">
                            {/* Logo */}
                            <div className="w-16 h-16 bg-[#3200C1] rounded-2xl flex items-center justify-center">
                                <span className="text-2xl font-black text-[#37FFDB]">SC</span>
                            </div>

                            <div className="space-y-4">
                                <div className="h-6 w-32 bg-white/10 rounded-full"></div>
                                <h3 className="text-2xl font-bold">Solocasaschile v1.0</h3>
                                <div className="space-y-2">
                                    <div className="h-3 w-full bg-white/5 rounded-full"></div>
                                    <div className="h-3 w-[80%] bg-white/5 rounded-full"></div>
                                    <div className="h-3 w-[40%] bg-white/5 rounded-full"></div>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-white/10 flex justify-between items-center text-xs text-slate-500 font-bold uppercase">
                                <span>Status: Testing</span>
                                <span className="text-[#37FFDB]">Alpha Deployment</span>
                            </div>

                            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#37FFDB] rounded-full blur-[80px] opacity-10"></div>
                        </div>
                    </div>
                </div>
            </main>

            <footer className="w-full max-w-7xl mx-auto px-6 py-10 relative z-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-slate-500 text-xs font-bold uppercase tracking-widest mb-10">
                <div>© 2024 solocasaschile.com — Todos los derechos reservados.</div>
                <div className="flex items-center gap-8">
                    <Link href="/registro" className="hover:text-white transition-all">Empresas</Link>
                    <Link href="/empresas-construccion" className="hover:text-white transition-all">Directorio</Link>
                    {/* Bypass link for dev adjustments */}
                    <Link href="/empresas-construccion?dev=true" className="text-white/20 hover:text-white transition-all">Ver Site Actual</Link>
                </div>
            </footer>
        </div>
    );
}

// Add float animation to global CSS via inline style for simplicity or let user know
