import Image from "next/image";
import Link from "next/link";
import { Bed, Bath, Scale, MapPin, Crown, Star, ExternalLink } from "lucide-react";
import { sanityClient } from "@/lib/sanity.client";
import { formatPrice } from "@/lib/utils";
import VisitPublicationButton from "@/components/VisitPublicationButton";

interface SimilarHouse {
    _id: string;
    model_name: string;
    company_name: string;
    category: string;
    surface_m2: number;
    bedrooms: number;
    bathrooms: number;
    price_from: number;
    currency: string;
    model_url: string;
    company_plan?: string;
    imageUrl?: string;
}

interface Props {
    currentModelId: string;
    category?: string;
    bedrooms?: number;
    surface_m2?: number;
    company_name?: string;
}

async function getSimilarModels({
    currentModelId,
    category,
    bedrooms,
    surface_m2,
    company_name,
}: Props): Promise<SimilarHouse[]> {
    // Busca modelos con características similares:
    // 1) misma categoría, o
    // 2) mismo número de dormitorios ± 1, o
    // 3) superficie similar (± 30 m²)
    // Excluye el modelo actual y empresas distintas de la misma empresa
    const minSurface = (surface_m2 || 0) - 30;
    const maxSurface = (surface_m2 || 0) + 30;
    const minBeds = Math.max(1, (bedrooms || 1) - 1);
    const maxBeds = (bedrooms || 99) + 1;

    const query = `*[
    _type == "houseModel" &&
    is_active != false &&
    _id != $currentId &&
    (
      category == $category ||
      (bedrooms >= $minBeds && bedrooms <= $maxBeds) ||
      (surface_m2 >= $minSurface && surface_m2 <= $maxSurface)
    )
  ] | order(price_from asc) [0...6] {
    _id,
    model_name,
    company_name,
    category,
    surface_m2,
    bedrooms,
    bathrooms,
    price_from,
    currency,
    model_url,
    "imageUrl": coalesce(images[0].asset->url, image_urls[0]),
    "company_plan": *[_type=="companyUser" && company_name==^.company_name && is_active!=false][0].plan
  }`;

    try {
        const results = await sanityClient.fetch(
            query,
            {
                currentId: currentModelId,
                category: category || "",
                minBeds,
                maxBeds,
                minSurface,
                maxSurface,
            },
            { next: { revalidate: 3600 } }
        );
        return results || [];
    } catch {
        return [];
    }
}

export default async function SimilarPropertiesSection({
    currentModelId,
    category,
    bedrooms,
    surface_m2,
    company_name,
}: Props) {
    const similar = await getSimilarModels({
        currentModelId,
        category,
        bedrooms,
        surface_m2,
        company_name,
    });

    if (similar.length === 0) return null;

    return (
        <section className="max-w-7xl mx-auto px-6 py-14" aria-label="Propiedades similares">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <div className="flex-1">
                    <p className="text-xs font-black text-[#37FFDB] uppercase tracking-widest mb-1">
                        También te puede interesar
                    </p>
                    <h2 className="text-2xl font-black text-[#3200C1]">
                        Casas con características similares
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">
                        Modelos comparables por superficie, dormitorios o categoría
                    </p>
                </div>
                <Link
                    href="/"
                    className="shrink-0 hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-[4px] border-2 border-[#3200C1] text-[#3200C1] font-black text-sm hover:bg-[#3200C1] hover:text-white transition-all"
                >
                    Ver todos los modelos
                </Link>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {similar.map((house) => {
                    const imageUrl = house.imageUrl || null;
                    const isConstructor = house.company_plan === "constructor";
                    const isBuilder = house.company_plan === "builder";

                    return (
                        <article
                            key={house._id}
                            className={`group relative rounded-[4px] overflow-hidden bg-white border transition-all duration-300 shadow-sm hover:shadow-md flex flex-col ${isConstructor
                                    ? "border-amber-300 ring-1 ring-amber-200 hover:border-amber-400"
                                    : isBuilder
                                        ? "border-blue-200 hover:border-blue-300"
                                        : "border-slate-100 hover:border-[#37FFDB]"
                                }`}
                        >
                            {/* Image */}
                            <div className="relative w-full aspect-video overflow-hidden bg-slate-50">
                                {imageUrl ? (
                                    <Image
                                        src={imageUrl}
                                        alt={`${house.model_name} - ${house.company_name}`}
                                        fill
                                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                                        loading="lazy"
                                        quality={75}
                                    />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center bg-slate-50 text-slate-300 text-xs">
                                        Sin imagen
                                    </div>
                                )}
                                {/* Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-[#3200C1]/40 to-transparent" />

                                {/* Badges */}
                                <div className="absolute top-3 inset-x-3 flex justify-between items-start">
                                    <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-sm text-[#3200C1] text-xs font-bold shadow-sm">
                                        <MapPin className="w-3 h-3" />
                                        {house.company_name}
                                    </div>
                                    <div className="flex flex-col items-end gap-1">
                                        {isConstructor && (
                                            <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-amber-400 text-amber-900 text-[9px] uppercase font-black shadow-sm">
                                                <Crown className="w-3 h-3" /> Destacado
                                            </div>
                                        )}
                                        {isBuilder && (
                                            <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-blue-500 text-white text-[9px] uppercase font-black shadow-sm">
                                                <Star className="w-3 h-3" /> Crecer
                                            </div>
                                        )}
                                        {house.category && (
                                            <div className="inline-flex px-2 py-1 rounded-full bg-[#37FFDB] text-[#3200C1] text-[9px] uppercase font-black shadow-sm">
                                                {house.category}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-4 flex flex-col flex-1 gap-4">
                                <div>
                                    <h3 className="text-base font-black text-[#3200C1] leading-tight">
                                        {house.model_name}
                                    </h3>
                                    <span className="text-lg font-black text-[#3200C1] tabular-nums">
                                        {formatPrice(house.price_from, house.currency)}
                                    </span>
                                    <span className="text-xs text-slate-400 ml-1">/ Desde</span>
                                </div>

                                {/* Stats */}
                                <div className="grid grid-cols-3 gap-2">
                                    <div className="flex flex-col justify-center gap-0.5 p-2 rounded-[4px] bg-slate-50 border border-slate-100">
                                        <div className="flex items-center gap-1 text-slate-400">
                                            <Scale className="w-3 h-3" />
                                            <span className="text-[8px] uppercase font-black tracking-widest">m²</span>
                                        </div>
                                        <span className="text-xs font-black text-[#3200C1]">{house.surface_m2 || "--"}</span>
                                    </div>
                                    <div className="flex flex-col justify-center gap-0.5 p-2 rounded-[4px] bg-slate-50 border border-slate-100">
                                        <div className="flex items-center gap-1 text-slate-400">
                                            <Bed className="w-3 h-3" />
                                            <span className="text-[8px] uppercase font-black tracking-widest">Dorms</span>
                                        </div>
                                        <span className="text-xs font-black text-[#3200C1]">{house.bedrooms || "--"}</span>
                                    </div>
                                    <div className="flex flex-col justify-center gap-0.5 p-2 rounded-[4px] bg-slate-50 border border-slate-100">
                                        <div className="flex items-center gap-1 text-slate-400">
                                            <Bath className="w-3 h-3" />
                                            <span className="text-[8px] uppercase font-black tracking-widest">Baños</span>
                                        </div>
                                        <span className="text-xs font-black text-[#3200C1]">{house.bathrooms || "--"}</span>
                                    </div>
                                </div>

                                {/* CTA row */}
                                <div className="mt-auto flex items-center gap-2 pt-3 border-t border-slate-50">
                                    <Link
                                        href={`/modelo/${house._id}`}
                                        className="flex-1 text-center py-2 rounded-[4px] border-2 border-[#3200C1] text-[#3200C1] font-black text-xs hover:bg-[#3200C1] hover:text-white transition-all"
                                    >
                                        Ver Detalle
                                    </Link>
                                    {house.model_url && (
                                        <VisitPublicationButton
                                            modelId={house._id}
                                            modelName={house.model_name}
                                            companyName={house.company_name}
                                            targetUrl={house.model_url}
                                            source="card"
                                            label=""
                                            className="p-2 rounded-[4px] bg-[#37FFDB] text-[#3200C1] hover:brightness-105 active:scale-95 transition-all flex items-center justify-center"
                                        />
                                    )}
                                </div>
                            </div>
                        </article>
                    );
                })}
            </div>

            <Link
                href="/"
                className="mt-8 flex sm:hidden items-center justify-center gap-2 px-5 py-3 rounded-[4px] border-2 border-[#3200C1] text-[#3200C1] font-black text-sm hover:bg-[#3200C1] hover:text-white transition-all w-full"
            >
                Ver todos los modelos
            </Link>
        </section>
    );
}
