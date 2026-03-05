import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getModels, getDistinctCompanies, getDistinctCategories, getRandomModels, ModelRow } from "@/lib/db";
import { FiltersSidebar } from "@/components/FiltersSidebar";
import { HeroSlider } from "@/components/HeroSlider";
import { AdCarousel } from "@/components/AdCarousel";
import { FeaturedCompanyBanner } from "@/components/FeaturedCompanyBanner";
import { SortDropdown } from "@/components/SortDropdown";
import { Pagination } from "@/components/Pagination";
import { formatPrice } from "@/lib/utils";
import { Bed, Bath, Hash, Scale, MapPin, Inbox, Star, Crown, ArrowRight, ExternalLink } from "lucide-react";
import VisitPublicationButton from "@/components/VisitPublicationButton";

import { BlogCarousel } from "@/components/BlogCarousel";
import { ConstructorBanner } from "@/components/ConstructorBanner";

export const metadata: Metadata = {
  title: "Casas Prefabricadas, SIP y Modulares en Chile | Comparador de Precios 2026",
  description:
    "Compara más de 200 modelos de casas prefabricadas, casas SIP, casas modulares y llave en mano en Chile. Precios actualizados, fotos y ficha técnica de cada constructora. Cotiza gratis.",
  alternates: { canonical: "https://www.solocasaschile.com" },
  openGraph: {
    title: "Casas Prefabricadas, SIP y Modulares en Chile | Precios 2026",
    description:
      "El comparador más completo de casas prefabricadas Chile. Encuentra modelos desde 36 m² de las mejores empresas.",
    url: "https://www.solocasaschile.com",
    images: [{ url: "https://www.solocasaschile.com/og-home.jpg", width: 1200, height: 630, alt: "Casas prefabricadas en Chile - SolocasasChile" }],
  },
};

export default async function HomePage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const rawParams = await searchParams;

  // Parse manually for safe filtering since it's going into SQLite
  const filtersParams = {
    company: typeof rawParams.company === "string" ? rawParams.company : undefined,
    category: typeof rawParams.category === "string" ? rawParams.category : undefined,
    minPrice: rawParams.minPrice ? parseInt(rawParams.minPrice as string) : undefined,
    maxPrice: rawParams.maxPrice ? parseInt(rawParams.maxPrice as string) : undefined,
    minSurface: rawParams.minSurface ? parseInt(rawParams.minSurface as string) : undefined,
    bedrooms: rawParams.bedrooms ? parseInt(rawParams.bedrooms as string) : undefined,
    bathrooms: rawParams.bathrooms ? parseInt(rawParams.bathrooms as string) : undefined,
    sort: typeof rawParams.sort === "string" ? rawParams.sort : undefined,
    page: typeof rawParams.page === "string" ? parseInt(rawParams.page) : 1,
    limit: 20
  };

  // All DB fetches run in parallel — getModels is only called ONCE here.
  const [
    { models, totalCount },
    companies,
    categories,
    randomModels
  ] = await Promise.all([
    getModels(filtersParams),
    getDistinctCompanies(),
    getDistinctCategories(),
    getRandomModels(5)
  ]);

  // JSON-LD WebSite + SearchAction
  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "SolocasasChile.com",
    url: "https://www.solocasaschile.com",
    description: "Comparador de casas prefabricadas, SIP, modulares y llave en mano en Chile.",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://www.solocasaschile.com/?category={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <div className="min-h-screen bg-white">
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />

      {/* Header */}
      <header className="border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#37FFDB] flex items-center justify-center shadow-sm">
                <Hash className="w-5 h-5 text-[#3200C1]" aria-hidden="true" />
              </div>
              <Link href="/" className="text-xl font-bold text-[#3200C1]" aria-label="SolocasasChile.com - Inicio">
                solocasaschile.com
              </Link>
            </div>

            <nav className="hidden md:flex items-center gap-6" aria-label="Navegación principal">
              <Link href="/" className="text-sm font-bold text-[#3200C1] hover:text-[#37FFDB] transition-colors">
                Inicio
              </Link>
              <Link href="/blog" className="text-sm font-bold text-[#3200C1] hover:text-[#37FFDB] transition-colors">
                Publicaciones
              </Link>
            </nav>
          </div>

          <div className="text-sm font-medium text-slate-500">
            {totalCount} Modelos encontrados
          </div>
        </div>
      </header>

      {/* Hero */}
      <div className="w-full">
        <Suspense fallback={<div className="w-full h-[50vh] animate-pulse bg-slate-100" />}>
          <HeroSlider models={randomModels} />
        </Suspense>
      </div>

      {/* H1 SEO — visible para buscadores, estilo contenido */}
      <section className="max-w-7xl mx-auto px-6 pt-10 pb-2">
        <h1 className="text-3xl md:text-4xl font-black text-[#3200C1] leading-tight [text-wrap:balance]">
          Comparador de Casas Prefabricadas en Chile
        </h1>
        <p className="mt-2 text-base md:text-lg text-slate-600 max-w-3xl">
          Encuentra y compara modelos de <strong>casas prefabricadas</strong>, <strong>casas SIP</strong>,
          <strong> casas modulares</strong> y <strong>casas llave en mano</strong> en Chile.
          Más de {totalCount} opciones de las principales constructoras del país, con precios, fotos y ficha técnica.
        </p>
      </section>

      {/* Categorías SEO – H2 links internos */}
      <section className="max-w-7xl mx-auto px-6 py-6" aria-label="Categorías de casas prefabricadas">
        <h2 className="sr-only">Categorías de casas prefabricadas en Chile</h2>
        <div className="flex flex-wrap gap-3">
          {[
            { label: "Casas Prefabricadas", href: "/?category=Prefabricada+Madera", emoji: "🏠" },
            { label: "Casas SIP", href: "/?category=SIP", emoji: "🧱" },
            { label: "Casas Modulares", href: "/?category=Modular", emoji: "📦" },
            { label: "Casas Llave en Mano", href: "/?category=Llave+en+Mano", emoji: "🔑" },
            { label: "Casas Metalcon", href: "/?category=Metalcon", emoji: "⚙️" },
            { label: "Casas desde 36 m²", href: "/?minSurface=0&maxSurface=40", emoji: "📐" },
          ].map((cat) => (
            <Link
              key={cat.label}
              href={cat.href}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 border-[#3200C1]/20 text-sm font-bold text-[#3200C1] hover:bg-[#3200C1] hover:text-white hover:border-[#3200C1] transition-all"
            >
              <span>{cat.emoji}</span>
              {cat.label}
            </Link>
          ))}
        </div>
      </section>

      <Suspense fallback={null}>
        <ConstructorBanner />
      </Suspense>

      <AdCarousel />

      <FeaturedCompanyBanner />

      {/* Results section con id para anchor */}
      <main id="results" className="max-w-[1600px] w-full mx-auto px-6 pt-8 pb-12 flex flex-col xl:flex-row gap-8 items-start">
        {/* Sidebar Filter */}
        <Suspense fallback={<div className="hidden xl:block w-80 h-[80vh] bg-white border border-slate-100 animate-pulse rounded-lg shrink-0" />}>
          <FiltersSidebar companies={companies} categories={categories} />
        </Suspense>

        {/* Results */}
        <div className="flex-1 w-full flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row justify-between items-center bg-slate-50 p-4 rounded-xl border border-slate-100 shadow-sm">
            <div className="text-sm font-bold text-slate-600 mb-4 sm:mb-0">
              <h2 className="inline text-sm font-bold text-slate-600">
                Mostrando <span className="text-[#3200C1]">{models.length}</span> de <span className="text-[#3200C1]">{totalCount}</span> modelos de casas prefabricadas en Chile
              </h2>
            </div>
            <SortDropdown />
          </div>

          {/* Models Grid — rendered directly, no second DB call */}
          <div className="w-full grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6 text-[22px]">
            <ModelsGrid models={models} />
          </div>

          <Pagination totalCount={totalCount} limit={filtersParams.limit} />
        </div>
      </main>

      <BlogCarousel />

      {/* Sección SEO textual al final */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        {/* Bloque 1: Qué encontrarás */}
        <h2 className="text-2xl font-black text-[#3200C1] mb-4">¿Qué encontrarás en SolocasasChile?</h2>
        <div className="grid md:grid-cols-2 gap-8 text-slate-600 mb-16">
          <div>
            <h3 className="text-lg font-bold text-[#3200C1] mb-2">Casas Prefabricadas</h3>
            <p>Modelos de casas prefabricadas de madera desde 36 m² con precios actualizados. Compara kits básicos, packs completos y modalidades llave en mano de las principales constructoras de Chile.</p>
            <Link href="/?category=Prefabricada+Madera" className="inline-flex items-center gap-1 mt-3 text-sm font-black text-[#3200C1] hover:text-[#37FFDB] transition-colors group">
              Ver casas prefabricadas disponibles <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
            </Link>
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#3200C1] mb-2">Casas SIP</h3>
            <p>Las casas con paneles SIP ofrecen mejor aislación térmica y acústica. Encuentra empresas especializadas en construcción con paneles SIP en todo Chile.</p>
            <Link href="/?category=SIP" className="inline-flex items-center gap-1 mt-3 text-sm font-black text-[#3200C1] hover:text-[#37FFDB] transition-colors group">
              Ver casas SIP disponibles <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
            </Link>
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#3200C1] mb-2">Casas Modulares</h3>
            <p>Soluciones de vivienda modular e industrializada para distintos terrenos y presupuestos. Desde módulos de 15 m² hasta viviendas familiares de 169 m².</p>
            <Link href="/?category=Modular" className="inline-flex items-center gap-1 mt-3 text-sm font-black text-[#3200C1] hover:text-[#37FFDB] transition-colors group">
              Ver casas modulares disponibles <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
            </Link>
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#3200C1] mb-2">Casas Llave en Mano</h3>
            <p>¿Quieres tu casa lista para habitar? Compara empresas que ofrecen instalación, armado y entrega llave en mano en tu terreno en todo Chile.</p>
            <Link href="/?category=Llave+en+Mano" className="inline-flex items-center gap-1 mt-3 text-sm font-black text-[#3200C1] hover:text-[#37FFDB] transition-colors group">
              Ver casas llave en mano <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
            </Link>
          </div>
        </div>

        {/* Bloque 2: Ventajas */}
        <h2 className="text-2xl font-black text-[#3200C1] mb-6">Ventajas de las Casas Prefabricadas en Chile</h2>
        <p className="text-slate-600 mb-8 max-w-3xl">Las casas prefabricadas han revolucionado el mercado inmobiliario en Chile, ofreciendo una alternativa accesible, rápida y eficiente frente a la construcción tradicional. Estas son las principales razones por las que cada vez más familias las eligen.</p>
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {[
            {
              title: "Ahorro Económico",
              text: "Su costo es significativamente menor al de una construcción tradicional gracias a la producción industrializada y la reducción de desperdicios en fábrica. Puedes acceder a una vivienda digna sin endeudarte de por vida.",
            },
            {
              title: "Construcción Rápida",
              text: "Al fabricarse en planta y ensamblarse en terreno, los tiempos de entrega se reducen hasta en un 60% respecto a la construcción convencional. Algunas empresas entregan tu casa en menos de 30 días.",
            },
            {
              title: "Eficiencia Energética",
              text: "Las tecnologías SIP y Metalcon ofrecen excelente aislación térmica y acústica, reduciendo los costos de calefacción hasta en un 40% y haciéndolas ideales para el clima de la zona sur de Chile.",
            },
          ].map(({ title, text }) => (
            <div key={title} className="bg-slate-50 rounded-xl p-6 border border-slate-100">
              <div className="w-2 h-6 bg-[#37FFDB] rounded-full mb-3" aria-hidden="true" />
              <h3 className="text-base font-black text-[#3200C1] mb-2">{title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{text}</p>
            </div>
          ))}
        </div>

        {/* Bloque 3: Tipos */}
        <h2 className="text-2xl font-black text-[#3200C1] mb-6">Tipos de Casas Prefabricadas Disponibles en Chile</h2>
        <p className="text-slate-600 mb-8 max-w-3xl">Conocer las diferencias entre los tipos de construcción prefabricada te ayudará a elegir la opción más adecuada para tu terreno, presupuesto y clima.</p>
        <div className="grid md:grid-cols-2 gap-8 mb-16 text-slate-600">
          <div>
            <h3 className="text-lg font-bold text-[#3200C1] mb-2">Casas con Paneles SIP</h3>
            <p>Los paneles SIP (Structural Insulated Panels) son la tecnología más eficiente del mercado. Combinan estructura y aislación en un solo elemento, reduciendo puentes térmicos y costos de climatización. Son ideales para zonas con temperaturas extremas como La Araucanía, Los Lagos y Los Ríos.</p>
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#3200C1] mb-2">Casas Modulares</h3>
            <p>Se construyen en secciones independientes que se ensamblan en el terreno. Ofrecen flexibilidad para crecer: puedes comenzar con un módulo básico y agregar dormitorios o áreas en etapas posteriores. Son una excelente opción para terrenos con difícil acceso.</p>
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#3200C1] mb-2">Casas Metalcon</h3>
            <p>Utilizan perfiles de acero galvanizado liviano como estructura principal. Son muy resistentes a sismos, lo que las hace particularmente adecuadas para Chile. Además, su estructura metálica no se pudre, no es atacada por termitas y tiene una vida útil superior a los 50 años.</p>
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#3200C1] mb-2">Casas de Madera Prefabricada</h3>
            <p>La tradición constructiva chilena en madera cuenta hoy con versiones prefabricadas que combinan lo mejor de ambos mundos: la calidez del material natural con la precisión de la manufactura en fábrica. Disponibles desde 36 m² en kits de armado propio hasta entregas llave en mano.</p>
          </div>
        </div>

        {/* Bloque 4: Cómo elegir */}
        <h2 className="text-2xl font-black text-[#3200C1] mb-6">¿Cómo Elegir tu Casa Prefabricada Ideal?</h2>
        <p className="text-slate-600 mb-8 max-w-3xl">Con más de {totalCount} modelos disponibles en SolocasasChile es fácil sentirse abrumado. Estos tres factores te ayudarán a filtrar las opciones y tomar una decisión informada.</p>
        <div className="grid md:grid-cols-3 gap-6 mb-12 text-slate-600">
          {[
            {
              step: "01",
              title: "Define tu Presupuesto",
              text: "Establece un rango de precio realista considerando el valor del kit o la casa terminada, el costo de la fundación, la instalación y los permisos municipales. Usa nuestros filtros de precio para acotar resultados al instante.",
            },
            {
              step: "02",
              title: "Considera tu Terreno",
              text: "Las características del suelo, la pendiente y el acceso al predio determinan qué tipo de construcción es viable. Algunos fabricantes ofrecen asesoría técnica gratuita antes de cotizar.",
            },
            {
              step: "03",
              title: "Compara Fabricantes",
              text: "Evalúa la reputación del fabricante, sus años de experiencia, los materiales que utilizan y las garantías que ofrecen. En SolocasasChile verificamos y agrupamos la información de cada empresa para que puedas comparar fácilmente.",
            },
          ].map(({ step, title, text }) => (
            <div key={step} className="relative bg-white rounded-xl p-6 border border-slate-100 shadow-sm">
              <span className="absolute -top-3 -left-3 w-8 h-8 bg-[#3200C1] text-[#37FFDB] text-xs font-black rounded-full flex items-center justify-center shadow-md" aria-hidden="true">{step}</span>
              <h3 className="text-base font-black text-[#3200C1] mb-2 mt-1">{title}</h3>
              <p className="text-sm leading-relaxed">{text}</p>
            </div>
          ))}
        </div>

        {/* CTA Final */}
        <div className="bg-[#3200C1] rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-white mb-2 [text-wrap:balance]">¿Listo para comparar y cotizar?</h2>
            <p className="text-white/70 max-w-xl">Usa nuestro comparador gratuito, aplica filtros por precio, m², dormitorios y constructora, y solicita tu cotización en minutos.</p>
          </div>
          <Link
            href="#results"
            className="shrink-0 inline-flex items-center gap-2 bg-[#37FFDB] text-[#3200C1] font-black px-8 py-4 rounded-[4px] hover:brightness-110 active:scale-95 transition-all text-base whitespace-nowrap"
          >
            Usar el Comparador Gratuito <ArrowRight className="w-5 h-5" aria-hidden="true" />
          </Link>
        </div>
      </section>
    </div>
  );
}

// ─── Models Grid ─────────────────────────────────────────────────────────────
// Receives pre-fetched models — NO additional DB call.
function ModelsGrid({ models }: { models: ModelRow[] }) {
  if (models.length === 0) {
    return (
      <div className="col-span-full py-24 flex flex-col items-center justify-center text-center glass-card border-dashed">
        <div className="w-20 h-20 rounded-lg bg-slate-50 flex items-center justify-center mb-6 shadow-sm">
          <Inbox className="w-10 h-10 text-slate-400" />
        </div>
        <h3 className="text-2xl font-bold text-[#3200C1] mb-3">Sin resultados</h3>
        <p className="text-slate-500 max-w-md text-[22px]">No logramos encontrar modelos que coincidan exactamente con estos parámetros. Intenta ajustar los filtros.</p>
      </div>
    );
  }

  return (
    <>
      {models.map((house: ModelRow, index: number) => {
        const plan = house.company_plan || "starter";
        const isConstructor = plan === "constructor";
        const isBuilder = plan === "builder";
        // Eagerly load and prioritize the first 4 cards (above the fold on desktop)
        const isAboveFold = index < 4;
        const imageUrl = house.image_urls ? house.image_urls.split(",")[0].trim() : null;

        return (
          <article key={house.id} className={`group relative rounded-[4px] overflow-hidden bg-white border transition-all duration-500 shadow-sm hover:shadow-md flex flex-col ${isConstructor ? "border-amber-300 ring-1 ring-amber-200 hover:border-amber-400" :
            isBuilder ? "border-blue-200 hover:border-blue-300" :
              "border-slate-100 hover:border-[#37FFDB]"
            }`}>
            {/* Top Image Section */}
            <div className="relative w-full aspect-[4/3] sm:aspect-video overflow-hidden bg-slate-50">
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={`${house.model_name} - ${house.company_name} - Casa prefabricada ${house.surface_m2 ? house.surface_m2 + " m²" : ""} en Chile`}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1536px) 50vw, 33vw"
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                  loading={isAboveFold ? "eager" : "lazy"}
                  priority={isAboveFold}
                  quality={80}
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50 text-slate-300">
                  <span className="text-xs tracking-widest uppercase font-bold text-slate-400 mb-2">Sin Imagen</span>
                </div>
              )}

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#3200C1]/40 to-transparent" />

              {/* Labels */}
              <div className="absolute top-4 inset-x-4 flex justify-between items-start">
                <div className="inline-flex w-fit items-center gap-1.25 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-sm text-[#3200C1] text-xs font-bold shadow-sm">
                  <MapPin className="w-3 h-3" />
                  {house.company_name}
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  {/* Badge de Plan */}
                  {isConstructor && (
                    <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-amber-400 text-amber-900 text-[9px] uppercase font-black shadow-sm">
                      <Crown className="w-3 h-3" /> Plan Destacado
                    </div>
                  )}
                  {isBuilder && (
                    <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-blue-500 text-white text-[9px] uppercase font-black shadow-sm">
                      <Star className="w-3 h-3" /> Plan Crecer
                    </div>
                  )}
                  <div className="inline-flex w-fit px-2.5 py-1 rounded-full bg-[#37FFDB] text-[#3200C1] text-[10px] uppercase font-black shadow-sm">
                    {house.category}
                  </div>
                </div>
              </div>
            </div>

            {/* Lower Content */}
            <div className="p-5 flex flex-col flex-1 gap-5 bg-white">
              <div className="flex flex-col gap-1">
                <h3 className="text-xl font-black text-[#3200C1]">
                  {house.model_name}
                </h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-[#3200C1] tabular-nums">
                    {formatPrice(house.price_from, house.currency)}
                  </span>
                  <span className="text-xs font-bold text-slate-400">/ Desde</span>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                <FeatureItem icon={<Scale className="w-3.5 h-3.5" />} label="Superficie" value={`${house.surface_m2 || "--"} m²`} />
                <FeatureItem icon={<Bed className="w-3.5 h-3.5" />} label="Dorms" value={house.bedrooms || "--"} />
                <FeatureItem icon={<Bath className="w-3.5 h-3.5" />} label="Baños" value={house.bathrooms || "--"} />
              </div>

              {/* CTA row */}
              <div className="mt-auto flex flex-col gap-3 pt-4 border-t border-slate-50">
                <div className="flex flex-col min-w-0">
                  <span className="text-[10px] uppercase font-bold text-slate-400 mb-0.5">Formatos</span>
                  <span className="text-xs font-bold text-[#3200C1] truncate">
                    {house.delivery_modes || "N/A"}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/modelo/${house.id}`}
                    className="flex-1 text-center py-2.5 rounded-[4px] border-2 border-[#3200C1] text-[#3200C1] font-black text-xs hover:bg-[#3200C1] hover:text-white transition-all"
                    prefetch={false}
                  >
                    Ver Detalle
                  </Link>
                  {house.model_url && (
                    <VisitPublicationButton
                      modelId={house.id}
                      modelName={house.model_name}
                      companyName={house.company_name}
                      targetUrl={house.model_url}
                      source="card"
                      label="Ver Publicación"
                    />
                  )}
                </div>
              </div>
            </div>
          </article>
        );
      })}
    </>
  );
}

function FeatureItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col justify-center gap-1 p-2.5 rounded-[4px] bg-slate-50 border border-slate-100 group-hover:bg-[#37FFDB]/10 transition-colors">
      <div className="flex items-center gap-1.5 text-slate-400">
        {icon}
        <span className="text-[9px] uppercase font-black tracking-widest">{label}</span>
      </div>
      <span className="text-sm font-black text-[#3200C1]">{value}</span>
    </div>
  );
}
