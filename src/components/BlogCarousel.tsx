"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { ArrowRight, Calendar, ChevronLeft, ChevronRight } from "lucide-react";

const BLOG_POSTS = [
    {
        id: "1",
        title: "Guía Completa: Ventajas de las Casas SIP en el Clima Chileno",
        excerpt: "Descubre por qué la tecnología SIP se está convirtiendo en la opción favorita en Chile.",
        category: "Casas SIP",
        date: "25 Feb, 2026",
        image: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&q=80&w=800",
        slug: "ventajas-casas-sip-chile"
    },
    {
        id: "2",
        title: "Casas Prefabricadas vs. Tradicional: ¿Cuál conviene más?",
        excerpt: "Analizamos costos, tiempos de entrega y durabilidad para tu próximo proyecto.",
        category: "Consejos",
        date: "22 Feb, 2026",
        image: "https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?auto=format&fit=crop&q=80&w=800",
        slug: "prefabricadas-vs-tradicional"
    },
    {
        id: "3",
        title: "Modelos de Casas SIP: Tendencias de Diseño para 2026",
        excerpt: "Exploramos los modelos de casas SIP que están marcando pauta este año.",
        category: "Diseño",
        date: "18 Feb, 2026",
        image: "https://images.unsplash.com/photo-1464146072230-91cabc968266?auto=format&fit=crop&q=80&w=800",
        slug: "modelos-casas-sip-tendencias"
    },
    {
        id: "4",
        title: "Cómo ahorrar un 40% en calefacción con paneles SIP",
        excerpt: "Estrategias prácticas y datos técnicos sobre ahorro energético doméstico.",
        category: "Guía Viral",
        date: "26 Feb, 2026",
        image: "https://images.unsplash.com/photo-1448630360428-65456885c650?auto=format&fit=crop&q=80&w=800",
        slug: "ahorrar-calefaccion-paneles-sip"
    },
    {
        id: "5",
        title: "Top 10 modelos de casas modulares en Chile 2026",
        excerpt: "Un ranking detallado de los diseños más innovadores del mercado nacional.",
        category: "Tendencias",
        date: "27 Feb, 2026",
        image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800",
        slug: "top-10-casas-modulares-chile-2026"
    }
];

export const BlogCarousel = () => {
    const scrollRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: "left" | "right") => {
        if (scrollRef.current) {
            const { scrollLeft, clientWidth } = scrollRef.current;
            const scrollTo = direction === "left" ? scrollLeft - clientWidth / 2 : scrollLeft + clientWidth / 2;
            scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
        }
    };

    return (
        <section className="py-24 bg-slate-50 relative overflow-hidden">
            <div className="max-w-[1600px] mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
                    <div className="max-w-2xl">
                        <h2 className="text-4xl md:text-5xl font-black text-[#3200C1] mb-4">
                            Últimas <span className="text-accent-500 underline decoration-4 decoration-accent-500/30 underline-offset-8">Publicaciones</span>
                        </h2>
                        <p className="text-slate-500 text-lg">
                            Descubre consejos, guías y tendencias sobre construcción eficiente y modelos de casas en Chile.
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        <Link
                            href="/blog"
                            className="group flex items-center gap-2 text-[#3200C1] font-black mr-4 hover:underline"
                        >
                            Ver todo el blog
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <div className="flex gap-2">
                            <button
                                onClick={() => scroll("left")}
                                className="w-12 h-12 rounded-full border-2 border-[#3200C1]/10 flex items-center justify-center text-[#3200C1] hover:bg-[#3200C1] hover:text-white transition-all active:scale-90"
                            >
                                <ChevronLeft className="w-6 h-6" />
                            </button>
                            <button
                                onClick={() => scroll("right")}
                                className="w-12 h-12 rounded-full border-2 border-[#3200C1]/10 flex items-center justify-center text-[#3200C1] hover:bg-[#3200C1] hover:text-white transition-all active:scale-90"
                            >
                                <ChevronRight className="w-6 h-6" />
                            </button>
                        </div>
                    </div>
                </div>

                <div
                    ref={scrollRef}
                    className="flex gap-6 overflow-x-auto pb-8 scrollbar-hide snap-x snap-mandatory"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {BLOG_POSTS.map((post) => (
                        <article
                            key={post.id}
                            className="min-w-[300px] md:min-w-[400px] bg-white rounded-2xl border border-slate-100 overflow-hidden snap-start group hover:shadow-xl transition-all duration-500"
                        >
                            <Link href={`/blog/${post.slug}`} className="relative h-56 block overflow-hidden">
                                <img
                                    src={post.image}
                                    alt={post.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute top-4 left-4">
                                    <span className="bg-[#37FFDB] text-[#3200C1] px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                                        {post.category}
                                    </span>
                                </div>
                            </Link>

                            <div className="p-6">
                                <div className="flex items-center gap-2 text-slate-400 text-xs font-bold mb-3 uppercase tracking-wider">
                                    <Calendar className="w-3.5 h-3.5" />
                                    {post.date}
                                </div>
                                <h3 className="text-xl font-black text-[#3200C1] mb-3 leading-tight group-hover:text-accent-500 transition-colors">
                                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                                </h3>
                                <p className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-2">
                                    {post.excerpt}
                                </p>
                                <Link
                                    href={`/blog/${post.slug}`}
                                    className="inline-flex items-center gap-2 text-[#3200C1] text-sm font-black group/btn"
                                >
                                    Continuar leyendo
                                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
};
