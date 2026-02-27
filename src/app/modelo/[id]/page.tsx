import { ArrowLeft, Bath, Bed, Maximize, Ruler, Home as HomeIcon, CheckCircle2, Factory, Calendar, MessageSquare, ShieldCheck, FileText } from "lucide-react";
import Link from "next/link";
import { sanityClient } from "@/lib/sanity.client";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import LeadGeneratorForm from "./components/LeadGeneratorForm";

type Props = {
    params: Promise<{ id: string }>
}

const MODEL_QUERY = `*[_type == "houseModel" && _id == $id][0]{
    _id,
    property_id,
    tags,
    company_name,
    model_name,
    category,
    surface_m2,
    bedrooms,
    bathrooms,
    floors,
    structure_material,
    delivery_modes,
    price_from,
    description,
    seo_title,
    seo_description,
    "contact_phone": *[_type == "companyUser" && company_name == ^.company_name][0].contact_phone,
    "company_email": *[_type == "companyUser" && company_name == ^.company_name][0].email,
    "images": coalesce(images[].asset->url, image_urls)
}`;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;
    const model = await sanityClient.fetch(MODEL_QUERY, { id });

    if (!model) {
        return {
            title: "Modelo no encontrado | solocasaschile.com",
        }
    }

    return {
        title: model.seo_title || `${model.model_name} por ${model.company_name} | solocasaschile.com`,
        description: model.seo_description || `Conoce los detalles, m2, materialidad y precio del modelo ${model.model_name} construido por ${model.company_name}. Solicita tu asesoría gratuita.`,
        openGraph: {
            title: `${model.model_name} | ${model.company_name}`,
            images: model.images && model.images.length > 0 ? [{ url: model.images[0] }] : []
        }
    };
}

export default async function ModelPage({ params }: Props) {
    const { id } = await params;

    const model = await sanityClient.fetch(MODEL_QUERY, { id }, {
        next: { tags: [`model-${id}`], revalidate: 3600 } // ISR Cache: 1 Hora
    });

    if (!model) {
        notFound();
    }

    // Datos que se caen atrás
    const thumbnail = (model.images && model.images.length > 0) ? model.images[0] : null;

    return (
        <div className="bg-slate-50 min-h-screen pb-20">
            {/* Header / Breadcrumb */}
            <div className="bg-white border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-[#3200C1] font-bold text-sm transition-colors">
                        <ArrowLeft className="w-4 h-4" /> Volver al Comparador
                    </Link>
                    <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-md bg-[#37FFDB]/20 flex items-center justify-center text-[#3200C1]">
                            <Factory className="w-3 h-3" />
                        </span>
                        <span className="text-sm font-bold text-slate-700">{model.company_name}</span>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 pt-10 grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-10">

                {/* Columna Izquierda: Detalles del Inmueble */}
                <div className="space-y-10">

                    {/* Galería Header */}
                    <div className="space-y-6">
                        <div className="flex items-start justify-between gap-6">
                            <div>
                                <span className="inline-block px-3 py-1 bg-[#37FFDB] text-[#3200C1] rounded-full text-xs font-black uppercase tracking-widest mb-4">
                                    {model.category || "Modelo Estándar"}
                                </span>
                                <h1 className="text-3xl md:text-5xl font-black text-[#3200C1] leading-tight mb-2">
                                    {model.model_name}
                                </h1>

                                {/* Tags Taxonomía */}
                                {model.tags && model.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-4">
                                        {model.tags.map((tag: string, i: number) => (
                                            <span key={i} className="px-3 py-1 bg-slate-100 text-slate-500 rounded-lg text-xs font-bold border border-slate-200">
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="text-right shrink-0 bg-white p-4 rounded-2xl shadow-sm border border-slate-100 relative">
                                {model.property_id && (
                                    <div className="absolute -top-3 -right-3 bg-slate-800 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-md z-10">
                                        ID: {model.property_id}
                                    </div>
                                )}
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Precio Desde</p>
                                <div className="text-3xl font-black text-[#3200C1]">
                                    ${model.price_from ? model.price_from.toLocaleString('es-CL') : "Consultar"}
                                </div>
                            </div>
                        </div>

                        {/* Imagen Principal */}
                        {thumbnail ? (
                            <div className="aspect-[16/9] w-full bg-slate-200 rounded-3xl overflow-hidden relative shadow-lg">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={thumbnail} alt={model.model_name} className="w-full h-full object-cover" />

                                <div className="absolute top-4 left-4 flex gap-2">
                                    <div className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-lg text-sm font-bold text-[#3200C1] flex items-center gap-2 shadow-sm">
                                        <ShieldCheck className="w-4 h-4 text-[#37FFDB]" />
                                        Empresa Verificada
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="aspect-[16/9] w-full bg-slate-100 rounded-3xl flex items-center justify-center border-2 border-dashed border-slate-200">
                                <span className="text-slate-400 font-medium flex items-center gap-2">
                                    <HomeIcon className="w-5 h-5" /> Sin fotografía principal
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Características Grid */}
                    <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                        <h2 className="text-xl font-black text-[#3200C1] mb-6">Características Físicas</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                            <div className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <Maximize className="w-6 h-6 text-[#37FFDB] mb-2" />
                                <span className="text-2xl font-black text-slate-800">{model.surface_m2 || "-"}</span>
                                <span className="text-xs font-bold text-slate-400">Metros Cuadrados</span>
                            </div>
                            <div className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <Bed className="w-6 h-6 text-[#37FFDB] mb-2" />
                                <span className="text-2xl font-black text-slate-800">{model.bedrooms || "-"}</span>
                                <span className="text-xs font-bold text-slate-400">Dormitorios</span>
                            </div>
                            <div className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <Bath className="w-6 h-6 text-[#37FFDB] mb-2" />
                                <span className="text-2xl font-black text-slate-800">{model.bathrooms || "-"}</span>
                                <span className="text-xs font-bold text-slate-400">Baños</span>
                            </div>
                            <div className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <Ruler className="w-6 h-6 text-[#37FFDB] mb-2" />
                                <span className="text-2xl font-black text-slate-800">{model.floors || "1"}</span>
                                <span className="text-xs font-bold text-slate-400">Niveles / Pisos</span>
                            </div>
                        </div>
                    </div>

                    {/* Descripción y Materialidades */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col gap-4">
                            <div className="w-12 h-12 rounded-xl bg-[#37FFDB]/20 text-[#3200C1] flex items-center justify-center">
                                <FileText className="w-6 h-6" />
                            </div>
                            <h3 className="font-black text-[#3200C1]">Descripción del Proyecto</h3>
                            <p className="text-slate-600 leading-relaxed text-sm whitespace-pre-wrap">
                                {model.description || "Este modelo no cuenta con una descripción detallada provista por la constructora. Te recomendamos solicitar asesoría para que la empresa te brinde la ficha técnica completa."}
                            </p>
                        </div>

                        <div className="space-y-6">
                            <div className="bg-[#3200C1] p-8 rounded-3xl shadow-sm text-white">
                                <h3 className="font-black text-[#37FFDB] mb-4 text-lg">Material Estructural</h3>
                                <p className="font-bold text-xl">{model.structure_material || "Estructura Estándar"}</p>
                                <p className="text-sm opacity-80 mt-2">Consulta con la empresa por modificaciones térmicas o materiales alternativos de construcción rápida.</p>
                            </div>

                            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                                <h4 className="font-bold text-[#3200C1] mb-4 text-sm uppercase tracking-wider">Formatos de Entrega</h4>
                                <ul className="space-y-3">
                                    {(model.delivery_modes || []).map((mode: string, i: number) => (
                                        typeof mode === 'string' && (
                                            <li key={i} className="flex items-center gap-3 text-sm font-medium text-slate-700">
                                                <CheckCircle2 className="w-5 h-5 text-[#37FFDB] shrink-0" /> {mode}
                                            </li>
                                        )
                                    ))}
                                    {(!model.delivery_modes || model.delivery_modes.length === 0) && (
                                        <li className="text-sm text-slate-500 italic">No especificado por la empresa</li>
                                    )}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Columna Derecha: Formulario Asesoría (Sticky) */}
                <aside className="relative">
                    <div className="sticky top-24 bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">

                        {/* Cabecera Formulario */}
                        <div className="bg-[#37FFDB] p-6 text-center">
                            <div className="w-16 h-16 bg-[#3200C1] rounded-full mx-auto flex items-center justify-center mb-4 shadow-lg ring-4 ring-white">
                                <MessageSquare className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-xl font-black text-[#3200C1] leading-tight">¿Te interesa este modelo?</h3>
                            <p className="text-sm text-[#3200C1]/80 font-medium mt-2">¡Cotiza sin compromiso con un experto! 🏠</p>
                        </div>

                        {/* Generador de Lead — Email + Registro en Sanity */}
                        <LeadGeneratorForm
                            companyName={model.company_name}
                            modelName={model.model_name}
                            modelId={model._id}
                            companyEmail={model.company_email}
                            contactPhone={model.contact_phone}
                        />
                    </div>
                </aside>

            </div>
        </div>
    );
}
