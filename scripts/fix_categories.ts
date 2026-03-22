import { createClient } from "@sanity/client";
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'y7lnmhm6',
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    token: process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_TOKEN,
    useCdn: false,
    apiVersion: '2024-02-26',
});

const SYSTEMS = ["Madera", "SIP", "Metalcon", "Modular", "Hormigón"];

async function fixCategories() {
    console.log("Buscando modelos mock en Sanity...");

    // Buscar todos los modelos activos (los mock tienen category == 'Prefabricada')
    const models = await client.fetch(
        `*[_type == "houseModel" && is_active == true]{ _id, model_name, structure_material, category }`
    );

    console.log(`Total modelos encontrados: ${models.length}`);

    let updated = 0;
    for (let i = 0; i < models.length; i++) {
        const model = models[i];
        
        // Asignar sistema constructivo rotando equitativamente entre los 5 tipos
        const system = SYSTEMS[i % SYSTEMS.length];

        // El category también lo actualizamos para que los tabs funcionen
        // El structure_material refleja el sistema real
        await client.patch(model._id).set({
            category: system,
            structure_material: system,
        }).commit();

        console.log(`[${i+1}/${models.length}] ${model.model_name} → ${system}`);
        updated++;
    }

    console.log(`\n✅ Actualizados ${updated} modelos con sistemas constructivos variados.`);
}

fixCategories().catch(console.error);
