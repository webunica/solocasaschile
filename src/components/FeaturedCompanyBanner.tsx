import { ArrowRight, Star, ShieldCheck, Zap } from "lucide-react";

export function FeaturedCompanyBanner() {
    return (
        <section className="max-w-[1600px] w-full mx-auto px-6 mb-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Primer Banner */}
                <div className="relative w-full h-[400px] overflow-hidden rounded-[4px] bg-slate-50 border border-slate-100 group shadow-sm flex flex-col justify-end">
                    <div className="absolute inset-0">
                        <img
                            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop"
                            alt="Casas Chile"
                            className="w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 to-transparent" />
                    </div>

                    <div className="relative p-8 md:p-10">
                        <div className="inline-flex w-fit items-center gap-2 mb-4 px-3 py-1 rounded-[4px] bg-[#37FFDB] text-[#3200C1] text-[10px] font-black uppercase tracking-widest shadow-sm">
                            Destacado
                        </div>
                        <h2 className="text-3xl md:text-4xl font-black text-[#3200C1] mb-2 drop-shadow-sm">
                            Box Panel Chile
                        </h2>
                        <p className="text-lg font-bold text-slate-600 mb-6 max-w-sm">
                            Calidad garantizada en cada panel. Prefabricadas con los más altos estándares.
                        </p>
                        <a
                            href="/?company=Box+Panel+Chile"
                            className="brand-button-primary"
                        >
                            Ver Modelos <ArrowRight className="w-5 h-5" />
                        </a>
                    </div>
                </div>

                {/* Segundo Banner */}
                <div className="relative w-full h-[400px] overflow-hidden rounded-[4px] bg-slate-50 border border-slate-100 group shadow-sm flex flex-col justify-end">
                    <div className="absolute inset-0">
                        <img
                            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop"
                            alt="Metalkit"
                            className="w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 to-transparent" />
                    </div>

                    <div className="relative p-8 md:p-10">
                        <div className="inline-flex w-fit items-center gap-2 mb-4 px-3 py-1 rounded-[4px] bg-[#3200C1] text-[#37FFDB] text-[10px] font-black uppercase tracking-widest shadow-sm">
                            Novedad
                        </div>
                        <h2 className="text-3xl md:text-4xl font-black text-[#3200C1] mb-2 drop-shadow-sm">
                            Metalkit
                        </h2>
                        <p className="text-lg font-bold text-slate-600 mb-6 max-w-sm">
                            Kit de estructura metálica. Construcción rápida, segura y duradera para tu hogar.
                        </p>
                        <a
                            href="/?company=Metalkit"
                            className="brand-button-primary"
                        >
                            Ver Catálogo <ArrowRight className="w-5 h-5" />
                        </a>
                    </div>
                </div>

            </div>
        </section>
    );
}
