"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Scale, Bed, Bath } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import type { ModelRow } from "@/lib/db";

export function ClientTabs({ categories, allModels }: { categories: string[], allModels: ModelRow[] }) {
    const [activeTab, setActiveTab] = useState(categories[0]);

    // Filtrar hasta 10 modelos que coincidan (parcialmente, ignorando case) con la categoría activa
    const filteredModels = allModels.filter((m: any) => 
        m.category?.toLowerCase().includes(activeTab.toLowerCase())
    ).slice(0, 10);

    return (
        <div>
            {/* Cabecera de Tabs */}
            <div className="flex justify-start sm:justify-center overflow-x-auto gap-4 mb-10 pb-4 no-scrollbar border-b border-slate-200">
                {categories.map(cat => (
                    <button 
                        key={cat} 
                        onClick={() => setActiveTab(cat)}
                        className={`whitespace-nowrap px-6 py-3 rounded-full text-sm font-black transition-all ${
                            activeTab === cat 
                                ? "bg-[#3200C1] text-white shadow-md" 
                                : "bg-white text-slate-500 border border-slate-200 hover:border-[#3200C1] hover:text-[#3200C1]"
                        }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Grid de resultados */}
            {filteredModels.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                    {filteredModels.map(model => (
                        <MiniModelCard key={model.id} model={model} />
                    ))}
                </div>
            ) : (
                <div className="flex items-center justify-center p-12 bg-slate-50 rounded-3xl border border-dashed border-slate-200 text-slate-400">
                    No hay suficientes ejemplos listados en esta categoría actualmente.
                </div>
            )}
        </div>
    );
}

// Reduplicado de MiniModelCard aquí o idealmente importado, 
// pero como ClientTabs es cliente, podemos duplicar (o exportarlo de un archivo base)
function MiniModelCard({ model }: { model: ModelRow }) {
    const imageUrl = model.image_urls ? model.image_urls.split(",")[0].trim() : null;

    return (
        <article className="bg-white rounded-xl overflow-hidden border border-slate-200 hover:border-[#37FFDB] shadow-sm hover:shadow-md transition-all group flex flex-col relative h-full">
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
                <h3 className="font-extrabold text-[#3200C1] line-clamp-1 leading-tight text-sm">{model.model_name}</h3>
                
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
            
            <Link href={`/modelo/${model.slug || model.id}`} className="absolute inset-0 z-10">
                <span className="sr-only">Ver {model.model_name}</span>
            </Link>
        </article>
    );
}
