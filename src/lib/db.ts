import Database from "better-sqlite3";
import path from "path";

// In Next.js App Router, process.cwd() is the root of the web/ directory.
const dbPath = path.resolve(process.cwd(), "../outputs", "database.sqlite");
const db = new Database(dbPath, { readonly: true });

export interface ModelRow {
    id: number;
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
}

export function getModels(filters: {
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
    let whereClause = " WHERE 1=1";
    const params: unknown[] = [];

    if (filters.company) {
        whereClause += " AND company_name = ?";
        params.push(filters.company);
    }

    if (filters.category) {
        whereClause += " AND category LIKE ?";
        params.push(`%${filters.category}%`);
    }

    if (filters.minSurface) { whereClause += " AND surface_m2 >= ?"; params.push(filters.minSurface); }
    if (filters.bedrooms) { whereClause += " AND bedrooms >= ?"; params.push(filters.bedrooms); }
    if (filters.bathrooms) { whereClause += " AND bathrooms >= ?"; params.push(filters.bathrooms); }

    if (filters.minPrice) { whereClause += " AND price_from >= ?"; params.push(filters.minPrice); }
    if (filters.maxPrice) { whereClause += " AND price_from <= ?"; params.push(filters.maxPrice); }

    // Count Total
    const countQuery = "SELECT count(*) as total FROM models" + whereClause;
    const totalRow = db.prepare(countQuery).get(...params) as { total: number };
    const totalCount = totalRow.total;

    // Build Main Data Query
    let query = "SELECT rowid as id, * FROM models" + whereClause;

    // Sorting block
    const sort = filters.sort || "price_asc";
    switch (sort) {
        case "price_desc":
            query += " ORDER BY price_from DESC NULLS LAST";
            break;
        case "surface_desc":
            query += " ORDER BY surface_m2 DESC NULLS LAST";
            break;
        case "surface_asc":
            query += " ORDER BY surface_m2 ASC NULLS LAST";
            break;
        case "price_asc":
        default:
            query += " ORDER BY price_from ASC NULLS LAST";
            break;
    }

    // Pagination
    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const offset = (page - 1) * limit;

    query += " LIMIT ? OFFSET ?";
    params.push(limit, offset);

    const stmt = db.prepare(query);
    const models = stmt.all(...params) as ModelRow[];

    return { models, totalCount, page, limit };
}

export function getDistinctCompanies() {
    return db.prepare("SELECT DISTINCT company_name FROM models WHERE company_name IS NOT NULL ORDER BY company_name").all() as { company_name: string }[];
}

export function getDistinctCategories() {
    return db.prepare("SELECT DISTINCT category FROM models WHERE category IS NOT NULL ORDER BY category").all() as { category: string }[];
}

export function getRandomModels(limit: number = 5) {
    return db.prepare("SELECT rowid as id, * FROM models WHERE image_urls IS NOT NULL AND image_urls != '' ORDER BY RANDOM() LIMIT ?").all(limit) as ModelRow[];
}
