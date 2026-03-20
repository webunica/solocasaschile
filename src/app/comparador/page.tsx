import { sanityClient } from "@/lib/sanity.client";
import Image from "next/image";
import Link from "next/link";
import { Check, X, ArrowLeft, Scale, Bed, Bath, Hash, Info, ExternalLink } from "lucide-react";
import { formatPrice } from "@/lib/utils";

type Props = {
    searchParams: Promise<{ ids?: string }>
}

export default async function ComparatorPage({ searchParams }: Props) {
    const { ids } = await searchParams;
    const modelIds = ids ? ids.split(',').filter(id => id.length > 5) : [];

    // Fetch up to 3 models if provided
    const models = modelIds.length > 0 ? await sanityClient.fetch(
        `*[_type == "houseModel" && _id in $ids]{
            _id, model_name, company_name, price_from, currency, surface_m2, bedrooms, bathrooms, floors, structure_material, category, images, slug, delivery_modes
        }`,
        { ids: modelIds },
        { cache: "no-store" }
    ) : [];

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* Header */}
            <div className="bg-[#3200C1] py-12 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#37FFDB] rounded-full blur-[120px] opacity-20" />
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <Link href="/" className="inline-flex items-center gap-2 text-[#37FFDB] font-bold text-sm mb-6 hover:underline">
                        <ArrowLeft className="w-4 h-4" /> Volver al Inicio
                    </Link>
                    <h1 className="text-4xl font-black mb-2">Comparador Inteligente</h1>
                    <p className="text-white/60 font-medium">Contrasta las especificaciones técnicas y precios de tus modelos favoritos.</p>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-6 -mt-8">
                {models.length === 0 ? (
                    <div className="bg-white rounded-3xl p-16 border border-slate-200 shadow-xl text-center space-y-6">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
                            <Hash className="w-10 h-10 text-slate-300" />
                        </div>
                        <h2 className="text-2xl font-black text-slate-800">No hay modelos para comparar</h2>
                        <p className="text-slate-500 max-w-md mx-auto">Vuelve al buscador y selecciona modelos para verlos aquí frente a frente.</p>
                        <Link href="/" className="inline-flex px-8 py-3 bg-[#3200C1] text-white rounded-xl font-bold hover:bg-[#250091] transition-all">
                            Ir al Buscador
                        </Link>
                    </div>
                ) : (
                    <div className="bg-white rounded-[32px] border border-slate-200 shadow-2xl overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full table-fixed min-w-[800px]">
                                <thead>
                                    <tr>
                                        <th className="w-1/4 p-8 bg-slate-50/50 text-left border-r border-slate-100">
                                            <span className="text-[10px] font-black text-[#3200C1] uppercase tracking-[0.2em]">Especificaciones</span>
                                        </th>
                                        {models.map((m: any) => (
                                            <th key={m._id} className="w-1/4 p-8 border-r border-slate-100 last:border-0 align-top">
                                                <div className="space-y-4">
                                                    <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-inner bg-slate-100">
                                                        {m.images?.[0] ? (
                                                            <Image 
                                                                src={(sanityClient as any).imageUrlFor(m.images[0]).url()} 
                                                                alt={m.model_name}
                                                                fill
                                                                className="object-cover"
                                                            />
                                                        ) : (
                                                            <div className="absolute inset-0 flex items-center justify-center text-slate-300 text-xs uppercase font-bold">Sin Foto</div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-black text-[#3200C1] uppercase tracking-tighter">{m.company_name}</p>
                                                        <h3 className="text-lg font-black text-slate-800 leading-tight">{m.model_name}</h3>
                                                    </div>
                                                    <Link 
                                                        href={`/modelo/${m.slug?.current || m._id}`}
                                                        className="block w-full text-center py-2.5 bg-slate-100 hover:bg-[#37FFDB] hover:text-[#3200C1] rounded-xl text-xs font-black transition-all"
                                                    >
                                                        Ficha Completa
                                                    </Link>
                                                </div>
                                            </th>
                                        ))}
                                        {/* Relleno para siempre mostrar 3 si hay menos */}
                                        {[...Array(Math.max(0, 3 - models.length))].map((_, i) => (
                                            <th key={i} className="w-1/4 p-8 border-r border-slate-100 last:border-0 opacity-20">
                                                <div className="h-48 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-center">
                                                    <span className="text-xs font-bold text-slate-400">Espacio vacío</span>
                                                </div>
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="text-sm">
                                    <ComparisonRow label="Precio Base" icon={<Hash className="w-4 h-4" />} models={models} field={(m: any) => (
                                        <span className="text-xl font-black text-[#3200C1]">{formatPrice(m.price_from, m.currency)}</span>
                                    )} />
                                    
                                    <ComparisonRow label="Superficie" icon={<Scale className="w-4 h-4" />} models={models} field={(m: any) => (
                                        <span className="font-bold">{m.surface_m2} m²</span>
                                    )} />

                                    <ComparisonRow label="Dormitorios" icon={<Bed className="w-4 h-4" />} models={models} field={(m: any) => (
                                        <span className="font-bold">{m.bedrooms}</span>
                                    )} />

                                    <ComparisonRow label="Baños" icon={<Bath className="w-4 h-4" />} models={models} field={(m: any) => (
                                        <span className="font-bold">{m.bathrooms}</span>
                                    )} />

                                    <ComparisonRow label="Categoría" icon={<Info className="w-4 h-4" />} models={models} field={(m: any) => (
                                        <span className="font-medium text-slate-500">{m.category}</span>
                                    )} />

                                    <ComparisonRow label="Material" icon={<Info className="w-4 h-4" />} models={models} field={(m: any) => (
                                        <span className="font-medium text-slate-500">{m.structure_material || "N/A"}</span>
                                    )} />

                                    <ComparisonRow label="Entrega" icon={<ExternalLink className="w-4 h-4" />} models={models} field={(m: any) => (
                                        <div className="flex flex-wrap gap-1">
                                            {m.delivery_modes?.map((dm: string) => (
                                                <span key={dm} className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded uppercase font-bold text-slate-400">{dm}</span>
                                            ))}
                                        </div>
                                    )} />
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

function ComparisonRow({ label, icon, models, field }: { label: string, icon: any, models: any[], field: (m: any) => React.ReactNode }) {
    return (
        <tr className="border-t border-slate-100 hover:bg-slate-50/50 transition-colors">
            <td className="p-8 border-r border-slate-100 bg-slate-50/30">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-lg shadow-sm text-[#3200C1]">{icon}</div>
                    <span className="font-black text-slate-800 uppercase text-[11px] tracking-wide">{label}</span>
                </div>
            </td>
            {models.map((m: any) => (
                <td key={m._id} className="p-8 border-r border-slate-100 last:border-0 text-center">
                    {field(m)}
                </td>
            ))}
            {[...Array(Math.max(0, 3 - models.length))].map((_, i) => (
                <td key={i} className="p-8 border-r border-slate-100 last:border-0" />
            ))}
        </tr>
    );
}
