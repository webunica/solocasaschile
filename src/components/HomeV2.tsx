import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { getModels, getDistinctCompanies, ModelRow } from "@/lib/db";
import { sanityClient, urlFor } from "@/lib/sanity.client";
import { HeroSlider } from "@/components/HeroSlider";
import { formatPrice } from "@/lib/utils";
import { Bed, Bath, Scale, MapPin, Star, ArrowRight, Quote } from "lucide-react";

export default async function HomeV2({ betaMode }: { betaMode?: boolean }) {
    // Definir queries - Buscamos casas destacadas, económicas y empresas verificadas
    const [{ models: featuredModels }, cheapResult, { models: allModels }, companies] = await Promise.all([
        getModels({ limit: 15, sort: "price_desc" }),
        // Más económicas: query directa para respetar precio real
        sanityClient.fetch<any[]>(
            `*[_type == "houseModel" && is_active == true && price_from > 0
                && count(*[_type=="companyUser" && company_name==^.company_name && is_active!=false && role!="admin"]) > 0
            ] | order(price_from asc)[0...10] {
                _id, model_name, company_name, category, surface_m2, bedrooms, bathrooms, price_from, currency,
                "slug": slug.current,
                "image_urls": coalesce(images[].asset->url, image_urls),
                "company_plan": *[_type=="companyUser" && company_name==^.company_name && is_active!=false && role!="admin"][0].plan
            }`,
            {},
            { next: { revalidate: 3600 } }
        ),
        getModels({ limit: 50 }),
        sanityClient.fetch(`*[_type == "companyUser" && is_verified == true] | order(_createdAt desc)[0...6]{
            _id, company_name, logo, cover_image, description, badges
        }`, {}, { cache: 'no-store' }),
    ]);

    // Slider Hero - usamos los primeros 5 destacados
    const sliderModels = featuredModels.slice(0, 5);
    
    // 2 filas de 5 modelos (total 10)
    const top10Models = featuredModels.slice(0, 10);

    // cheapModels: resultado directo de la query GROQ ordenada por precio real
    const cheapModels = cheapResult || [];

    // Tipos de casas para los tabs
    const categories = ["Madera", "SIP", "Metalcon", "Modular", "Hormigón"];

    return (
        <div className="min-h-screen bg-[#f3f4f6]">
            {/* 1. Hero / Slider */}
            <div className="w-full relative bg-white">
                <Suspense fallback={<div className="w-full h-[400px] animate-pulse bg-slate-100" />}>
                    <HeroSlider models={sliderModels} />
                </Suspense>
                
                {/* Search Bar superpuesta (ahora funcional) */}
                <form action="/" method="GET" className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-[90%] md:w-[800px] bg-white rounded-xl shadow-xl p-4 md:p-6 z-20 flex flex-col md:flex-row gap-4 items-center border border-slate-100 hidden sm:flex">
                    <input name="search" type="text" placeholder="Buscar casas por empresa, precio, modelo p.ej: 'alicante'..." className="flex-1 bg-slate-50 border border-slate-200 px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-[#3200C1]" />
                    <select name="category" className="bg-slate-50 border border-slate-200 px-4 py-3 rounded-lg outline-none min-w-[150px]">
                        <option value="">Cualquier categoría</option>
                        <option value="Madera">Madera</option>
                        <option value="SIP">SIP</option>
                        <option value="Metalcon">Metalcon</option>
                        <option value="Modular">Modular</option>
                        <option value="Hormigón">Hormigón</option>
                    </select>
                    <button type="submit" className="bg-[#3200C1] text-[#37FFDB] font-black px-8 py-3 rounded-lg hover:brightness-110 transition-all w-full md:w-auto cursor-pointer">
                        Buscar
                    </button>
                </form>
            </div>

            <main className="max-w-[1400px] mx-auto px-4 sm:px-6 pt-24 pb-20 flex flex-col gap-20">
                
                {/* 2. Modelos Destacados (2 Filas de 5 en desktop) */}
                <section>
                    <div className="flex justify-between items-end mb-8">
                        <div>
                            <h2 className="text-2xl md:text-3xl font-black text-[#3200C1] mb-2">Modelos Destacados</h2>
                            <p className="text-slate-500">Los diseños favoritos con mejor relación calidad-precio.</p>
                        </div>
                        {betaMode
                            ? <span className="text-slate-300 font-bold text-sm hidden sm:block cursor-not-allowed">Ver todos</span>
                            : <Link href="/?sort=price_desc" className="text-[#3200C1] font-bold text-sm hover:underline hidden sm:block">Ver todos</Link>
                        }
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                        {top10Models.map(model => (
                            <MiniModelCard key={model.id} model={model} betaMode={betaMode} />
                        ))}
                    </div>
                </section>

                {/* 3. Tabs de Tipos de Casas */}
                <section>
                    <h2 className="text-2xl md:text-3xl font-black text-[#3200C1] mb-8 text-center">Encuentra por Sistema Constructivo</h2>
                    <HomeTabs categories={categories} allModels={allModels} betaMode={betaMode} />
                </section>

                {/* 4. Modelos Más Económicos */}
                <section className="bg-white p-6 md:p-10 rounded-3xl shadow-sm border border-slate-100">
                    <div className="flex justify-between items-end mb-8">
                        <div>
                            <h2 className="text-2xl md:text-3xl font-black text-emerald-600 mb-2">Opciones Más Económicas</h2>
                            <p className="text-slate-500">Casas prefabricadas accesibles para empezar tu proyecto.</p>
                        </div>
                        {betaMode
                            ? <span className="text-slate-300 font-bold text-sm hidden sm:block cursor-not-allowed">Revisar precios bajos</span>
                            : <Link href="/?sort=price_asc" className="text-emerald-600 font-bold text-sm hover:underline hidden sm:block">Revisar precios bajos</Link>
                        }
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                        {cheapModels.slice(0, 5).map((model: any) => (
                            <MiniModelCard key={model._id || model.id} model={{ ...model, id: model._id || model.id, image_urls: Array.isArray(model.image_urls) ? model.image_urls.join(',') : (model.image_urls || '') }} betaMode={betaMode} />
                        ))}
                    </div>
                </section>

                {/* 5. Mejores Empresas / Empresas Destacadas */}
                <section>
                    <h2 className="text-2xl md:text-3xl font-black text-[#3200C1] mb-2 text-center">Constructoras Verificadas</h2>
                    <p className="text-center text-slate-500 mb-10 max-w-2xl mx-auto">Empresas que cumplen con nuestros estándares de verificación e insignias de calidad.</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {companies.map((company: any) => (
                            <div key={company._id} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col items-center text-center group hover:border-[#37FFDB] hover:shadow-md transition-all">
                                <div className="w-20 h-20 relative rounded-full overflow-hidden border-4 border-slate-50 mb-4 bg-white shadow-sm flex items-center justify-center">
                                    {company.logo?.asset ? (
                                        <Image src={urlFor(company.logo).url()} alt={company.company_name} fill className="object-cover" />
                                    ) : (
                                        <span className="text-xl font-black text-[#3200C1]">{company.company_name[0]}</span>
                                    )}
                                </div>
                                <h3 className="font-black text-lg text-[#3200C1] group-hover:text-[#37FFDB] transition-colors">{company.company_name}</h3>
                                <div className="flex gap-1 mt-2 mb-4">
                                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                                </div>
                                <p className="text-sm text-slate-500 line-clamp-2">{company.description || "Constructora principal que asegura calidad y compromiso en todos sus proyectos a lo largo de Chile."}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 6. Testimonios */}
                <section className="bg-[#3200C1] rounded-3xl p-8 md:p-16 text-white text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#37FFDB] rounded-full blur-[100px] opacity-20" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#37FFDB] rounded-full blur-[100px] opacity-20" />
                    
                    <h2 className="text-2xl md:text-4xl font-black mb-12 relative z-10">Familias que ya tienen su hogar</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
                        {[
                            { name: "Familia González", text: "Comparamos 5 empresas diferentes y encontramos una casa SIP hermosa que se ajustaba exacto a nuestro presupuesto en el sur." },
                            { name: "Ignacio Pérez", text: "El comparador me ahorró semanas de búsqueda. Las constructoras me contactaron el mismo día y hoy ya tengo las llaves de mi casa." },
                            { name: "María José Soto", text: "Excelente plataforma. Muy clara la información de lo que incluye y no incluye cada modelo. Totalmente recomendado." }
                        ].map((t, idx) => (
                            <div key={idx} className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/10 text-left flex flex-col">
                                <Quote className="w-8 h-8 text-[#37FFDB] mb-4 opacity-50" />
                                <p className="text-white/90 text-sm leading-relaxed flex-1 italic mb-6">"{t.text}"</p>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-slate-300 overflow-hidden flex items-center justify-center font-bold text-slate-600 bg-white">
                                        {t.name[0]}
                                    </div>
                                    <span className="font-bold text-[#37FFDB]">{t.name}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 7. Registro Empresas CTA */}
                <section className="bg-gradient-to-r from-slate-900 to-[#1e0075] rounded-3xl p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-10 shadow-2xl relative overflow-hidden">
                    <div className="relative z-10 flex-1 text-center md:text-left">
                        <span className="inline-block px-4 py-1.5 rounded-full bg-[#37FFDB]/20 text-[#37FFDB] text-xs font-black uppercase tracking-widest mb-4">
                            Para Constructoras Inmobiliarias
                        </span>
                        <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
                            Suma tu empresa al comparador
                        </h2>
                        <p className="text-white/80 text-lg mb-8 max-w-xl">
                            Recibe prospectos calificados que buscan activamente tu estilo de casas. Cientos de cotizaciones generadas semanalmente.
                        </p>
                        <Link href="/registro" className="inline-flex items-center gap-2 bg-[#37FFDB] text-[#3200C1] font-black px-8 py-4 rounded-xl hover:brightness-110 shadow-lg transition-all text-lg">
                            Registrar Empresa y Subir Modelos <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                </section>
            </main>
        </div>
    );
}

// ─── Componentes Auxiliares ──────────────────────────────────────────────

function MiniModelCard({ model, betaMode }: { model: ModelRow, betaMode?: boolean }) {
    const imageUrl = model.image_urls ? model.image_urls.split(",")[0].trim() : null;
    const href = `/modelo/${model.slug || model.id}`;

    return (
        <article className="bg-white rounded-xl overflow-hidden border border-slate-200 hover:border-[#37FFDB] shadow-sm hover:shadow-md transition-all group flex flex-col h-full">
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
                {imageUrl ? (
                    <Image src={imageUrl} alt={model.model_name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 640px) 100vw, 20vw" />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-slate-300">Sin Imagen</div>
                )}
                <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm text-white text-[10px] uppercase font-black px-2 py-1 rounded shadow-sm">
                    {model.category}
                </div>
            </div>
            
            <div className="p-4 flex flex-col flex-1 gap-2">
                <p className="text-[10px] text-slate-400 font-bold flex items-center gap-1 uppercase truncate"><MapPin className="w-3 h-3" /> {model.company_name}</p>
                {betaMode ? (
                    <h3 className="font-extrabold text-[#3200C1] line-clamp-1 leading-tight text-sm">{model.model_name}</h3>
                ) : (
                    <h3 className="font-extrabold line-clamp-1 leading-tight text-sm">
                        <Link href={href} className="text-[#3200C1] hover:underline">{model.model_name}</Link>
                    </h3>
                )}
                
                <div className="flex items-center justify-between text-[11px] text-slate-500 bg-slate-50 p-2 rounded-lg mt-1 border border-slate-100">
                    <span className="flex items-center gap-1" title="Superficie"><Scale className="w-3 h-3 text-[#3200C1]" /> {model.surface_m2 || "--"}m²</span>
                    <span className="flex items-center gap-1" title="Dormitorios"><Bed className="w-3 h-3 text-[#3200C1]" /> {model.bedrooms || "--"}</span>
                    <span className="flex items-center gap-1" title="Baños"><Bath className="w-3 h-3 text-[#3200C1]" /> {model.bathrooms || "--"}</span>
                </div>

                <div className="mt-auto pt-3 border-t border-slate-50 flex items-baseline justify-between">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Desde</span>
                    <span className="text-sm font-black text-[#3200C1] whitespace-nowrap">{formatPrice(model.price_from, model.currency)}</span>
                </div>
            </div>
        </article>
    );
}

// Client Component Wrapper para Tabs
import { ClientTabs } from "./ClientTabs";

function HomeTabs({ categories, allModels, betaMode }: { categories: string[], allModels: ModelRow[], betaMode?: boolean }) {
    return <ClientTabs categories={categories} allModels={allModels} betaMode={betaMode} />;
}
