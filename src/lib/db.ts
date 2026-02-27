import { sanityClient } from "./sanity.client";

export interface ModelRow {
    id: string;
    company_name: string;
    model_name: string;
    model_url: string;
    category: string;
    surface_m2: number;
    bedrooms: number;
    bathrooms: number;
    price_from: number;
    currency: string;
    delivery_modes: string;
    structure_material: string;
    pdf_ficha_url: string;
    original_price_text: string;
    image_urls: string;
    company_plan?: string; // "starter" | "builder" | "constructor"
}

function formatSanityHouse(doc: any): ModelRow {
    return {
        id: doc._id,
        company_name: doc.company_name || "",
        model_name: doc.model_name || "",
        model_url: doc.model_url || "",
        category: doc.category || "",
        surface_m2: doc.surface_m2 || 0,
        bedrooms: doc.bedrooms || 0,
        bathrooms: doc.bathrooms || 0,
        price_from: doc.price_from || 0,
        currency: doc.currency || "CLP",
        delivery_modes: Array.isArray(doc.delivery_modes) ? doc.delivery_modes.join(", ") : (doc.delivery_modes || ""),
        structure_material: doc.structure_material || "",
        pdf_ficha_url: doc.pdf_ficha_url || "",
        original_price_text: doc.original_price_text || "",
        image_urls: Array.isArray(doc.image_urls) ? doc.image_urls.join(",") : (doc.image_urls || ""),
        company_plan: doc.company_plan || "starter",
    };
}

// Límite de modelos visibles por plan
const PLAN_LIMITS: Record<string, number> = {
    starter: 5,
    builder: Infinity,
    constructor: Infinity,
};

/**
 * Aplica el límite de visibilidad por plan en JS.
 * Para empresas Starter → solo los primeros 5 modelos son visibles.
 * Empresas desactivadas ya vienen excluidas de la query GROQ.
 */
function applyPlanLimits(docs: ModelRow[]): ModelRow[] {
    const companyCounts: Record<string, number> = {};
    const result: ModelRow[] = [];

    for (const model of docs) {
        const plan = model.company_plan || "starter";
        const limit = PLAN_LIMITS[plan] ?? 5;
        const current = companyCounts[model.company_name] || 0;

        if (current < limit) {
            result.push(model);
            companyCounts[model.company_name] = current + 1;
        }
    }

    return result;
}

export async function getModels(filters: {
    company?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    minSurface?: number;
    bedrooms?: number;
    bathrooms?: number;
    sort?: string;
    page?: number;
    limit?: number;
}) {
    // ── Pre-cargar empresas DESACTIVADAS (query simple y rápida) ──
    const disabledNames: string[] = await sanityClient.fetch(
        `*[_type == "companyUser" && is_active == false].company_name`
    );
    const disabledSet = new Set(disabledNames);

    // ── Condiciones GROQ simples (sin joins costosos) ─────────────
    // is_active != false incluye modelos sin el campo (importados antes del cambio)
    let conditions = `_type == "houseModel" && is_active != false`;
    const params: Record<string, any> = {};

    if (filters.company) {
        conditions += ` && company_name == $company`;
        params.company = filters.company;
    }
    if (filters.category) {
        conditions += ` && category match $category`;
        params.category = `*${filters.category}*`;
    }
    if (filters.minSurface) { conditions += ` && surface_m2 >= $minSurface`; params.minSurface = filters.minSurface; }
    if (filters.bedrooms) { conditions += ` && bedrooms >= $bedrooms`; params.bedrooms = filters.bedrooms; }
    if (filters.bathrooms) { conditions += ` && bathrooms >= $bathrooms`; params.bathrooms = filters.bathrooms; }
    if (filters.minPrice) { conditions += ` && price_from >= $minPrice`; params.minPrice = filters.minPrice; }
    if (filters.maxPrice) { conditions += ` && price_from <= $maxPrice`; params.maxPrice = filters.maxPrice; }

    // ── Sorting ───────────────────────────────────────────────────
    let orderClause = "price_from asc";
    const sort = filters.sort || "price_asc";
    switch (sort) {
        case "price_desc": orderClause = "price_from desc"; break;
        case "surface_desc": orderClause = "surface_m2 desc"; break;
        case "surface_asc": orderClause = "surface_m2 asc"; break;
        default: orderClause = "price_from asc"; break;
    }

    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const oversample = limit * 6;

    // ── GROQ: trae todos los modelos con plan de la empresa ───────
    const dataQuery = `*[${conditions}] | order(${orderClause}) [0...${oversample}] {
        ...,
        "image_urls":   coalesce(images[].asset->url, image_urls),
        "company_plan": *[_type=="companyUser" && company_name==^.company_name && is_active!=false][0].plan
    }`;

    const allDocs = await sanityClient.fetch(dataQuery, params);
    let allModels = allDocs.map(formatSanityHouse);

    // ── Filtro JS 1: excluir empresas desactivadas ────────────────
    allModels = allModels.filter((m: ModelRow) => !disabledSet.has(m.company_name));

    // ── Filtro JS 2: prioridad por plan (Constructor > Builder > Starter) ─
    allModels.sort((a: ModelRow, b: ModelRow) => {
        const rank = (p?: string) => p === "constructor" ? 0 : p === "builder" ? 1 : 2;
        return rank(a.company_plan) - rank(b.company_plan);
    });

    // ── Filtro JS 3: límite de modelos visibles por plan ──────────
    const planFiltered = applyPlanLimits(allModels);

    // ── Paginación en JS ──────────────────────────────────────────
    const offset = (page - 1) * limit;
    const models = planFiltered.slice(offset, offset + limit);
    const totalCount = planFiltered.length;

    return { models, totalCount, page, limit };
}

export async function getDistinctCompanies() {
    // Paso 1: empresas con al menos un modelo ACTIVO
    const allNamesQuery = `array::unique(*[_type == "houseModel" && is_active != false && defined(company_name)].company_name)`;

    // Paso 2: nombres de empresas con cuenta B2B DESACTIVADA explícitamente
    const disabledQuery = `*[_type == "companyUser" && is_active == false].company_name`;

    const [allNames, disabledNames]: [string[], string[]] = await Promise.all([
        sanityClient.fetch(allNamesQuery),
        sanityClient.fetch(disabledQuery),
    ]);

    // Excluir solo las que tienen cuenta explícitamente desactivada
    const disabledSet = new Set(disabledNames);
    const visible = (allNames || []).filter((name) => !disabledSet.has(name));

    return visible.map((c: string) => ({ company_name: c }));
}

export async function getDistinctCategories() {
    const query = `array::unique(*[_type == "houseModel" && defined(category)].category)`;
    const categories = await sanityClient.fetch(query);
    return categories ? categories.map((c: string) => ({ category: c })) : [];
}

export async function getRandomModels(limit: number = 5) {
    // Solo modelos activos de empresas sin cuenta O con cuenta activa
    const query = `*[_type == "houseModel" && is_active != false && (defined(image_urls) || defined(images)) && (
        count(*[_type=="companyUser" && company_name==^.company_name]) == 0 ||
        count(*[_type=="companyUser" && company_name==^.company_name && is_active!=false]) > 0
    )] | order(_updatedAt desc) [0...${limit}] { ..., "image_urls": coalesce(images[].asset->url, image_urls) }`;
    const docs = await sanityClient.fetch(query);
    return docs.map(formatSanityHouse);
}

// Empresas Constructor con banner activo para la homepage
export async function getConstructorCompanies() {
    const query = `*[_type == "companyUser" && plan == "constructor" && is_active != false] | order(_createdAt asc) {
        _id,
        company_name,
        "logo_url": logo.asset->url,
        "model_count": count(*[_type == "houseModel" && company_name == ^.company_name])
    }`;
    return sanityClient.fetch(query);
}
