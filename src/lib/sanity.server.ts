import { createClient } from "next-sanity";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'placeholder'
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'

// Cliente de escritura (requiere token)
export const sanityWriteClient = createClient({
    projectId,
    dataset,
    apiVersion: "2024-02-26",
    token: process.env.SANITY_API_WRITE_TOKEN,
    useCdn: false,
});

// Cliente de solo lectura para Server Components / sitemap (sin CDN para datos frescos)
export const sanityServerClient = createClient({
    projectId,
    dataset,
    apiVersion: "2024-02-26",
    useCdn: false,
});
