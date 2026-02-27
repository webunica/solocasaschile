import { getConstructorCompanies } from "@/lib/db";
import Link from "next/link";
import { Crown, ArrowRight } from "lucide-react";

export async function ConstructorBanner() {
    const companies = await getConstructorCompanies();

    if (!companies || companies.length === 0) return null;

    return (
        <section className="w-full bg-gradient-to-r from-[#1a0066] via-[#3200C1] to-[#4b00e0] py-10 px-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-amber-400 rounded-lg flex items-center justify-center shadow-md">
                            <Crown className="w-5 h-5 text-amber-900" />
                        </div>
                        <div>
                            <h2 className="text-white font-black text-lg leading-tight">Empresas Plan Destacado</h2>
                            <p className="text-white/60 text-xs">{companies.length} socios Premium del Portal</p>
                        </div>
                    </div>
                    <span className="hidden sm:inline-flex px-3 py-1 text-[10px] font-black uppercase tracking-widest bg-amber-400 text-amber-900 rounded-full">
                        Plan Destacado
                    </span>
                </div>

                {/* Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                    {companies.map((co: any) => (
                        <Link
                            key={co._id}
                            href={`/?company=${encodeURIComponent(co.company_name)}`}
                            className="group flex flex-col items-center justify-center gap-3 p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 hover:border-amber-400/50 transition-all duration-300"
                        >
                            {/* Logo */}
                            <div className="w-14 h-14 rounded-xl bg-white flex items-center justify-center shadow-md overflow-hidden border-2 border-amber-400/30 group-hover:border-amber-400 transition-colors">
                                {co.logo_url ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={co.logo_url} alt={co.company_name} className="w-full h-full object-cover" />
                                ) : (
                                    <Crown className="w-6 h-6 text-amber-500" />
                                )}
                            </div>
                            <div className="text-center">
                                <p className="text-white font-black text-xs leading-tight line-clamp-2">{co.company_name}</p>
                                <p className="text-white/50 text-[10px] mt-1">{co.model_count} modelos</p>
                            </div>
                            <div className="flex items-center gap-1 text-[#37FFDB] text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                                Ver catálogo <ArrowRight className="w-3 h-3" />
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
