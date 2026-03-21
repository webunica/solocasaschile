import Link from "next/link";
import { sanityClient } from "@/lib/sanity.client";
import SimilarPropertiesCarousel, { SimilarHouse } from "./SimilarPropertiesCarousel";

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

    const query = `*[_type == "houseModel" && is_active != false && _id != $currentId && (
        category == $category ||
        (bedrooms >= $minBeds && bedrooms <= $maxBeds) ||
        (surface_m2 >= $minSurface && surface_m2 <= $maxSurface)
    ) && (
        count(*[_type=="companyUser" && company_name==^.company_name]) == 0 ||
        count(*[_type=="companyUser" && company_name==^.company_name && is_active!=false && role != "admin"]) > 0
    )] | order(price_from asc)[0...6] {
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
        "company_plan": *[_type == "companyUser" && company_name == ^.company_name && is_active != false && role != "admin"][0].plan
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

            <SimilarPropertiesCarousel models={similar} />

            <Link
                href="/"
                className="mt-8 flex sm:hidden items-center justify-center gap-2 px-5 py-3 rounded-[4px] border-2 border-[#3200C1] text-[#3200C1] font-black text-sm hover:bg-[#3200C1] hover:text-white transition-all w-full"
            >
                Ver todos los modelos
            </Link>
        </section>
    );
}
