"use client";

import { useState, useEffect } from "react";
import { ArrowUpRight, Bed, Bath, Scale, MapPin } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import type { ModelRow } from "@/lib/db";

export function HeroSlider({ models }: { models: ModelRow[] }) {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Auto-slide every 6 seconds
    useEffect(() => {
        if (models.length <= 1) return;
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % models.length);
        }, 6000);
        return () => clearInterval(interval);
    }, [models]);

    if (!models || models.length === 0) return null;

    return (
        <div className="w-full h-[50vh] min-h-[400px] max-h-[600px] relative overflow-hidden shadow-sm border-b border-slate-100 group">
            {/* Container holding all images for smooth translation */}
            {models.map((model, idx) => {
                const isActive = idx === currentIndex;

                return (
                    <div
                        key={model.id}
                        className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${isActive ? "opacity-100 z-10" : "opacity-0 z-0 delay-150"}`}
                    >
                        {/* Background Image */}
                        <div className="absolute inset-0 bg-slate-50">
                            <img
                                src={model.image_urls.split(",")[0].trim()}
                                alt={model.model_name}
                                className={`w-full h-full object-cover transition-transform duration-[8000ms] ease-linear ${isActive ? 'scale-110' : 'scale-100'}`}
                            />
                        </div>

                        {/* Overlays - Adjusted for light theme branding */}
                        <div className="absolute inset-x-0 bottom-0 h-[80%] bg-gradient-to-t from-[#3200C1]/60 via-[#3200C1]/20 to-transparent" />
                        <div className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-[#3200C1]/40 to-transparent" />

                        {/* Content Layer */}
                        <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-end max-w-7xl mx-auto">
                            <div className="inline-flex w-fit items-center gap-2 mb-4 px-4 py-1.5 rounded-full bg-[#37FFDB] text-[#3200C1] font-black uppercase tracking-widest text-[10px] shadow-sm">
                                🌟 Propiedad Destacada
                            </div>

                            <h2 className="text-4xl md:text-6xl font-black text-white mb-3 tracking-tighter drop-shadow-md max-w-3xl">
                                {model.model_name}
                            </h2>

                            <div className="flex flex-wrap items-center gap-3 md:gap-6 mb-8 text-white/90">
                                <span className="flex items-center gap-1.5 font-bold text-sm md:text-base border-r border-white/20 pr-3 md:pr-6">
                                    <MapPin className="w-4 h-4 text-[#37FFDB]" /> {model.company_name}
                                </span>
                                <span className="flex items-center gap-1.5 font-bold text-sm md:text-base border-r border-white/20 pr-3 md:pr-6">
                                    <Scale className="w-4 h-4 text-[#37FFDB]" /> {model.surface_m2 || "--"} m²
                                </span>
                                <span className="flex items-center gap-1.5 font-bold text-sm md:text-base border-r border-white/20 pr-3 md:pr-6">
                                    <Bed className="w-4 h-4 text-[#37FFDB]" /> {model.bedrooms || "--"} Dorms
                                </span>
                                <span className="flex items-center gap-1.5 font-bold text-sm md:text-base">
                                    <Bath className="w-4 h-4 text-[#37FFDB]" /> {model.bathrooms || "--"} Baños
                                </span>
                            </div>

                            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6 justify-between w-full">
                                <div>
                                    <p className="text-[10px] font-black text-white/70 uppercase tracking-widest mb-1">Precio desde</p>
                                    <p className="text-4xl md:text-5xl font-black text-white tabular-nums tracking-tighter drop-shadow-sm">
                                        {formatPrice(model.price_from, model.currency)}
                                    </p>
                                </div>

                                <a
                                    href={model.model_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="brand-button-primary px-10 py-4 text-lg"
                                >
                                    Cotizar Ahora <ArrowUpRight className="w-5 h-5" />
                                </a>
                            </div>
                        </div>
                    </div>
                );
            })}

            {/* Navigation Indicators */}
            <div className="absolute bottom-6 right-8 flex gap-2 z-20">
                {models.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setCurrentIndex(idx)}
                        className={`transition-all duration-300 rounded-full h-1.5 ${currentIndex === idx ? "w-8 bg-[#37FFDB]" : "w-1.5 bg-white/40 hover:bg-white/60"}`}
                        aria-label={`Go to slide ${idx + 1}`}
                    />
                ))}
            </div>
        </div>
    );
}
