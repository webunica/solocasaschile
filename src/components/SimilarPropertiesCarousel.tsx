"use client";

import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Bed, Bath, Scale, MapPin, Crown, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import VisitPublicationButton from "@/components/VisitPublicationButton";

export interface SimilarHouse {
    _id: string;
    model_name: string;
    company_name: string;
    category: string;
    surface_m2: number;
    bedrooms: number;
    bathrooms: number;
    price_from: number;
    currency: string;
    model_url: string;
    company_plan?: string;
    imageUrl?: string;
}

interface Props {
    models: SimilarHouse[];
}

export default function SimilarPropertiesCarousel({ models }: Props) {
    const scrollRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: "left" | "right") => {
        if (scrollRef.current) {
            const { scrollLeft, clientWidth } = scrollRef.current;
            const scrollTo =
                direction === "left"
                    ? scrollLeft - clientWidth / 2
                    : scrollLeft + clientWidth / 2;
            scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
        }
    };

    return (
        <div className="relative group w-full">
            {/* Scroll Buttons - solo visibles en hover y pantallas >= sm */}
            <div className="absolute top-1/3 -left-5 -translate-y-1/2 z-10 hidden sm:block md:opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                    onClick={() => scroll("left")}
                    aria-label="Anterior"
                    className="w-12 h-12 rounded-full bg-white border border-slate-200 shadow-lg flex items-center justify-center text-[#3200C1] hover:bg-[#3200C1] hover:text-white transition-colors"
                >
                    <ChevronLeft className="w-6 h-6" />
                </button>
            </div>
            <div className="absolute top-1/3 -right-5 -translate-y-1/2 z-10 hidden sm:block md:opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                    onClick={() => scroll("right")}
                    aria-label="Siguiente"
                    className="w-12 h-12 rounded-full bg-white border border-slate-200 shadow-lg flex items-center justify-center text-[#3200C1] hover:bg-[#3200C1] hover:text-white transition-colors"
                >
                    <ChevronRight className="w-6 h-6" />
                </button>
            </div>

            {/* Container con scroll horizontal */}
            <div
                ref={scrollRef}
                className="flex gap-6 overflow-x-auto pb-6 snap-x snap-mandatory"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
                {/* Escondemos la barra de scroll nativa en Webkit también */}
                <style dangerouslySetInnerHTML={{
                    __html: `
            div::-webkit-scrollbar { display: none; }
        `}} />

                {models.map((house) => {
                    const imageUrl = house.imageUrl || null;
                    const isConstructor = house.company_plan === "constructor";
                    const isBuilder = house.company_plan === "builder";

                    return (
                        <article
                            key={house._id}
                            className={`min-w-[85vw] sm:min-w-[400px] shrink-0 snap-start group relative rounded-[4px] overflow-hidden bg-white border transition-all duration-300 shadow-sm hover:shadow-md flex flex-col ${isConstructor
                                    ? "border-amber-300 ring-1 ring-amber-200 hover:border-amber-400"
                                    : isBuilder
                                        ? "border-blue-200 hover:border-blue-300"
                                        : "border-slate-100 hover:border-[#37FFDB]"
                                }`}
                        >
                            {/* Image */}
                            <div className="relative w-full aspect-video overflow-hidden bg-slate-50">
                                {imageUrl ? (
                                    <Image
                                        src={imageUrl}
                                        alt={`${house.model_name} - ${house.company_name}`}
                                        fill
                                        sizes="(max-width: 640px) 100vw, 400px"
                                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                                        loading="lazy"
                                        quality={75}
                                    />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center bg-slate-50 text-slate-300 text-xs">
                                        Sin imagen
                                    </div>
                                )}
                                {/* Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-[#3200C1]/40 to-transparent" />

                                {/* Badges */}
                                <div className="absolute top-3 inset-x-3 flex justify-between items-start">
                                    <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-sm text-[#3200C1] text-xs font-bold shadow-sm">
                                        <MapPin className="w-3 h-3" />
                                        {house.company_name}
                                    </div>
                                    <div className="flex flex-col items-end gap-1">
                                        {isConstructor && (
                                            <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-amber-400 text-amber-900 text-[9px] uppercase font-black shadow-sm">
                                                <Crown className="w-3 h-3" /> Destacado
                                            </div>
                                        )}
                                        {isBuilder && (
                                            <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-blue-500 text-white text-[9px] uppercase font-black shadow-sm">
                                                <Star className="w-3 h-3" /> Crecer
                                            </div>
                                        )}
                                        {house.category && (
                                            <div className="inline-flex px-2 py-1 rounded-full bg-[#37FFDB] text-[#3200C1] text-[9px] uppercase font-black shadow-sm">
                                                {house.category}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-4 flex flex-col flex-1 gap-4">
                                <div>
                                    <h3 className="text-base font-black text-[#3200C1] leading-tight">
                                        {house.model_name}
                                    </h3>
                                    <span className="text-lg font-black text-[#3200C1] tabular-nums">
                                        {formatPrice(house.price_from, house.currency)}
                                    </span>
                                    <span className="text-xs text-slate-400 ml-1">/ Desde</span>
                                </div>

                                {/* Stats */}
                                <div className="grid grid-cols-3 gap-2">
                                    <div className="flex flex-col justify-center gap-0.5 p-2 rounded-[4px] bg-slate-50 border border-slate-100">
                                        <div className="flex items-center gap-1 text-slate-400">
                                            <Scale className="w-3 h-3" />
                                            <span className="text-[8px] uppercase font-black tracking-widest">m²</span>
                                        </div>
                                        <span className="text-xs font-black text-[#3200C1]">{house.surface_m2 || "--"}</span>
                                    </div>
                                    <div className="flex flex-col justify-center gap-0.5 p-2 rounded-[4px] bg-slate-50 border border-slate-100">
                                        <div className="flex items-center gap-1 text-slate-400">
                                            <Bed className="w-3 h-3" />
                                            <span className="text-[8px] uppercase font-black tracking-widest">Dorms</span>
                                        </div>
                                        <span className="text-xs font-black text-[#3200C1]">{house.bedrooms || "--"}</span>
                                    </div>
                                    <div className="flex flex-col justify-center gap-0.5 p-2 rounded-[4px] bg-slate-50 border border-slate-100">
                                        <div className="flex items-center gap-1 text-slate-400">
                                            <Bath className="w-3 h-3" />
                                            <span className="text-[8px] uppercase font-black tracking-widest">Baños</span>
                                        </div>
                                        <span className="text-xs font-black text-[#3200C1]">{house.bathrooms || "--"}</span>
                                    </div>
                                </div>

                                {/* CTA row */}
                                <div className="mt-auto flex items-center gap-2 pt-3 border-t border-slate-50">
                                    <Link
                                        href={`/modelo/${house._id}`}
                                        className="flex-1 text-center py-2 rounded-[4px] border-2 border-[#3200C1] text-[#3200C1] font-black text-xs hover:bg-[#3200C1] hover:text-white transition-all"
                                    >
                                        Ver Detalle
                                    </Link>
                                    {house.model_url && (
                                        <VisitPublicationButton
                                            modelId={house._id}
                                            modelName={house.model_name}
                                            companyName={house.company_name}
                                            targetUrl={house.model_url}
                                            source="card"
                                            label=""
                                            className="p-2 rounded-[4px] bg-[#37FFDB] text-[#3200C1] hover:brightness-105 active:scale-95 transition-all flex items-center justify-center"
                                        />
                                    )}
                                </div>
                            </div>
                        </article>
                    );
                })}
            </div>
        </div>
    );
}
