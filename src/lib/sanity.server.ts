import { createClient } from "next-sanity";

// Lee variables con o sin prefijo NEXT_PUBLIC_ (compatible con ambos .env)
const projectId =
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ||
    process.env.SANITY_PROJECT_ID ||
    'placeholder'

const dataset =
    process.env.NEXT_PUBLIC_SANITY_DATASET ||
    process.env.SANITY_DATASET ||
    'production'

const writeToken =
    process.env.SANITY_API_WRITE_TOKEN ||
    process.env.SANITY_TOKEN

// Cliente de escritura (requiere token)
export const sanityWriteClient = createClient({
    projectId,
    dataset,
    apiVersion: "2024-02-26",
    token: writeToken,
    useCdn: false,
});

// Cliente de solo lectura para Server Components / sitemap (sin CDN para datos frescos)
export const sanityServerClient = createClient({
    projectId,
    dataset,
    apiVersion: "2024-02-26",
    useCdn: false,
});
