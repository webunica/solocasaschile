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
        title: "Casas Prefabricadas vs. Construcción Tradicional: ¿Cuál conviene más?",
        category: "Consejos",
        image: "https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?auto=format&fit=crop&q=80&w=1600",
        content: `
            <p>Elegir entre casas prefabricadas y construcción tradicional no es solo una decisión de precio. En Chile, donde el clima, la logística y la mano de obra influyen fuerte, conviene comparar costo total, tiempos reales, durabilidad y flexibilidad del proyecto.</p>

            <h2>¿Qué se considera “Casa Prefabricada” en Chile?</h2>
            <p>Una casa prefabricada es una vivienda fabricada parcial o totalmente en un taller y luego transportada y montada en terreno. Puede ser panelizada, modular o de estructura liviana.</p>
            <p><strong>La clave:</strong> Gran parte del trabajo se hace fuera de obra con procesos repetibles y controlados.</p>

            <h2>¿Qué es Construcción Tradicional?</h2>
            <p>Se refiere a la obra hecha principalmente en terreno con sistemas como albañilería (ladrillo), hormigón armado o estructuras de madera ejecutadas in situ. Es más “artesanal” y depende directamente de las condiciones del lugar.</p>

            <h2>Comparación rápida: ¿Qué conviene realmente?</h2>
            
            <h3>1) Costos</h3>
            <p><strong>Prefabricadas:</strong> Precio inicial más “cerrado”. Eficiencia en fabricación pero ojo con lo que NO incluye (fundaciones, conexiones, permisos).</p>
            <p><strong>Tradicional:</strong> Permite ajustar costos por etapas, pero es más sensible a imprevistos y alzas de materiales.</p>

            <h3>2) Tiempos de entrega</h3>
            <p><strong>Prefabricadas:</strong> Notablemente más rápidas. El montaje es eficiente y se reduce la exposición a climas adversos durante la obra.</p>
            <p><strong>Tradicional:</strong> Más lenta por procesos húmedos y coordinación de múltiples cuadrillas.</p>

            <h3>3) Durabilidad</h3>
            <p>La durabilidad depende de la <strong>calidad de ejecución</strong> más que del método. Una prefabricada con buenos sellos y mantención puede durar tanto como una de hormigón.</p>

            <h2>¿Cuándo elegir cada una?</h2>
            <ul>
                <li><strong>Elige Prefabricada si:</strong> Priorizas rapidez, quieres control de presupuesto y construyes en zonas de clima difícil (como el sur).</li>
                <li><strong>Elige Tradicional si:</strong> Quieres personalización arquitectónica total o planeas ampliar la casa por etapas de forma compleja.</li>
            </ul>

            <h2>Costos ocultos a considerar</h2>
            <p>Antes de decidir, revisa este checklist que suele mover el presupuesto:</p>
            <ul>
                <li>Radier y fundaciones.</li>
                <li>Transporte y logística de acceso.</li>
                <li>Instalaciones (agua, luz, fosa séptica).</li>
                <li>Permisos y regularización municipal.</li>
            </ul>

            <p><strong>Consejo final:</strong> Pide presupuestos "llave en mano" comparables. No compares solo el valor del kit, sino el costo total habitado.</p>
        `
    },
    "ventajas-casas-sip-chile": {
        title: "Guía Completa: Ventajas de las Casas SIP en el Clima Chileno",
        category: "Casas SIP",
        image: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&q=80&w=1600",
        content: `
            <p>Las casas SIP (Structural Insulated Panels) se han vuelto una alternativa cada vez más buscada en Chile por una razón simple: el país tiene climas muy exigentes y cambiantes.</p>
            <h2>Beneficios en el Clima Chileno</h2>
            <p>Desde lluvias intensas en el sur hasta calor fuerte en el norte, la envolvente térmica de una vivienda hace toda la diferencia.</p>
            <h3>Principales Ventajas:</h3>
            <ul>
                <li><strong>Aislación térmica superior:</strong> Más confort todo el año y ahorro significativo en calefacción.</li>
                <li><strong>Construcción rápida:</strong> Ideal para zonas donde el clima puede retrasar las obras tradicionales.</li>
            </ul>
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
            title: "Ventajas de las Casas SIP en Chile: Guía Completa 2026",
            description: "Conoce las ventajas de las casas SIP en el clima chileno: aislación térmica, ahorro en calefacción y rapidez de construcción."
        };
    }

    if (slug === "prefabricadas-vs-tradicional") {
        return {
            title: "Casas Prefabricadas vs Tradicional en Chile: ¿Cuál conviene?",
            description: "Compara casas prefabricadas vs construcción tradicional en Chile. Analizamos costos, tiempos y durabilidad."
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
            description: post.excerpt || `Lee nuestro artículo sobre ${post.title} y descubre las mejores opciones para tu hogar en Chile.`
        };
    }

    return {
        title: "Blog de Vivienda Sostenible | solocasaschile.com",
        description: "Artículos, guías y consejos sobre casas SIP, prefabricadas y construcción eficiente en Chile."
    };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const post = POST_DATA[slug] || {
        title: "Guía Completa: Ventajas de las Casas SIP en el Clima Chileno",
        category: "Casas SIP",
        image: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&q=80&w=1600"
    };

    return (
        <article className="bg-white min-h-screen">
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
                                <button className="w-full py-3 bg-[#3200C1] text-white rounded-xl text-sm font-bold">Contactar Experto</button>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </article>
    );
}
