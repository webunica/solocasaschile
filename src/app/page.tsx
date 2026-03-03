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
import { Bed, Bath, Hash, Scale, MapPin, Inbox, Star, Crown } from "lucide-react";

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
        <h2 className="text-2xl font-black text-[#3200C1] mb-4">¿Qué encontrarás en SolocasasChile?</h2>
        <div className="grid md:grid-cols-2 gap-8 text-slate-600">
          <div>
            <h3 className="text-lg font-bold text-[#3200C1] mb-2">Casas Prefabricadas</h3>
            <p>Modelos de casas prefabricadas de madera desde 36 m² con precios actualizados. Compara kits básicos, packs completos y modalidades llave en mano de las principales constructoras de Chile.</p>
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#3200C1] mb-2">Casas SIP</h3>
            <p>Las casas con paneles SIP ofrecen mejor aislación térmica y acústica. Encuentra empresas especializadas en construcción con paneles SIP en todo Chile.</p>
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#3200C1] mb-2">Casas Modulares</h3>
            <p>Soluciones de vivienda modular e industrializada para distintos terrenos y presupuestos. Desde módulos de 15 m² hasta viviendas familiares de 169 m².</p>
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#3200C1] mb-2">Casas Llave en Mano</h3>
            <p>¿Quieres tu casa lista para habitar? Compara empresas que ofrecen instalación, armado y entrega llave en mano en tu terreno en todo Chile.</p>
          </div>
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
              <div className="mt-auto flex items-center justify-between gap-4 pt-4 border-t border-slate-50">
                <div className="flex flex-col min-w-0">
                  <span className="text-[10px] uppercase font-bold text-slate-400 mb-0.5">Formatos</span>
                  <span className="text-xs font-bold text-[#3200C1] truncate">
                    {house.delivery_modes || "N/A"}
                  </span>
                </div>

                <Link
                  href={`/modelo/${house.id}`}
                  className="brand-button-primary"
                  prefetch={false}
                >
                  Ver Modelo
                </Link>
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
