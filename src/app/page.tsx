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
import SiteLogo from "@/components/SiteLogo";

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
    search: typeof rawParams.search === "string" ? rawParams.search : undefined,
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



      {/* Hero */}
      <div className="w-full relative">
        <Suspense fallback={<div className="w-full h-[50vh] animate-pulse bg-slate-100" />}>
          <HeroSlider models={randomModels} />
        </Suspense>
        
        {/* Floating Categories */}
        <div className="absolute -bottom-8 left-0 right-0 z-10 hidden md:block px-6">
          <div className="max-w-[1000px] mx-auto bg-white/70 backdrop-blur-xl border border-white/60 shadow-xl rounded-2xl p-4 flex items-center justify-center gap-3 flex-wrap">
            {[
              { label: "Prefabricadas", href: "/?category=Prefabricada+Madera", emoji: "🏠" },
              { label: "Casas SIP", href: "/?category=SIP", emoji: "🧱" },
              { label: "Modulares", href: "/?category=Modular", emoji: "📦" },
              { label: "Llave en Mano", href: "/?category=Llave+en+Mano", emoji: "🔑" },
              { label: "Metalcon", href: "/?category=Metalcon", emoji: "⚙️" },
            ].map((cat) => (
              <Link key={cat.label} href={cat.href} className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/80 hover:bg-[#3200C1] hover:text-white text-[#3200C1] text-sm font-black shadow-sm transition-all border border-slate-200">
                <span className="text-lg">{cat.emoji}</span> {cat.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Social Proof */}
      <div className="w-full bg-slate-50 border-b border-slate-100 pt-16 pb-12 px-6">
        <p className="text-center text-xs font-black text-slate-400 uppercase tracking-widest mb-8">Empresas que confían en nosotros</p>
        <div className="max-w-7xl mx-auto flex flex-wrap justify-center gap-x-12 gap-y-6 opacity-60 hover:opacity-100 transition-opacity duration-500">
           {companies.slice(0, 8).map((c: { company_name: string }) => (
              <span key={c.company_name} className="text-xl font-black text-slate-400 hover:text-[#3200C1] transition-colors">{c.company_name}</span>
           ))}
        </div>
      </div>

      {/* H1 SEO */}
      <section className="max-w-7xl mx-auto px-6 pt-16 pb-2 text-center md:text-left">
        <h1 className="text-3xl md:text-4xl font-black text-[#3200C1] leading-tight [text-wrap:balance]">
          Comparador de Casas Prefabricadas en Chile
        </h1>
        <p className="mt-4 text-base md:text-lg text-slate-600 max-w-3xl">
          Encuentra y compara modelos de <strong>casas prefabricadas</strong>, <strong>casas SIP</strong>,
          <strong> casas modulares</strong> y <strong>casas llave en mano</strong> en todo el país.
          Más de {totalCount} opciones certificadas con precios transparentes y ficha técnica.
        </p>
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

      {/* Modern CTA & Simplified SEO */}
      <section className="max-w-7xl mx-auto px-6 py-20 flex flex-col gap-16">
        {/* Registration CTA - 6 Meses Gratis */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#3200C1] to-[#1e0075] rounded-[32px] p-10 md:p-16 flex flex-col items-center text-center shadow-2xl">
           <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#37FFDB] rounded-full blur-[100px] opacity-20" />
           <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-[#37FFDB] rounded-full blur-[100px] opacity-20" />
           
           <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#37FFDB]/10 text-[#37FFDB] text-xs font-black uppercase tracking-widest mb-6 border border-[#37FFDB]/20">
              🎁 Lanzamiento Exclusivo Contratistas
           </div>
           
           <h2 className="text-4xl md:text-5xl font-black text-white mb-6 [text-wrap:balance]">
              Potencia tus ventas inmobiliarias sin costo
           </h2>
           
           <p className="text-lg md:text-xl text-white/80 max-w-3xl mb-10 leading-relaxed [text-wrap:balance]">
              Únete al mayor comparador de Chile. Sube tus modelos de casas prefabricadas y recibe prospectos calificados directo a tu WhatsApp. 
              <strong> Registra tu constructora hoy y obtén 4 meses de Plan Inicial Gratuito (Sube hasta 3 modelos).</strong>
           </p>
           
           <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto z-10">
              <Link href="/registro" className="flex items-center justify-center gap-2 bg-[#37FFDB] text-[#3200C1] font-black px-8 py-4 rounded-xl hover:brightness-110 active:scale-95 transition-all text-lg shadow-lg shadow-[#37FFDB]/30">
                 Registrar mi Empresa Gratis <ArrowRight className="w-5 h-5" />
              </Link>
           </div>
        </div>

        {/* Minimal SEO Cards */}
        <div>
          <h2 className="text-2xl font-black text-[#3200C1] mb-8 text-center">¿Qué tipos de casas encontrarás en la plataforma?</h2>
          <div className="grid md:grid-cols-4 gap-6 text-slate-600">
            {[
              { title: "🏠 Prefabricadas", desc: "Compara modelos de maderas chilenas desde 36 m² con precios reales y actualizados directamente por la fábrica." },
              { title: "🧱 Paneles SIP", desc: "Alta eficiencia térmica y acústica. Especiales para el clima del centro y sur de Chile, garantizando abrigo y economía." },
              { title: "📦 Modulares", desc: "Soluciones de vanguardia industrializadas y ampliables. Llegan prearmadas y listas para montar en tu parcela." },
              { title: "🔑 Llave en Mano", desc: "Olvídate por completo del estrés de la construcción. Cotiza empresas que te entregan la casa 100% terminada y lista." }
            ].map(item => (
              <div key={item.title} className="bg-slate-50 p-6 rounded-2xl border border-slate-100 hover:border-[#3200C1]/20 transition-colors">
                  <h3 className="text-lg font-black text-[#3200C1] mb-3">{item.title}</h3>
                  <p className="text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
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
              <div className="mt-auto flex flex-col gap-3 pt-4 border-t border-slate-50">
                <div className="flex flex-col min-w-0">
                  <span className="text-[10px] uppercase font-bold text-slate-400 mb-0.5">Formatos</span>
                  <span className="text-xs font-bold text-[#3200C1] truncate">
                    {house.delivery_modes || "N/A"}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/modelo/${house.slug || house.id}`}
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
