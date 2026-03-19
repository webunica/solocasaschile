"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X, ZoomIn, ShieldCheck } from "lucide-react";

type GalleryImage = { url: string; alt: string };

export default function ModelGallery({
    images,
    modelName,
    companyName,
}: {
    images: GalleryImage[];
    modelName: string;
    companyName: string;
}) {
    const [active, setActive] = useState(0);
    const [lightbox, setLightbox] = useState<number | null>(null);

    const prev = useCallback(() => {
        setActive((a) => (a - 1 + images.length) % images.length);
    }, [images.length]);

    const next = useCallback(() => {
        setActive((a) => (a + 1) % images.length);
    }, [images.length]);

    const prevLb = useCallback(() => {
        setLightbox((l) => (l === null ? null : (l - 1 + images.length) % images.length));
    }, [images.length]);

    const nextLb = useCallback(() => {
        setLightbox((l) => (l === null ? null : (l + 1) % images.length));
    }, [images.length]);

    useEffect(() => {
        if (lightbox === null) return;
        const handler = (e: KeyboardEvent) => {
            if (e.key === "Escape") setLightbox(null);
            if (e.key === "ArrowLeft") prevLb();
            if (e.key === "ArrowRight") nextLb();
        };
        window.addEventListener("keydown", handler);
        document.body.style.overflow = "hidden";
        return () => {
            window.removeEventListener("keydown", handler);
            document.body.style.overflow = "";
        };
    }, [lightbox, prevLb, nextLb]);

    if (!images || images.length === 0) return null;

    const main = images[active];

    return (
        <>
            {/* Imagen principal */}
            <div className="space-y-3">
                <div
                    className="aspect-[16/9] w-full bg-slate-200 rounded-3xl overflow-hidden relative shadow-lg group cursor-zoom-in"
                    onClick={() => setLightbox(active)}
                >
                    <Image
                        src={main.url}
                        alt={main.alt || `${modelName} - ${companyName}`}
                        fill
                        sizes="(max-width: 1024px) 100vw, calc(100vw - 440px)"
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        priority
                        quality={85}
                    />

                    {/* Badge empresa verificada */}
                    <div className="absolute top-4 left-4 flex gap-2 z-10">
                        <div className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-lg text-sm font-bold text-[#3200C1] flex items-center gap-2 shadow-sm">
                            <ShieldCheck className="w-4 h-4 text-[#37FFDB]" />
                            Empresa Verificada
                        </div>
                    </div>

                    {/* Zoom hint */}
                    <div className="absolute bottom-4 right-4 bg-black/40 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <ZoomIn className="w-3.5 h-3.5" /> Ver ampliada
                    </div>

                    {/* Navegación flechas (solo si hay más de 1) */}
                    {images.length > 1 && (
                        <>
                            <button
                                onClick={(e) => { e.stopPropagation(); prev(); }}
                                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-[#3200C1] shadow hover:bg-white transition-all opacity-0 group-hover:opacity-100"
                                aria-label="Anterior"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); next(); }}
                                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-[#3200C1] shadow hover:bg-white transition-all opacity-0 group-hover:opacity-100"
                                aria-label="Siguiente"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                            {/* Contador */}
                            <div className="absolute bottom-4 left-4 bg-black/40 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-lg">
                                {active + 1} / {images.length}
                            </div>
                        </>
                    )}
                </div>

                {/* Miniaturas */}
                {images.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                        {images.map((img, i) => (
                            <button
                                key={i}
                                onClick={() => setActive(i)}
                                className={`relative shrink-0 w-20 h-14 rounded-xl overflow-hidden border-2 transition-all ${
                                    i === active
                                        ? "border-[#3200C1] shadow-md scale-105"
                                        : "border-transparent opacity-60 hover:opacity-100 hover:border-slate-300"
                                }`}
                                aria-label={`Foto ${i + 1}`}
                            >
                                <Image
                                    src={img.url}
                                    alt={img.alt || `${modelName} foto ${i + 1}`}
                                    fill
                                    sizes="80px"
                                    className="object-cover"
                                />
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Lightbox */}
            {lightbox !== null && (
                <div
                    className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center"
                    onClick={() => setLightbox(null)}
                >
                    {/* Cerrar */}
                    <button
                        onClick={() => setLightbox(null)}
                        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors z-10"
                        aria-label="Cerrar"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    {/* Imagen */}
                    <div
                        className="relative w-full max-w-5xl max-h-[85vh] mx-4 aspect-[4/3]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Image
                            src={images[lightbox].url}
                            alt={images[lightbox].alt || modelName}
                            fill
                            sizes="100vw"
                            className="object-contain"
                            quality={95}
                        />
                    </div>

                    {/* Flechas lightbox */}
                    {images.length > 1 && (
                        <>
                            <button
                                onClick={(e) => { e.stopPropagation(); prevLb(); }}
                                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white transition-colors"
                                aria-label="Anterior"
                            >
                                <ChevronLeft className="w-6 h-6" />
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); nextLb(); }}
                                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white transition-colors"
                                aria-label="Siguiente"
                            >
                                <ChevronRight className="w-6 h-6" />
                            </button>
                            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/50 text-white text-sm font-bold px-4 py-1.5 rounded-full">
                                {lightbox + 1} / {images.length}
                            </div>
                        </>
                    )}
                </div>
            )}
        </>
    );
}
