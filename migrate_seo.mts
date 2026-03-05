import dotenv from 'dotenv';
import { createClient } from '@sanity/client';

dotenv.config({ path: '.env.local' });

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    apiVersion: '2024-02-26',
    token: process.env.SANITY_API_WRITE_TOKEN,
    useCdn: false,
});

export async function migrateSEO() {
    console.log('Fetching models to update SEO...');
    const models = await client.fetch(`*[_type == "houseModel"] {
    _id,
    model_name,
    company_name,
    category,
    surface_m2,
    bedrooms,
    bathrooms,
    seo_title,
    seo_description,
    seo_keywords,
    images
  }`);

    console.log(`Found ${models.length} models to update.`);

    let index = 0;
    for (const doc of models) {
        const title = `${doc.model_name} de ${doc.surface_m2 || '?'}m2 | ${doc.company_name}`;
        const cleanTitle = title.substring(0, 60);

        const desc = `Cotiza la casa prefabricada ${doc.model_name} de ${doc.surface_m2 || '?'}m2 con ${doc.bedrooms || '?'} dormitorios y ${doc.bathrooms || '?'} ba\u00f1os. Construida por ${doc.company_name}.`;
        const cleanDesc = desc.substring(0, 160);

        const keywords = `casa prefabricada, ${doc.model_name.toLowerCase()}, casas ${doc.company_name.toLowerCase()}, casas de ${doc.surface_m2}m2, casas prefabricadas chile${doc.category ? `, ${doc.category.toLowerCase()}` : ''}`;

        // Update images alt texts
        const updatedImages = Array.isArray(doc.images) ? doc.images.map((img: any, i: number) => {
            if (!img.alt) {
                return {
                    ...img,
                    alt: `Casa prefabricada ${doc.model_name} por ${doc.company_name} - Fachada o Interior ${i + 1}`
                };
            }
            return img;
        }) : undefined;

        console.log(`Updating [${index + 1}/${models.length}] ${doc._id}`);

        try {
            const patch = client.patch(doc._id).setIfMissing({
                seo_title: cleanTitle,
                seo_description: cleanDesc,
                seo_keywords: keywords
            });

            // Always patch the title/desc/kw if they are empty
            patch.set({
                seo_title: doc.seo_title || cleanTitle,
                seo_description: doc.seo_description || cleanDesc,
                seo_keywords: doc.seo_keywords || keywords
            });

            // Patch images if there are any
            if (updatedImages) {
                patch.set({ images: updatedImages });
            }

            await patch.commit();
        } catch (err: any) {
            console.error(`Error with ${doc._id}: ${err.message}`);
        }
        index++;
    }

    console.log('SEO Migration completed!');
}

migrateSEO().catch(console.error);
