import { sanityClient } from "@/lib/sanity.client";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/lib/sanity.client";
import { ShieldCheck, MapPin, ArrowRight, Building2, Star } from "lucide-react";

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

export async function generateMetadata({ params }: { params: { region: string } }): Promise<Metadata> {
    const regionObj = REGIONS.find(r => r.value === params.region);
    const regionLabel = regionObj?.label || params.region;
    return {
        title: `Constructoras en ${regionLabel} | solocasaschile.com`,
        description: `Encuentra las mejores constructoras de casas en la región de ${regionLabel}. Revisa su catálogo de modelos, precios y proyectos realizados.`,
    };
}

export default async function RegionalProfessionalsPage({
    params
}: {
    params: { region: string }
}) {
    const selectedRegion = params.region || 'all';

    const COMPANIES_QUERY = `*[_type == "companyUser" && (is_active != false) && defined(slug) ${
        selectedRegion !== 'all' 
            ? `&& ('todo_chile' in coverage_areas || $region in coverage_areas || region == $regionName)` 
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
        address,
        contact_phone,
        email,
        website,
        region,
        "modelCount": count(*[_type == "houseModel" && company_name == ^.company_name])
    }`;

    // Helper to find region label
    const regionLabel = REGIONS.find(r => r.value === selectedRegion)?.label || 'Metropolitana de Santiago';

    const companies = await sanityClient.fetch(COMPANIES_QUERY, { 
        region: selectedRegion,
        regionName: regionLabel
    }, { cache: 'no-store' });

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
                        Expertos en construcción <br /> en <span className="text-[#37FFDB]">{regionLabel}</span>
                    </h1>
                </div>
            </div>

            <main className="max-w-4xl mx-auto px-6 -translate-y-16">
                <div className="bg-white rounded-[2rem] border border-slate-200 shadow-xl p-8 md:p-12 space-y-10">
                    <div className="border-b border-slate-100 pb-8">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-black text-[#3200C1] flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-red-500" />
                                Filtrar por Región
                            </h3>
                            <span className="text-sm text-slate-400 font-bold">
                                {companies.length} resultados
                            </span>
                        </div>

                        {/* Region Filter Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                            {REGIONS.map((region) => {
                                const isActive = selectedRegion === region.value;
                                return (
                                    <Link
                                        key={region.value}
                                        href={region.value === 'all' ? '/empresas-construccion' : `/empresas-construccion/${region.value}`}
                                        className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider text-center transition-all border shadow-sm ${
                                            isActive
                                                ? 'bg-[#3200C1] text-[#37FFDB] border-[#3200C1] scale-[1.02] shadow-[#3200C1]/20'
                                                : 'bg-white text-slate-500 border-slate-200 hover:border-[#3200C1] hover:text-[#3200C1]'
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
                                    <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                                        <span className="font-bold">solocasaschile.com</span>
                                        <span>›</span>
                                        <span>empresas</span>
                                        <span>›</span>
                                        <span className="capitalize">{regionLabel}</span>
                                    </div>

                                    <Link href={`/empresas-construccion/${selectedRegion}/${company.slug}`} className="block">
                                        <h2 className="text-xl md:text-2xl font-black text-[#1a0dab] group-hover:underline decoration-2 underline-offset-4 leading-tight">
                                            {company.company_name} 
                                            {company.is_verified && (
                                                <ShieldCheck className="w-5 h-5 inline ml-2 text-emerald-500 mb-1" />
                                            )}
                                        </h2>
                                    </Link>

                                    <p className="text-sm text-[#4d5156] leading-relaxed line-clamp-2 max-w-3xl">
                                        {company.description || `Constructora líder en modelos de casas residenciales. Conoce su catálogo de ${company.modelCount} modelos y su trayectoria en el mercado chileno.`}
                                    </p>

                                    {/* Contact Info Group */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-6 pt-3 pb-2 border-t border-slate-50 mt-2">
                                        {company.email && (
                                            <div className="flex items-center gap-2 text-xs text-slate-500">
                                                <span className="font-bold text-[#3200C1]">Email:</span>
                                                <a href={`mailto:${company.email}`} className="hover:underline text-[#1a0dab] truncate">
                                                    {company.email}
                                                </a>
                                            </div>
                                        )}
                                        {company.contact_phone && (
                                            <div className="flex items-center gap-2 text-xs text-slate-500">
                                                <span className="font-bold text-[#3200C1]">Tel:</span>
                                                <a href={`tel:${company.contact_phone}`} className="hover:underline">
                                                    {company.contact_phone}
                                                </a>
                                            </div>
                                        )}
                                        {company.website && (
                                            <div className="flex items-center gap-2 text-xs text-slate-500">
                                                <span className="font-bold text-[#3200C1]">Web:</span>
                                                <a href={company.website} target="_blank" className="hover:underline text-[#1a0dab] truncate">
                                                    {company.website.replace('https://', '').replace('http://', '').split('/')[0]}
                                                </a>
                                            </div>
                                        )}
                                        {company.address && (
                                            <div className="flex items-center gap-2 text-xs text-slate-500">
                                                <span className="font-bold text-[#3200C1]">Dir:</span>
                                                <span className="truncate">{company.address}</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-2">
                                        <div className="flex items-center gap-1.5 py-1 px-3 rounded-full bg-slate-50 text-slate-600 text-[10px] font-black uppercase tracking-widest border border-slate-100">
                                            <Star className="w-3 h-3 text-amber-500" />
                                            {company.years_experience || "1"}+ Años
                                        </div>
                                        <div className="flex items-center gap-1.5 py-1 px-3 rounded-full bg-slate-50 text-slate-600 text-[10px] font-black uppercase tracking-widest border border-slate-100">
                                            <Building2 className="w-3 h-3 text-[#3200C1]" />
                                            {company.modelCount || "0"} Modelos
                                        </div>
                                        <div className="flex items-center gap-1.5 py-1 px-3 rounded-full bg-[#37FFDB]/10 text-[#1a0dab] text-[10px] font-black uppercase tracking-widest border border-[#37FFDB]/20">
                                            <MapPin className="w-3 h-3 text-red-500" />
                                            {company.region || regionLabel}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {companies.length === 0 && (
                        <div className="py-20 text-center space-y-4">
                            <h3 className="text-xl font-bold text-slate-400">No hay constructoras registradas en esta zona aún</h3>
                            <Link href="/empresas-construccion" className="text-[#3200C1] font-bold hover:underline">Ver todas las constructoras de Chile</Link>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
