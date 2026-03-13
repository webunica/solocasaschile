import { ArrowRight, Calendar, User, Tag, ChevronRight, Hash, Inbox } from "lucide-react";
import Link from "next/link";
import { getBlogPosts } from "@/lib/db";
import { BlogSearch } from "@/components/BlogSearch";
import SiteLogo from "@/components/SiteLogo";

interface Post {
    id: string;
    title: string;
    excerpt: string;
    category: string;
    date: string;
    author: string;
    image: string;
    slug: string;
}

const SAMPLE_POSTS: Post[] = [
    {
        id: "1",
        title: "Guía Completa: Ventajas de las Casas SIP en el Clima Chileno",
        excerpt: "Descubre por qué la tecnología SIP (Structural Insulated Panels) se está convirtiendo en la opción favorita para construir en el sur de Chile por su alta eficiencia térmica.",
        category: "Casas SIP",
        date: "25 Feb, 2026",
        author: "Equipo solocasaschile",
        image: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&q=80&w=800",
        slug: "ventajas-casas-sip-chile"
    },
    {
        id: "2",
        title: "Casas Prefabricadas vs. Construcción Tradicional: ¿Cuál conviene más?",
        excerpt: "Analizamos costos, tiempos de entrega y durabilidad para ayudarte a decidir la mejor opción para tu próximo proyecto habitacional.",
        category: "Consejos",
        date: "22 Feb, 2026",
        author: "Admin",
        image: "https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?auto=format&fit=crop&q=80&w=800",
        slug: "prefabricadas-vs-tradicional"
    },
    {
        id: "3",
        title: "Modelos de Casas SIP: Tendencias de Diseño para 2026",
        excerpt: "Desde estilos minimalistas hasta diseños alpinos, exploramos los modelos de casas SIP que están marcando pauta este año.",
        category: "Diseño",
        date: "18 Feb, 2026",
        author: "Arquitectura",
        image: "https://images.unsplash.com/photo-1464146072230-91cabc968266?auto=format&fit=crop&q=80&w=800",
        slug: "modelos-casas-sip-tendencias"
    },
    {
        id: "4",
        title: "Cómo ahorrar un 40% en calefacción con paneles SIP",
        excerpt: "Estrategias prácticas y datos técnicos sobre por qué los paneles SIP son la mejor inversión para el ahorro energético doméstico.",
        category: "Guía Viral",
        date: "26 Feb, 2026",
        author: "Energía Sostenible",
        image: "https://images.unsplash.com/photo-1448630360428-65456885c650?auto=format&fit=crop&q=80&w=800",
        slug: "ahorrar-calefaccion-paneles-sip"
    },
    {
        id: "5",
        title: "Top 10 modelos de casas modulares en Chile 2026",
        excerpt: "Un ranking detallado de los diseños más innovadores y solicitados en el mercado nacional para el presente año.",
        category: "Tendencias",
        date: "27 Feb, 2026",
        author: "Redacción",
        image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800",
        slug: "top-10-casas-modulares-chile-2026"
    },
    {
        id: "6",
        title: "Guía de Financiamiento para Casas Prefabricadas en Chile",
        excerpt: "Cómo obtener crédito hipotecario o financiamiento directo para tu casa prefabricada o modular.",
        category: "Guías de Compra",
        date: "28 Feb, 2026",
        author: "Finanzas",
        image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=800",
        slug: "financiamiento-casas-prefabricadas-chile"
    },
    {
        id: "7",
        title: "Eficiencia Energética: Cómo certificar tu vivienda en Chile",
        excerpt: "Entiende los grados de aislación y cómo la Calificación Energética de Viviendas te ayuda a ahorrar.",
        category: "Eficiencia Energética",
        date: "1 Mar, 2026",
        author: "Sostenibilidad",
        image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&q=80&w=800",
        slug: "eficiencia-energetica-vivienda-chile"
    },
    {
        id: "8",
        title: "Permisos Municipales: Qué necesitas para construir legalmente",
        excerpt: "Evita multas y clausuras. Los pasos críticos para regularizar tu obra en la dirección de obras municipales.",
        category: "Consejos",
        date: "2 Mar, 2026",
        author: "Legal",
        image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=800",
        slug: "permisos-municipales-construccion-chile"
    }
];

export default async function BlogPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
    const rawParams = await searchParams;
    const search = typeof rawParams.search === "string" ? rawParams.search : undefined;

    let posts = await getBlogPosts(search);

    // Si no hay posts en Sanity y estamos buscando, filtrar los estáticos
    if (!posts || posts.length === 0) {
        if (search) {
            const s = search.toLowerCase();
            posts = SAMPLE_POSTS.filter(p =>
                p.title.toLowerCase().includes(s) ||
                p.category.toLowerCase().includes(s) ||
                p.excerpt.toLowerCase().includes(s)
            );
        } else {
            posts = SAMPLE_POSTS;
        }
    }

    return (
        <div className="bg-white">
            {/* Header */}
            <header className="border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-8">
                        <div className="flex items-center gap-3">
                            <SiteLogo />
                        </div>

                        <nav className="hidden md:flex items-center gap-6">
                            <Link href="/" className="text-sm font-bold text-[#3200C1] hover:text-[#37FFDB] transition-colors">
                                Inicio
                            </Link>
                            <Link href="/blog" className="text-sm font-bold text-[#3200C1] hover:text-[#37FFDB] transition-colors">
                                Publicaciones
                            </Link>
                        </nav>
                    </div>

                    <div className="text-sm font-medium text-slate-500">
                        Blog Inmobiliario
                    </div>
                </div>
            </header>

            {/* Blog Hero */}
            <section className="bg-[#3200C1] py-20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-[#37FFDB]/10 transform skew-x-12 translate-x-1/2" />
                <div className="max-w-[1600px] mx-auto px-6 relative z-10">
                    <div className="max-w-3xl">
                        <h1 className="text-5xl md:text-6xl font-black text-white mb-6 leading-tight">
                            Blog de <span className="text-[#37FFDB]">Vivienda Sostenible</span>
                        </h1>
                        <p className="text-xl text-white/80 leading-relaxed mb-8">
                            Expertos en casas SIP, prefabricadas y tendencias inmobiliarias en Chile. Tu guía definitiva para construir el hogar de tus sueños.
                        </p>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <section className="max-w-[1600px] mx-auto px-6 py-16">
                <div className="flex flex-col lg:flex-row gap-12">

                    {/* Posts Grid */}
                    <div className="flex-1">
                        {posts.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {posts.map((post: any) => (
                                    <article key={post._id || post.id} className="group flex flex-col bg-white border border-slate-100 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
                                        <Link href={`/blog/${post.slug}`} className="relative h-72 overflow-hidden block">
                                            <img
                                                src={post.image || "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&q=80&w=800"}
                                                alt={post.title}
                                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-[#3200C1]/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                            <div className="absolute top-6 left-6">
                                                <span className="bg-[#37FFDB] text-[#3200C1] px-5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl backdrop-blur-sm bg-[#37FFDB]/90">
                                                    {post.category || "Inmobiliaria"}
                                                </span>
                                            </div>
                                        </Link>

                                        <div className="p-10 flex-1 flex flex-col">
                                            <div className="flex items-center gap-6 text-slate-400 text-[11px] font-black uppercase tracking-widest mb-6">
                                                <span className="flex items-center gap-2 border-r border-slate-200 pr-6"><Calendar className="w-3.5 h-3.5 text-[#37FFDB]" /> {post.date ? new Date(post.date).toLocaleDateString("es-CL", { day: 'numeric', month: 'short' }) : "Reciente"}</span>
                                                <span className="flex items-center gap-2"><User className="w-3.5 h-3.5 text-[#37FFDB]" /> {post.author || "Redacción"}</span>
                                            </div>

                                            <h2 className="text-3xl font-black text-[#3200C1] mb-5 leading-[1.2] group-hover:text-[#3200C1]/80 transition-colors">
                                                <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                                            </h2>

                                            <p className="text-slate-500 leading-relaxed mb-8 flex-1 line-clamp-3 text-lg">
                                                {post.excerpt || "Descubre todo sobre la construcción sostenible y las mejores opciones de vivienda en Chile con solocasaschile.com."}
                                            </p>

                                            <Link
                                                href={`/blog/${post.slug}`}
                                                className="inline-flex items-center gap-3 text-[#3200C1] font-black group/btn text-sm uppercase tracking-widest"
                                            >
                                                <span className="border-b-2 border-[#37FFDB] pb-1">Leer artículo completo</span>
                                                <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-2 transition-transform text-[#37FFDB]" />
                                            </Link>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        ) : (
                            <div className="py-24 flex flex-col items-center justify-center text-center bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                                <Inbox className="w-16 h-16 text-slate-300 mb-4" />
                                <h3 className="text-2xl font-black text-[#3200C1] mb-2">No encontramos artículos</h3>
                                <p className="text-slate-500 max-w-sm">Intenta buscar con otros términos o limpia los filtros.</p>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <aside className="lg:w-96 flex flex-col gap-10">
                        {/* Search */}
                        <BlogSearch />

                        {/* Categories */}
                        <div className="p-8 bg-slate-50 rounded-2xl border border-slate-100">
                            <h3 className="text-xl font-black text-[#3200C1] mb-6">Categorías SEO</h3>
                            <div className="flex flex-col gap-3">
                                {[
                                    { name: "Casas SIP", count: 12 },
                                    { name: "Casas Prefabricadas", count: 24 },
                                    { name: "Modelos de Casas", count: 18 },
                                    { name: "Eficiencia Energética", count: 9 },
                                    { name: "Guías de Compra", count: 15 }
                                ].map((cat) => (
                                    <Link
                                        key={cat.name}
                                        href="#"
                                        className="flex items-center justify-between group p-2 -mx-2 hover:bg-white rounded-lg transition-all"
                                    >
                                        <span className="text-slate-600 group-hover:text-[#3200C1] font-bold flex items-center gap-2">
                                            <ChevronRight className="w-4 h-4 text-[#37FFDB]" />
                                            {cat.name}
                                        </span>
                                        <span className="bg-slate-200 text-slate-500 text-[10px] font-black px-2 py-0.5 rounded-full">
                                            {cat.count}
                                        </span>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Popular Posts */}
                        <div className="p-8 bg-[#3200C1] rounded-2xl shadow-xl shadow-[#3200C1]/20 text-white">
                            <h3 className="text-xl font-black mb-6">Lo más leído</h3>
                            <div className="flex flex-col gap-6">
                                <Link href="/blog/ahorrar-calefaccion-paneles-sip" className="group">
                                    <p className="text-[#37FFDB] text-xs font-black uppercase mb-1">Guía Viral</p>
                                    <p className="font-bold leading-snug group-hover:underline">Cómo ahorrar un 40% en calefacción con paneles SIP</p>
                                </Link>
                                <Link href="/blog/top-10-casas-modulares-chile-2026" className="group">
                                    <p className="text-[#37FFDB] text-xs font-black uppercase mb-1">Tendencias</p>
                                    <p className="font-bold leading-snug group-hover:underline">Top 10 modelos de casas modulares en Chile 2026</p>
                                </Link>
                            </div>
                        </div>
                    </aside>

                </div>
            </section>
        </div>
    );
}
