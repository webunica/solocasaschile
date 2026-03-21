import { sanityClient } from "@/lib/sanity.client";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/lib/sanity.client";
import { ShieldCheck, MapPin, ArrowRight, Building2, Star } from "lucide-react";

export const metadata: Metadata = {
    title: "Constructoras y Profesionales | solocasaschile.com",
    description: "Encuentra las mejores constructoras de casas prefabricadas y sólidas en Chile. Revisa su catálogo, años de experiencia y proyectos realizados.",
};

const COMPANIES_QUERY = `*[_type == "companyUser" && (is_active != false) && defined(slug)] | order(plan desc, company_name asc){
    _id,
    company_name,
    "slug": slug.current,
    logo,
    plan,
    is_verified,
    description,
    years_experience,
    projects_completed_count,
    coverage_areas,
    "modelCount": count(*[_type == "houseModel" && company_name == ^.company_name])
}`;

export default async function ProfessionalsPage() {
    const companies = await sanityClient.fetch(COMPANIES_QUERY, {}, { cache: 'no-store' });

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* Header Hero */}
            <div className="bg-[#3200C1] py-20 px-6 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                        <pattern id="grid-p" width="10" height="10" patternUnits="userSpaceOnUse">
                            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.1"/>
                        </pattern>
                        <rect width="100" height="100" fill="url(#grid-p)" />
                    </svg>
                </div>
                
                <div className="max-w-7xl mx-auto relative z-10 text-center space-y-6">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#37FFDB]/10 border border-[#37FFDB]/20 text-[#37FFDB] text-xs font-black uppercase tracking-widest">
                        <Building2 className="w-4 h-4" /> Constructoras Certificadas
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-white leading-tight">
                        Encuentra al constructor <br /> de tu <span className="text-[#37FFDB]">próximo hogar</span>
                    </h1>
                    <p className="text-white/60 text-lg max-w-2xl mx-auto font-medium">
                        Explora nuestro directorio de empresas verificadas. Revisa sus catálogos, certificaciones y proyectos entregados en todo Chile.
                    </p>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-6 -translate-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {companies.map((company: any) => (
                        <Link 
                            key={company._id} 
                            href={`/profesional/${company.slug}`}
                            className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group flex flex-col"
                        >
                            <div className="p-8 pb-4 relative">
                                {company.plan === 'elite' && (
                                    <div className="absolute top-6 right-6 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-400 text-amber-900 text-[10px] font-black uppercase shadow-lg z-10">
                                        <Star className="w-3.5 h-3.5 fill-current" /> Empresa Destacada
                                    </div>
                                )}
                                
                                <div className="flex items-center gap-6">
                                    <div className="relative w-24 h-24 rounded-3xl bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden shrink-0 shadow-inner">
                                        {company.logo?.asset ? (
                                            <Image 
                                                src={urlFor(company.logo).url()} 
                                                alt={company.company_name}
                                                fill
                                                className="object-contain p-4 group-hover:scale-110 transition-transform duration-500"
                                            />
                                        ) : (
                                            <Building2 className="w-8 h-8 text-slate-300" />
                                        )}
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="text-xl font-black text-slate-800 leading-tight group-hover:text-[#3200C1] transition-colors">{company.company_name}</h3>
                                        <div className="flex items-center gap-2">
                                            {(company.plan === 'pro' || company.plan === 'elite' || company.is_verified) && (
                                                <span className="flex items-center gap-1 text-[10px] font-black text-emerald-600 uppercase tracking-tighter">
                                                    <ShieldCheck className="w-3.5 h-3.5" /> Verificada
                                                </span>
                                            )}
                                            <span className="flex items-center gap-1 text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                                                <MapPin className="w-3.5 h-3.5" /> 
                                                {company.coverage_areas?.includes('todo_chile') 
                                                    ? 'Todo Chile' 
                                                    : company.coverage_areas?.length > 0 
                                                        ? `${company.coverage_areas.length} Regiones`
                                                        : 'Chile'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="px-8 flex-1">
                                <p className="text-sm text-slate-500 line-clamp-3 leading-relaxed">
                                    {company.description || `Constructora especializada en modelos de casas residenciales con altos estándares de calidad y compromiso.`}
                                </p>
                            </div>

                            <div className="p-8 pt-6 space-y-6">
                                <div className="grid grid-cols-3 gap-3 border-t border-slate-100 pt-6">
                                    <div className="text-center">
                                        <p className="text-lg font-black text-[#3200C1]">{company.modelCount || "0"}</p>
                                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-1">Modelos</p>
                                    </div>
                                    <div className="text-center border-x border-slate-100">
                                        <p className="text-lg font-black text-[#3200C1]">{company.years_experience || "1"}+</p>
                                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-1">Años Exp.</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-lg font-black text-[#3200C1]">{company.projects_completed_count || "0"}+</p>
                                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-1">Proyectos</p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between group/btn">
                                    <span className="text-xs font-black text-[#3200C1] uppercase tracking-widest group-hover/btn:mr-2 transition-all">Ver Perfil Completo</span>
                                    <div className="w-10 h-10 rounded-full bg-[#3200C1] text-[#37FFDB] flex items-center justify-center transform group-hover/btn:scale-110 transition-all shadow-lg shadow-[#3200C1]/20">
                                        <ArrowRight className="w-5 h-5" />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {companies.length === 0 && (
                    <div className="bg-white rounded-[2.5rem] p-20 text-center border-2 border-dashed border-slate-200">
                        <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-2xl font-black text-slate-400">Próximamente más empresas</h3>
                        <p className="text-slate-400 mt-2">Estamos curando el catálogo para ofrecerte lo mejor.</p>
                    </div>
                )}
            </main>
        </div>
    );
}
