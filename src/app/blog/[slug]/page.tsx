import { ArrowLeft, Calendar, User, Share2, Facebook, Twitter, Linkedin, MessageSquare, ArrowRight, Hash } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

const POST_DATA: Record<string, any> = {
    "ahorrar-calefaccion-paneles-sip": {
        title: "Cómo ahorrar un 40% en calefacción con paneles SIP",
        category: "Guía Viral",
        image: "https://images.unsplash.com/photo-1448630360428-65456885c650?auto=format&fit=crop&q=80&w=1600",
        content: `
            <p>El ahorro energético no es solo una cuestión de ecología, sino de economía doméstica. En Chile, donde los inviernos pueden ser crudos, los <strong>paneles SIP</strong> se presentan como la solución definitiva.</p>
            <h2>¿Por qué el ahorro es tan significativo?</h2>
            <p>A diferencia de la construcción tradicional, el panel SIP crea un envolvente térmico continuo. Esto significa que no hay puentes térmicos por donde escape el calor.</p>
            <ul>
                <li><strong>Eficiencia del núcleo:</strong> El poliestireno de alta densidad actúa como una barrera impenetrable para el frío.</li>
                <li><strong>Hermeticidad:</strong> Las uniones selladas impiden filtraciones de aire.</li>
            </ul>
        `
    },
    "top-10-casas-modulares-chile-2026": {
        title: "Top 10 modelos de casas modulares en Chile 2026",
        category: "Tendencias",
        image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1600",
        content: `
            <p>Este 2026, la tendencia se inclina hacia la personalización y la sostenibilidad. Aquí te presentamos los modelos que están liderando las búsquedas en <strong>solocasaschile.com</strong>.</p>
            <h2>1. El Modelo Nórdico Minimalista</h2>
            <p>Líneas limpias y máximo aprovechamiento de luz natural.</p>
            <h2>2. La Cabaña Alpina Moderna</h2>
            <p>Ideal para el sur de Chile, combinando madera con tecnología SIP.</p>
        `
    },
    "modelos-casas-sip-tendencias": {
        title: "Modelos de Casas SIP: Tendencias de Diseño para 2026",
        category: "Diseño",
        image: "https://images.unsplash.com/photo-1464146072230-91cabc968266?auto=format&fit=crop&q=80&w=1600",
        content: `
            <p>Exploramos las innovaciones estéticas que están definiendo el futuro de la arquitectura con paneles SIP en este 2026.</p>
            <h2>Líneas Limpias y Eficiencia</h2>
            <p>La tendencia principal es el minimalismo funcional, donde cada metro cuadrado está optimizado térmicamente.</p>
        `
    },
    "prefabricadas-vs-tradicional": {
        title: "Casas Prefabricadas vs Construcción Tradicional en Chile: ¿Cuál es la mejor opción?",
        category: "Consejos",
        image: "https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?auto=format&fit=crop&q=80&w=1600",
        content: `
            <p>Elegir entre <strong>casas prefabricadas vs construcción tradicional en Chile</strong> no es solo una decisión de precio. En Chile, donde el clima, la logística y la mano de obra influyen fuerte, conviene comparar costo total, tiempos reales, durabilidad y flexibilidad del proyecto para determinar cuál es la mejor opción.</p>

            <h2>¿Qué se considera “Casa Prefabricada” en Chile?</h2>
            <p>Una <strong>casa prefabricada</strong> es una vivienda fabricada parcial o totalmente en un taller y luego transportada y montada en terreno. Puede ser panelizada (como las <a href="/blog/ventajas-casas-sip-chile" style="text-decoration: underline; color: #3200C1;">casas SIP</a>), modular o de estructura liviana.</p>
            <p><strong>La clave:</strong> Gran parte del trabajo se hace fuera de obra con procesos repetibles y controlados.</p>

            <h2>¿Qué es Construcción Tradicional?</h2>
            <p>La <strong>construcción tradicional</strong> se refiere a la obra hecha principalmente en terreno con sistemas como albañilería (ladrillo), hormigón armado o estructuras de madera ejecutadas in situ. Es más “artesanal” y depende directamente de las condiciones del lugar.</p>

            <h2>Casas Prefabricadas vs Tradicional: ¿Cuál conviene realmente?</h2>
            
            <h3>1) Comparación de Costos</h3>
            <p><strong>Costos prefabricadas:</strong> Precio inicial más “cerrado”. Eficiencia en fabricación pero ojo con lo que NO incluye (fundaciones, conexiones, permisos). Conoce más sobre <a href="/blog/financiamiento-casas-prefabricadas-chile" style="text-decoration: underline; color: #3200C1;">financiamiento para casas prefabricadas</a>.</p>
            <p><strong>Costos tradicional:</strong> Permite ajustar costos por etapas, pero es más sensible a imprevistos y alzas de materiales durante la construcción.</p>

            <h3>2) Tiempos de entrega y construcción</h3>
            <p><strong>Tiempos prefabricadas:</strong> Notablemente más rápidas. El montaje es eficiente y se reduce la exposición a climas adversos durante la obra. Ideal para proyectos con urgencia.</p>
            <p><strong>Tiempos tradicional:</strong> Más lenta por procesos húmedos, tiempos de secado y la necesaria coordinación de múltiples cuadrillas en terreno.</p>

            <h3>3) Durabilidad y mantenimiento</h3>
            <p>La <strong>durabilidad y vida útil</strong> depende de la calidad de ejecución más que del método constructivo. Una <strong>casa prefabricada</strong> con buenos sellos y mantención adecuada puede durar tanto como una <strong>construcción tradicional</strong> de hormigón. Ambas requieren cumplir con la normativa chilena.</p>

            <h2>Conclusión: ¿Cuándo elegir cada sistema constructivo?</h2>
            <ul>
                <li><strong>Elige una Casa Prefabricada si:</strong> Priorizas rapidez en la construcción, quieres un mayor control del presupuesto final y construyes en zonas de clima difícil (como el sur de Chile).</li>
                <li><strong>Elige Construcción Tradicional si:</strong> Quieres una personalización arquitectónica total desde cero o planeas ampliar la casa por etapas de forma compleja a largo plazo.</li>
            </ul>

            <h2>Consideraciones finales y costos ocultos</h2>
            <p>Antes de tomar una decisión entre <strong>prefabricadas vs tradicional</strong>, revisa este checklist que suele mover el presupuesto:</p>
            <ul>
                <li>Obras previas: Radier y fundaciones de hormigón.</li>
                <li>Transporte y logística de acceso al terreno.</li>
                <li>Instalaciones sanitarias y eléctricas (agua, luz, fosa séptica).</li>
                <li><a href="/blog/permisos-municipales-construccion-chile" style="text-decoration: underline; color: #3200C1;">Permisos y regularización municipal</a> (necesarios en ambos casos).</li>
            </ul>

            <p><strong>Consejo final:</strong> Pide presupuestos "llave en mano" comparables. No te quedes solo con el valor del kit básico de la casa prefabricada, analiza siempre el <strong>costo total habitado</strong>.</p>
        `
    },
    "ventajas-casas-sip-chile": {
        title: "Ventajas de las Casas SIP en Chile: Beneficios y Características",
        category: "Casas SIP",
        image: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&q=80&w=1600",
        content: `
            <p>Las <strong>casas SIP en Chile</strong> (Structural Insulated Panels o Paneles Estructurales Aislados) se han vuelto una alternativa cada vez más buscada por una razón simple: el país cuenta con climas muy exigentes y cambiantes, donde la eficiencia energética es fundamental.</p>
            
            <h2>Beneficios de las Casas SIP en el Clima Chileno</h2>
            <p>Desde lluvias intensas y frío extremo en el sur hasta el calor fuerte en la zona norte y central, la <strong>envolvente térmica</strong> de una vivienda hace toda la diferencia para tu calidad de vida.</p>
            
            <h3>1. Eficiencia Energética y Aislación Térmica Superior</h3>
            <p>El núcleo de poliuretano o poliestireno actúa como barrera de temperatura. Esto se traduce en más confort durante el año y un <a href="/blog/ahorrar-calefaccion-paneles-sip" style="text-decoration: underline; color: #3200C1;">ahorro de hasta un 40% en calefacción</a>. Las <strong>casas de paneles SIP</strong> mantienen el calor en invierno y el frescor en verano.</p>

            <h3>2. Rapidez de Construcción</h3>
            <p>La construcción en seco permite un ensamblaje mucho más veloz en comparación con construcciones de albañilería tradicional. Es ideal para zonas con ventanas de buen clima muy ajustadas, donde acortar los tiempos de obra es primordial.</p>

            <h3>3. Resistencia Estructural y Sismorresistencia</h3>
            <p>El panel SIP al unirse funciona de forma monolítica. En un país sísmico como Chile, su comportamiento estructural distribuye las cargas de manera óptima, aportando flexibilidad y resistencia superior.</p>

            <h2>Casas SIP vs Construcción Tradicional</h2>
            <p>Si te preguntas qué materialidad elegir, te invitamos a leer nuestra <a href="/blog/prefabricadas-vs-tradicional" style="text-decoration: underline; color: #3200C1;">comparativa de prefabricadas vs construcción tradicional en Chile</a> para entender cuál se adapta mejor a tu terreno y presupuesto.</p>
            
            <div style="margin-top: 2rem; padding: 1.5rem; background-color: #f8fafc; border-radius: 0.5rem; border-left: 4px solid #3200C1;">
                <h3 style="margin-top: 0; color: #3200C1;">¿Listo para dar el siguiente paso?</h3>
                <p>Nuestros expertos pueden asesorarte en la elección del mejor modelo SIP para tu nueva casa.</p>
                <a href="#contacto-asesoria" style="display: inline-block; background-color: #37FFDB; color: #3200C1; font-weight: bold; padding: 0.75rem 1.5rem; border-radius: 0.5rem; text-decoration: none; margin-top: 1rem;">Solicitar una asesoría gratuita</a>
            </div>
        `
    },
    "financiamiento-casas-prefabricadas-chile": {
        title: "Guía de Financiamiento para Casas Prefabricadas en Chile",
        category: "Guías de Compra",
        image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=1600",
        content: `
            <p>Financiar una casa prefabricada en Chile puede ser distinto a comprar una propiedad terminada. Aquí te explicamos las opciones disponibles para hacer realidad tu proyecto.</p>
            <h2>Opciones de Crédito</h2>
            <ul>
                <li><strong>Crédito Hipotecario:</strong> Algunas instituciones permiten financiar la construcción si el terreno está a tu nombre.</li>
                <li><strong>Créditos de Fines Generales:</strong> Una opción flexible para montos menores o terminaciones.</li>
            </ul>
            <h2>Convenios con Constructoras</h2>
            <p>Muchas empresas de casas modulares tienen alianzas con bancos para facilitar el proceso de aprobación.</p>
        `
    },
    "eficiencia-energetica-vivienda-chile": {
        title: "Eficiencia Energética: Cómo certificar tu vivienda en Chile",
        category: "Eficiencia Energética",
        image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&q=80&w=1600",
        content: `
            <p>En Chile, la Calificación Energética de Viviendas (CEV) es una herramienta clave para entender el desempeño térmico de tu hogar.</p>
            <h2>¿Por qué certificar?</h2>
            <p>Una vivienda eficiente no solo ahorra dinero, sino que tiene un mayor valor de reventa y proporciona un ambiente más saludable.</p>
            <h2>Aspectos Evaluados</h2>
            <ul>
                <li>Calidad de la envolvente térmica.</li>
                <li>Sistemas de climatización y agua caliente.</li>
                <li>Uso de energías renovables.</li>
            </ul>
        `
    },
    "permisos-municipales-construccion-chile": {
        title: "Permisos Municipales: Qué necesitas para construir legalmente",
        category: "Consejos",
        image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=1600",
        content: `
            <p>Construir sin permiso municipal puede traerte multas y problemas legales graves. Sigue estos pasos para regularizar tu obra en Chile.</p>
            <h2>Pasos Críticos</h2>
            <ol>
                <li><strong>Certificado de Informaciones Previas (CIP):</strong> Define qué puedes construir en tu terreno.</li>
                <li><strong>Permiso de Edificación:</strong> Aprobación de los planos por la Dirección de Obras Municipales (DOM).</li>
                <li><strong>Recepción Definitiva:</strong> El certificado que permite habitar la casa legalmente.</li>
            </ol>
        `
    }
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const post = POST_DATA[slug];

    if (slug === "ventajas-casas-sip-chile") {
        return {
            title: "Ventajas de las Casas SIP en Chile: Beneficios y Características",
            description: "Descubre cómo las casas SIP pueden mejorar tu calidad de vida en Chile con su eficiencia energética y rapidez de construcción.",
            alternates: {
                canonical: `https://www.solocasaschile.com/blog/${slug}`
            },
            openGraph: {
                title: "Ventajas de las Casas SIP en Chile: Beneficios y Características",
                description: "Descubre cómo las casas SIP pueden mejorar tu calidad de vida en Chile con su eficiencia energética y rapidez de construcción.",
                url: `https://www.solocasaschile.com/blog/${slug}`,
                images: [
                    {
                        url: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&q=80&w=1600",
                        width: 1600,
                        height: 900,
                        alt: "Ventajas casas SIP en Chile"
                    }
                ],
                type: 'article',
            }
        };
    }

    if (slug === "prefabricadas-vs-tradicional") {
        return {
            title: "Casas Prefabricadas vs Construcción Tradicional en Chile: ¿Cuál es la mejor opción?",
            description: "Compara casas prefabricadas y tradicionales en Chile: costos, tiempos y durabilidad analizados.",
            alternates: {
                canonical: `https://www.solocasaschile.com/blog/${slug}`
            },
            openGraph: {
                title: "Casas Prefabricadas vs Construcción Tradicional en Chile: ¿Cuál es la mejor opción?",
                description: "Compara casas prefabricadas y tradicionales en Chile: costos, tiempos y durabilidad analizados.",
                url: `https://www.solocasaschile.com/blog/${slug}`,
                images: [
                    {
                        url: "https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?auto=format&fit=crop&q=80&w=1600",
                        width: 1600,
                        height: 900,
                        alt: "Casas prefabricadas vs tradicionales"
                    }
                ],
                type: 'article',
            }
        };
    }

    if (slug === "financiamiento-casas-prefabricadas-chile") {
        return {
            title: "Financiamiento para Casas Prefabricadas en Chile: Guía 2026",
            description: "Descubre cómo obtener financiamiento para tu casa prefabricada o modular en Chile. Créditos hipotecarios, convenios y consejos financieros."
        };
    }

    if (slug === "eficiencia-energetica-vivienda-chile") {
        return {
            title: "Eficiencia Energética en Viviendas Chile: Guía y Certificación",
            description: "Aprende todo sobre la eficiencia energética en Chile, cómo certificar tu vivienda y ahorrar en consumos mensuales."
        };
    }

    if (slug === "permisos-municipales-construccion-chile") {
        return {
            title: "Permisos Municipales de Construcción en Chile: Guía DOM 2026",
            description: "Todo sobre permisos de edificación, recepciones municipales y cómo construir legalmente en Chile sin riesgos."
        };
    }

    if (post) {
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
                images: [
                    {
                        url: post.image,
                        width: 1600,
                        height: 900,
                        alt: post.title
                    }
                ],
                type: 'article',
            }
        };
    }

    return {
        title: "Blog de Vivienda Sostenible | solocasaschile.com",
        description: "Artículos, guías y consejos sobre casas SIP, prefabricadas y construcción eficiente en Chile.",
        alternates: {
            canonical: `https://www.solocasaschile.com/blog`
        }
    };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const post = POST_DATA[slug] || {
        title: "Guía Completa: Ventajas de las Casas SIP en el Clima Chileno",
        category: "Casas SIP",
        image: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&q=80&w=1600"
    };

    const schemaMarkup = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": post.title,
        "image": post.image,
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
        "datePublished": "2026-02-25T00:00:00+00:00",
        "dateModified": "2026-02-25T00:00:00+00:00",
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": `https://www.solocasaschile.com/blog/${slug}`
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
                            {post.category}
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
                                <span className="text-slate-400 text-sm">Escrito el 25 de Febrero, 2026</span>
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
            <div className="max-w-[1200px] mx-auto px-6 -mt-12">
                <div className="rounded-3xl overflow-hidden aspect-video shadow-2xl">
                    <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover"
                    />
                </div>
            </div>

            {/* Content */}
            <div className="max-w-[1000px] mx-auto px-6 py-20">
                <div className="flex flex-col lg:flex-row gap-16">

                    <div className="flex-1 prose prose-xl prose-slate max-w-none prose-headings:font-black prose-headings:text-[#3200C1] prose-p:text-slate-600 prose-p:leading-relaxed prose-strong:text-[#3200C1]">
                        {post.content ? (
                            <div dangerouslySetInnerHTML={{ __html: post.content }} />
                        ) : (
                            <>
                                <p className="text-2xl font-medium text-slate-500 mb-12 leading-relaxed italic border-l-4 border-[#37FFDB] pl-8">
                                    La construcción con paneles SIP ha revolucionado la industria habitacional en Chile, ofreciendo eficiencia térmica y rapidez.
                                </p>
                                <h2>¿Qué son los Paneles SIP?</h2>
                                <p>Un sistema de construcción modular que consiste en un núcleo de espuma aislante entre dos caras estructurales.</p>
                            </>
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
                                <button id="contacto-asesoria" className="w-full py-3 bg-[#3200C1] text-white rounded-xl text-sm font-bold">Contactar Experto</button>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </article>
    );
}
