import { sanityClient } from "@/lib/sanity.client";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, MapPin, MessageCircle, Calendar, ArrowLeft, Star, Crown, ExternalLink, Bed, Bath, Scale } from "lucide-react";
import VisitWhatsAppButton from "@/components/VisitWhatsAppButton";
import VisitExternalLinkButton from "@/components/VisitExternalLinkButton";
import { formatPrice } from "@/lib/utils";
import VisitPublicationButton from "@/components/VisitPublicationButton";

type Props = {
    params: Promise<{ slug: string }>
}

export default async function CompanyProfilePage({ params }: Props) {
    const { slug } = await params;

    // 1. Fetch Company Data
    const company = await sanityClient.fetch(
        `*[_type == "companyUser" && slug.current == $slug][0]{
            _id, company_name, logo, cover_image, plan, whatsapp_number, meeting_url, 
            description, is_verified, years_experience, projects_completed_count, badges, certifications
        }`,
        { slug },
        { cache: "no-store" }
    );

    if (!company) return notFound();

    // 2. Fetch Models for this company
    const models = await sanityClient.fetch(
        `*[_type == "houseModel" && company_name == $companyName && is_active == true] | order(is_featured desc, price_from asc){
            _id, model_name, slug, price_from, currency, surface_m2, bedrooms, bathrooms, category, delivery_modes, images, is_featured, model_url
        }`,
        { companyName: company.company_name },
        { cache: "no-store" }
    );

    // 3. Fetch Completed Projects
    const projects = await sanityClient.fetch(
        `*[_type == "project" && company._ref == $companyId] | order(completion_date desc){
            _id, title, description, images, location_name, location, completion_date
        }`,
        { companyId: company._id },
        { cache: "no-store" }
    );

    const isElite = company.plan === 'elite';
    const isPro = company.plan === 'pro' || isElite;

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* Top Banner (Elite) or Simple Header */}
            <div className="relative h-[300px] md:h-[400px] w-full bg-[#3200C1]">
                {isElite && company.cover_image ? (
                    <Image 
                        src={company.cover_image.asset ? (sanityClient as any).imageUrlFor(company.cover_image).url() : ""} 
                        alt={company.company_name}
                        fill
                        className="object-cover opacity-60"
                    />
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-[#3200C1] to-[#1e0075] opacity-90" />
                )}
                
                {/* Decorative abstract elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#37FFDB] rounded-full blur-[120px] opacity-20 -translate-y-1/2 translate-x-1/2" />
                
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="max-w-7xl mx-auto px-6 w-full flex flex-col md:flex-row items-center md:items-end gap-6 md:translate-y-20">
                        {/* Logo */}
                        <div className="relative w-32 h-32 md:w-48 md:h-48 rounded-3xl bg-white shadow-2xl p-4 flex items-center justify-center overflow-hidden border-4 border-white">
                            {company.logo ? (
                                <Image 
                                    src={(sanityClient as any).imageUrlFor(company.logo).url()} 
                                    alt={company.company_name}
                                    fill
                                    className="object-contain p-4"
                                />
                            ) : (
                                <span className="text-4xl font-black text-[#3200C1]">{company.company_name[0]}</span>
                            )}
                        </div>

                        {/* Company Info Header */}
                        <div className="flex-1 text-center md:text-left text-white md:pb-4">
                            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-2">
                                <h1 className="text-3xl md:text-5xl font-black">{company.company_name}</h1>
                                <div className="flex flex-wrap items-center justify-center md:justify-start gap-1.5">
                                    {company.is_verified && (
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#37FFDB] text-[#3200C1] text-[10px] font-black uppercase tracking-wider shadow-sm">
                                            <CheckCircle2 className="w-3.5 h-3.5" /> Verificada
                                        </span>
                                    )}
                                    {company.badges?.map((badge: string) => {
                                        const badgeLabels: Record<string, string> = {
                                            iso_9001: 'ISO 9001',
                                            quality_cert: 'Calidad Certificada',
                                            sustainable: 'Sustentable',
                                            featured_company: 'Empresa Destacada',
                                            extended_warranty: 'Garantía Extendida'
                                        };
                                        return (
                                            <span key={badge} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-wider shadow-sm border border-white/10">
                                                <Star className="w-3.5 h-3.5" /> {badgeLabels[badge] || badge}
                                            </span>
                                        );
                                    })}
                                </div>
                            </div>
                            <p className="text-white/80 font-medium flex items-center justify-center md:justify-start gap-2">
                                <MapPin className="w-4 h-4" /> Principalmente en {projects?.[0]?.location_name || "Chile"} • {company.years_experience || "X"} años de experiencia
                            </p>
                        </div>

                        {/* Quick CTA */}
                        <div className="flex gap-3 md:pb-4">
                            <Link href="/" className="px-6 py-3 rounded-xl bg-white/10 backdrop-blur-md text-white border border-white/20 font-bold hover:bg-white/20 transition-all flex items-center gap-2">
                                <ArrowLeft className="w-4 h-4" /> Volver
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-6 pt-24 md:pt-32 grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Sidebar Info */}
                <div className="lg:col-span-1 space-y-8">
                    <section className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
                        <h2 className="text-xl font-black text-slate-800 mb-6 uppercase tracking-tight">Sobre la Empresa</h2>
                        <p className="text-slate-600 leading-relaxed text-sm">
                            {company.description || "Esta empresa aún no ha añadido una descripción detallada, pero puedes ver todos sus modelos a continuación."}
                        </p>
                        
                        <div className="mt-8 space-y-4 pt-8 border-t border-slate-100">
                             <VisitWhatsAppButton 
                                modelId="profile" 
                                modelName="Perfil Empresa" 
                                companyName={company.company_name} 
                                whatsappNumber={company.whatsapp_number}
                                label="Contactar por WhatsApp"
                             />
                             {company.meeting_url && (
                                <VisitExternalLinkButton 
                                    modelId="profile" 
                                    modelName="Perfil Empresa" 
                                    companyName={company.company_name} 
                                    targetUrl={company.meeting_url}
                                    label="Agendar Reunión"
                                    icon="calendar"
                                />
                             )}
                        </div>
                    </section>

                    {/* Stats summary */}
                    <section className="bg-slate-900 rounded-3xl p-8 text-white">
                        <h3 className="text-xs font-black text-[#37FFDB] uppercase tracking-[0.2em] mb-6">Autoridad en el Mercado</h3>
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <p className="text-3xl font-black">{models.length}</p>
                                <p className="text-[10px] text-white/40 font-bold uppercase mt-1">Modelos Activos</p>
                            </div>
                            <div>
                                <p className="text-3xl font-black">{company.projects_completed_count || projects.length || "0"}</p>
                                <p className="text-[10px] text-white/40 font-bold uppercase mt-1">Obras Realizadas</p>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Models List */}
                <div className="lg:col-span-2 space-y-12">
                    
                    {/* Projects Gallery */}
                    {projects.length > 0 && (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-black text-slate-800">Obras Realizadas</h2>
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{projects.length} proyectos</span>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {projects.map((proj: any) => (
                                    <div key={proj._id} className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm group">
                                        <div className="relative aspect-video overflow-hidden">
                                            {proj.images?.[0] ? (
                                                <Image 
                                                    src={(sanityClient as any).imageUrlFor(proj.images[0]).url()} 
                                                    alt={proj.title}
                                                    fill
                                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                            ) : (
                                                <div className="absolute inset-0 bg-slate-100 flex items-center justify-center text-slate-300">Sin Fotos</div>
                                            )}
                                            <div className="absolute bottom-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold uppercase shadow-lg">
                                                <MapPin className="w-3 h-3" /> {proj.location_name}
                                            </div>
                                        </div>
                                        <div className="p-5">
                                            <h4 className="font-black text-slate-800 mb-2 truncate">{proj.title}</h4>
                                            <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                                                {proj.description || "Proyecto finalizado con éxito bajo los estándares de calidad de " + company.company_name}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Simple Map Placeholder / Visualization */}
                    <div className="bg-slate-900 rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden">
                        <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-8">
                            <div className="flex-1 space-y-4">
                                <h3 className="text-3xl font-black text-white">Mapa de Instalaciones</h3>
                                <p className="text-white/60 text-sm leading-relaxed max-w-sm">
                                    Hemos construido en múltiples regiones del país. Cada punto en el mapa representa un hogar finalizado y una familia satisfecha.
                                </p>
                                <div className="flex flex-wrap gap-2 pt-2">
                                    {Array.from(new Set(projects.map((p: any) => p.location_name))).filter(Boolean).map((loc: any) => (
                                        <span key={loc} className="px-3 py-1 rounded-full bg-white/10 text-white text-[10px] font-bold uppercase border border-white/10">
                                            {loc}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div className="w-full md:w-[300px] aspect-square bg-slate-800 rounded-3xl border border-white/5 flex flex-col items-center justify-center p-8 text-center gap-4">
                                <div className="w-16 h-16 rounded-full bg-[#37FFDB]/20 flex items-center justify-center animate-pulse">
                                    <MapPin className="w-8 h-8 text-[#37FFDB]" />
                                </div>
                                <div>
                                    <p className="text-white font-bold text-sm">Próximamente Mapa Interactivo</p>
                                    <p className="text-white/40 text-[10px] uppercase font-black tracking-widest mt-1">Soporte Geográfico Habilitado</p>
                                </div>
                            </div>
                        </div>
                        
                        {/* Map Background Pattern (Visual) */}
                        <div className="absolute inset-0 opacity-10 pointer-events-none">
                            <svg className="w-full h-full" viewBox="0 0 100 100">
                                <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                                    <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.1"/>
                                </pattern>
                                <rect width="100" height="100" fill="url(#grid)" />
                            </svg>
                        </div>
                    </div>

                    <div className="flex items-center justify-between pt-8">
                        <h2 className="text-2xl font-black text-slate-800">Catálogo de Modelos</h2>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{models.length} inmuebles</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {models.map((house: any) => {
                            const imageUrl = house.images?.[0]?.asset ? (sanityClient as any).imageUrlFor(house.images[0]).url() : null;
                            return (
                                <article key={house._id} className="group relative rounded-3xl overflow-hidden bg-white border border-slate-200 transition-all duration-500 hover:shadow-xl flex flex-col">
                                    <div className="relative w-full aspect-video overflow-hidden">
                                        {imageUrl ? (
                                            <Image 
                                                src={imageUrl} 
                                                alt={house.model_name}
                                                fill
                                                className="object-cover group-hover:scale-110 transition-transform duration-700"
                                            />
                                        ) : (
                                            <div className="absolute inset-0 bg-slate-100 flex items-center justify-center text-slate-300">Sin Imagen</div>
                                        )}
                                        {house.is_featured && (
                                            <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-400 text-amber-900 text-[10px] font-black uppercase shadow-lg">
                                                <Crown className="w-3.5 h-3.5" /> Destacado
                                            </div>
                                        )}
                                        <div className="absolute bottom-4 left-4 right-4">
                                            <div className="bg-white/90 backdrop-blur-md p-3 rounded-2xl shadow-lg border border-white/20">
                                                <p className="text-xs font-black text-slate-400 uppercase tracking-tighter">{house.category}</p>
                                                <p className="text-lg font-black text-[#3200C1]">{house.model_name}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-6 space-y-4 flex-1 flex flex-col">
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-2xl font-black text-[#3200C1]">{formatPrice(house.price_from, house.currency)}</span>
                                            <span className="text-[10px] font-bold text-slate-400 uppercase">precio base</span>
                                        </div>

                                        <div className="grid grid-cols-3 gap-2">
                                            <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-50 border border-slate-100">
                                                <Scale className="w-3 h-3 text-slate-400 mb-1" />
                                                <span className="text-[10px] font-black text-[#3200C1]">{house.surface_m2}m²</span>
                                            </div>
                                            <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-50 border border-slate-100">
                                                <Bed className="w-3 h-3 text-slate-400 mb-1" />
                                                <span className="text-[10px] font-black text-[#3200C1]">{house.bedrooms}</span>
                                            </div>
                                            <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-50 border border-slate-100">
                                                <Bath className="w-3 h-3 text-slate-400 mb-1" />
                                                <span className="text-[10px] font-black text-[#3200C1]">{house.bathrooms}</span>
                                            </div>
                                        </div>

                                        <p className="text-[10px] font-bold text-slate-400 uppercase line-clamp-1">Formatos: {house.delivery_modes?.join(', ') || 'N/A'}</p>

                                        <div className="pt-4 mt-auto flex gap-2">
                                            <Link 
                                                href={`/modelo/${house.slug.current}`}
                                                className="flex-1 text-center py-2.5 rounded-xl border-2 border-[#3200C1] text-[#3200C1] font-black text-xs hover:bg-[#3200C1] hover:text-white transition-all"
                                            >
                                                Ver Detalles
                                            </Link>
                                            {house.model_url && (
                                                <VisitPublicationButton 
                                                    modelId={house._id}
                                                    modelName={house.model_name}
                                                    companyName={company.company_name}
                                                    targetUrl={house.model_url}
                                                    source="card"
                                                    label="Sitio Web"
                                                    className="inline-flex items-center justify-center p-2.5 rounded-xl bg-[#37FFDB] text-[#3200C1] hover:brightness-105 transition-all shadow-sm"
                                                />
                                            )}
                                        </div>
                                    </div>
                                </article>
                            )
                        })}
                    </div>
                </div>
            </main>
        </div>
    );
}
