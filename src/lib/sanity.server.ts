import { createClient } from "next-sanity";

export const sanityWriteClient = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'placeholder',
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    apiVersion: "2024-02-26",
    token: process.env.SANITY_API_WRITE_TOKEN,
    useCdn: false,
});
