let db: any = null;

function getDb() {
    if (db) return db;
    if (typeof window !== "undefined") return null; // Ensure server-side only

    try {
        const Database = require("better-sqlite3");
        const path = require("path");
        const fs = require("fs");

        // Try multiple possible locations for the database
        const possiblePaths = [
            path.resolve(process.cwd(), "../outputs", "database.sqlite"),
            path.resolve(process.cwd(), "outputs", "database.sqlite"),
            path.join(process.cwd(), "database.sqlite")
        ];

        let finalPath = "";
        for (const p of possiblePaths) {
            if (fs.existsSync(p)) {
                finalPath = p;
                break;
            }
        }

        if (!finalPath) {
            console.warn("Database file not found in any expected location. Returning null for build compatibility.");
            return null;
        }

        db = new Database(finalPath, { readonly: true });
        return db;
    } catch (error) {
        console.error("Database initialization failed (safe for build):", error);
        return null;
    }
}

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
    const database = getDb();
    if (!database) return { models: [], totalCount: 0, page: 1, limit: 20 };

    const countQuery = "SELECT count(*) as total FROM models" + whereClause;
    const totalRow = database.prepare(countQuery).get(...params) as { total: number };
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

    const stmt = database.prepare(query);
    const models = stmt.all(...params) as ModelRow[];

    return { models, totalCount, page, limit };
}

export function getDistinctCompanies() {
    const database = getDb();
    if (!database) return [];
    return database.prepare("SELECT DISTINCT company_name FROM models WHERE company_name IS NOT NULL ORDER BY company_name").all() as { company_name: string }[];
}

export function getDistinctCategories() {
    const database = getDb();
    if (!database) return [];
    return database.prepare("SELECT DISTINCT category FROM models WHERE category IS NOT NULL ORDER BY category").all() as { category: string }[];
}

export function getRandomModels(limit: number = 5) {
    const database = getDb();
    if (!database) return [];
    return database.prepare("SELECT rowid as id, * FROM models WHERE image_urls IS NOT NULL AND image_urls != '' ORDER BY RANDOM() LIMIT ?").all(limit) as ModelRow[];
}
