import {
    parseAsInteger,
    parseAsString,
    createSerializer,
} from "nuqs/server";

export const searchParamsSchema = {
    company: parseAsString,
    category: parseAsString,
    minPrice: parseAsInteger,
    maxPrice: parseAsInteger,
    minSurface: parseAsInteger,
    bedrooms: parseAsInteger,
    bathrooms: parseAsInteger,
};

export const serializer = createSerializer(searchParamsSchema);
