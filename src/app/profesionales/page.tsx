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

const REGIONS = [
    { value: 'all', label: 'Todas las Regiones' },
    { value: 'arica_parinacota', label: 'Arica' },
    { value: 'tarapaca', label: 'Tarapacá' },
    { value: 'antofagasta', label: 'Antofagasta' },
    { value: 'atacama', label: 'Atacama' },
    { value: 'coquimbo', label: 'Coquimbo' },
    { value: 'valparaiso', label: 'Valparaíso' },
    { value: 'metropolitana', label: 'Metropolitana' },
    { value: 'ohiggins', label: "O'Higgins" },
    { value: 'maule', label: 'Maule' },
    { value: 'nuble', label: 'Ñuble' },
    { value: 'biobio', label: 'Biobío' },
    { value: 'araucania', label: 'Araucanía' },
    { value: 'los_rios', label: 'Los Ríos' },
    { value: 'los_lagos', label: 'Los Lagos' },
    { value: 'aysen', label: 'Aysén' },
    { value: 'magallanes', label: 'Magallanes' },
];

export default async function ProfessionalsPage({
    searchParams
}: {
    searchParams: { region?: string }
}) {
    const selectedRegion = searchParams.region || 'all';

    const COMPANIES_QUERY = `*[_type == "companyUser" && (is_active != false) && defined(slug) ${
        selectedRegion !== 'all' 
            ? `&& ('todo_chile' in coverage_areas || $region in coverage_areas)` 
            : ''
    }] | order(select(plan == 'elite' => 1, plan == 'pro' => 2, 3) asc, company_name asc){
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

    const companies = await sanityClient.fetch(COMPANIES_QUERY, { region: selectedRegion }, { cache: 'no-store' });

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

            <main className="max-w-4xl mx-auto px-6 -translate-y-16">
                <div className="bg-white rounded-[2rem] border border-slate-200 shadow-xl p-8 md:p-12 space-y-10">
                    <div className="border-b border-slate-100 pb-6">
                        <p className="text-sm text-slate-500 font-medium whitespace-nowrap overflow-hidden mb-6">
                            Cerca de {companies.length} resultados encontrados
                        </p>

                        {/* Region Filter UI */}
                        <div className="flex items-center gap-2 overflow-x-auto pb-4 no-scrollbar -mx-2 px-2">
                            {REGIONS.map((region) => {
                                const isActive = selectedRegion === region.value;
                                return (
                                    <Link
                                        key={region.value}
                                        href={region.value === 'all' ? '/profesionales' : `/profesionales?region=${region.value}`}
                                        className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
                                            isActive
                                                ? 'bg-[#1a0dab] text-white border-[#1a0dab]'
                                                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
                                        }`}
                                    >
                                        {region.label}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    <div className="space-y-12">
                        {companies.map((company: any) => (
                            <div key={company._id} className="group flex gap-6 md:gap-10">
                                {/* Left side: Logo slightly bigger for B2B pride */}
                                <div className="hidden md:block shrink-0">
                                    <div className="relative w-20 h-20 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden shadow-inner">
                                        {company.logo?.asset ? (
                                            <Image 
                                                src={urlFor(company.logo).url()} 
                                                alt={company.company_name}
                                                fill
                                                className="object-contain p-3"
                                            />
                                        ) : (
                                            <Building2 className="w-8 h-8 text-slate-300" />
                                        )}
                                    </div>
                                </div>

                                <div className="flex-1 space-y-1.5">
                                    {/* Google Style Breadcrumb */}
                                    <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                                        <span className="font-bold">solocasaschile.com</span>
                                        <span>›</span>
                                        <span>profesional</span>
                                        <span>›</span>
                                        <span>{company.slug}</span>
                                    </div>

                                    {/* Google Style Title */}
                                    <Link href={`/profesional/${company.slug}`} className="block">
                                        <h2 className="text-xl md:text-2xl font-black text-[#1a0dab] group-hover:underline decoration-2 underline-offset-4 leading-tight">
                                            {company.company_name} 
                                            {company.is_verified && (
                                                <ShieldCheck className="w-5 h-5 inline ml-2 text-emerald-500 mb-1" />
                                            )}
                                        </h2>
                                    </Link>

                                    {/* Snippet */}
                                    <p className="text-sm text-[#4d5156] leading-relaxed line-clamp-2 max-w-3xl">
                                        {company.description || `Constructora líder en modelos de casas residenciales. Conoce su catálogo de ${company.modelCount} modelos y su trayectoria en el mercado chileno.`}
                                    </p>

                                    {/* Meta Tags / "Sitelinks" Style stats */}
                                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-2">
                                        <div className="flex items-center gap-1.5 py-1 px-3 rounded-full bg-slate-50 text-slate-600 text-[10px] font-black uppercase tracking-widest border border-slate-100">
                                            <Star className="w-3 h-3 text-amber-500" />
                                            {company.years_experience || "1"}+ Años de trayectoria
                                        </div>
                                        <div className="flex items-center gap-1.5 py-1 px-3 rounded-full bg-slate-50 text-slate-600 text-[10px] font-black uppercase tracking-widest border border-slate-100">
                                            <Building2 className="w-3 h-3 text-[#3200C1]" />
                                            {company.modelCount || "0"} Modelos Disponibles
                                        </div>
                                        <div className="flex items-center gap-1.5 py-1 px-3 rounded-full bg-slate-50 text-slate-600 text-[10px] font-black uppercase tracking-widest border border-slate-100">
                                            <MapPin className="w-3 h-3 text-red-500" />
                                            {company.coverage_areas?.includes('todo_chile') 
                                                ? 'Todo Chile' 
                                                : company.coverage_areas?.length > 0 
                                                    ? `${company.coverage_areas.length} Regiones`
                                                    : 'Chile'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {companies.length === 0 && (
                        <div className="py-20 text-center space-y-4">
                            <h3 className="text-xl font-bold text-slate-400">No se encontraron resultados</h3>
                            <p className="text-slate-400">Prueba ajustando tus criterios de búsqueda pronto.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
