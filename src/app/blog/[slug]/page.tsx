import { ArrowLeft, Calendar, User, Share2, Facebook, Twitter, Linkedin, MessageSquare, ArrowRight, Hash } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { sanityClient } from "@/lib/sanity.client";
import { PortableText } from "@portabletext/react";

type Props = {
    params: Promise<{ slug: string }>
}

const POST_QUERY = `*[_type == "blogPost" && slug.current == $slug][0]{
  title,
  "slug": slug.current,
  excerpt,
  publishedAt,
  body,
  category,
  "coverImageUrl": coverImage.asset->url
}`

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;

    // Hacemos fetch a Sanity (ISR con tags)
    const post = await sanityClient.fetch(POST_QUERY, { slug }, {
        next: { tags: [`post-${slug}`], revalidate: 3600 }
    });

    if (!post) {
        return {
            title: "Post no encontrado | solocasaschile.com",
            description: "No se pudo encontrar el artículo que buscabas."
        }
    }

    return {
        title: `${post.title} | solocasaschile.com`,
        description: post.excerpt || `Lee nuestro artículo sobre ${post.title} y descubre las mejores opciones para tu hogar en Chile.`,
        alternates: {
            canonical: `https://www.solocasaschile.com/blog/${slug}`
        },
        openGraph: {
            title: post.title,
            description: post.excerpt || `Lee nuestro artículo sobre ${post.title} y descubre las mejores opciones para tu hogar en Chile.`,
            url: `https://www.solocasaschile.com/blog/${slug}`,
            images: post.coverImageUrl ? [
                {
                    url: post.coverImageUrl,
                    width: 1600,
                    height: 900,
                    alt: post.title
                }
            ] : [],
            type: 'article',
        }
    };
}

export default async function BlogPostPage({ params }: Props) {
    const { slug } = await params;

    // Sanity / Next.js deduplica los requests idénticos, por lo que este fetch no pega 2 veces a la API
    const post = await sanityClient.fetch(POST_QUERY, { slug }, {
        next: { tags: [`post-${slug}`], revalidate: 3600 }
    });

    if (!post) {
        notFound();
    }

    const schemaMarkup = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": post.title,
        "image": post.coverImageUrl || "https://www.solocasaschile.com/icon.png",
        "author": {
            "@type": "Organization",
            "name": "Equipo solocasaschile",
            "url": "https://www.solocasaschile.com"
        },
        "publisher": {
            "@type": "Organization",
            "name": "solocasaschile.com",
            "logo": {
                "@type": "ImageObject",
                "url": "https://www.solocasaschile.com/icon.png"
            },
            "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+56900000000",
                "contactType": "customer service",
                "areaServed": "CL",
                "availableLanguage": "Spanish"
            }
        },
        "datePublished": post.publishedAt || new Date().toISOString(),
        "dateModified": post.publishedAt || new Date().toISOString(),
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": `https://www.solocasaschile.com/blog/${post.slug}`
        }
    };

    return (
        <article className="bg-white min-h-screen">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }}
            />
            {/* Header */}
            <header className="border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-8">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-[#37FFDB] flex items-center justify-center shadow-sm">
                                <Hash className="w-5 h-5 text-[#3200C1]" />
                            </div>
                            <Link href="/" className="text-xl font-bold text-[#3200C1]">
                                solocasaschile.com
                            </Link>
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
                        Lectura Recomendada
                    </div>
                </div>
            </header>

            {/* Article Header */}
            <header className="bg-slate-50 border-b border-slate-100 py-16">
                <div className="max-w-[1000px] mx-auto px-6">
                    <Link href="/blog" className="inline-flex items-center gap-2 text-[#3200C1] font-bold mb-8 hover:underline">
                        <ArrowLeft className="w-4 h-4" /> Volver al blog
                    </Link>

                    <div className="flex items-center gap-3 mb-6">
                        <span className="bg-[#37FFDB] text-[#3200C1] px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest">
                            {post.category || "General"}
                        </span>
                        <span className="text-slate-400 text-sm font-bold">8 min de lectura</span>
                    </div>

                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#3200C1] leading-[1.1] mb-8">
                        {post.title}
                    </h1>

                    <div className="flex flex-wrap items-center justify-between gap-6 pb-8 border-b border-slate-200">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-[#3200C1] flex items-center justify-center text-[#37FFDB] font-black">
                                WS
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[#3200C1] font-bold">Equipo solocasaschile</span>
                                <span className="text-slate-400 text-sm">Escrito el {new Date(post.publishedAt || new Date()).toLocaleDateString('es-CL', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <span className="text-slate-400 text-sm font-bold mr-2">Compartir:</span>
                            <button className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-[#3200C1] hover:bg-[#3200C1] hover:text-white transition-all">
                                <Facebook className="w-4 h-4" />
                            </button>
                            <button className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-[#3200C1] hover:bg-[#3200C1] hover:text-white transition-all">
                                <Twitter className="w-4 h-4" />
                            </button>
                            <button className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-[#3200C1] hover:bg-[#3200C1] hover:text-white transition-all">
                                <Linkedin className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Featured Image */}
            {post.coverImageUrl && (
                <div className="max-w-[1200px] mx-auto px-6 -mt-12">
                    <div className="rounded-3xl overflow-hidden aspect-video shadow-2xl">
                        <img
                            src={post.coverImageUrl}
                            alt={post.title}
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>
            )}

            {/* Content */}
            <div className="max-w-[1000px] mx-auto px-6 py-20">
                <div className="flex flex-col lg:flex-row gap-16">

                    <div className="flex-1 prose prose-xl prose-slate max-w-none prose-headings:font-black prose-headings:text-[#3200C1] prose-p:text-slate-600 prose-p:leading-relaxed prose-strong:text-[#3200C1]">
                        {post.body ? (
                            <PortableText
                                value={post.body}
                                components={{
                                    block: {
                                        h2: ({ children }) => <h2 className="text-3xl font-black text-[#3200C1] mt-12 mb-6">{children}</h2>,
                                        h3: ({ children }) => <h3 className="text-2xl font-bold text-[#3200C1] mt-8 mb-4">{children}</h3>,
                                        normal: ({ children }) => <p className="text-slate-600 leading-relaxed mb-6">{children}</p>,
                                        blockquote: ({ children }) => <blockquote className="border-l-4 border-[#37FFDB] pl-6 py-2 my-8 italic text-slate-500 bg-slate-50 rounded-r-lg">{children}</blockquote>
                                    },
                                    marks: {
                                        strong: ({ children }) => <strong className="font-bold text-[#3200C1]">{children}</strong>,
                                        link: ({ children, value }) => (
                                            <a href={value.href} className="text-[#3200C1] underline decoration-[#37FFDB] decoration-2 underline-offset-4 hover:bg-[#37FFDB]/20 transition-colors">
                                                {children}
                                            </a>
                                        )
                                    }
                                }}
                            />
                        ) : (
                            <div className="text-center py-10">
                                <p className="text-slate-500 italic">No hay contenido principal para este artículo.</p>
                            </div>
                        )}

                        <div className="my-16 p-10 bg-[#37FFDB]/10 rounded-2xl border border-[#37FFDB]/20">
                            <h3 className="text-2xl font-black mb-4">🏠 ¿Buscas modelos de casas?</h3>
                            <p className="mb-6">En nuestro comparador puedes filtrar cientos de modelos por materialidad, precio y m².</p>
                            <Link href="/" className="brand-button-primary">Explorar Modelos</Link>
                        </div>
                    </div>

                    <aside className="lg:w-72 shrink-0">
                        <div className="sticky top-24 flex flex-col gap-8">
                            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                                <MessageSquare className="w-8 h-8 text-[#37FFDB] mx-auto mb-4" />
                                <h4 className="font-bold text-[#3200C1] mb-2">¿Tienes dudas?</h4>
                                <p className="text-sm text-slate-500 mb-4">Nuestros expertos pueden asesorarte gratis.</p>
                                <button id="contacto-asesoria" className="w-full py-3 bg-[#3200C1] text-white rounded-xl text-sm font-bold transition-transform hover:scale-105">Contactar Experto</button>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </article>
    );
}
