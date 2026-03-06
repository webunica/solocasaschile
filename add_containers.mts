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

function createSlug(doc: any) {
    const type = 'casa-prefabricada';
    const category = doc.category ? `${doc.category}-` : '';
    const m2 = doc.surface_m2 ? `${doc.surface_m2}m2-` : '';
    const rawText = `${type}-${category}${doc.model_name}-${m2}${doc.company_name}`;

    return rawText
        .toLowerCase()
        .normalize('NFD') // Remove accents
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-') // Replace spaces and weird chars with -
        .replace(/(^-|-$)+/g, ''); // Remove leading/trailing -
}

const companiesData = [
    {
        name: "Casa Container Chile",
        email: "contacto@casacontainerchile.cl",
        models: [
            { name: "Container B\u00e1sico 20 Pies", m2: 15, beds: 1, baths: 1, price: 5500000, desc: "Transformaci\u00f3n de contenedor mar\u00edtimo de 20 pies ideal para caba\u00f1a o anexo. Incluye aislaci\u00f3n t\u00e9rmica y revestimientos interiores." },
            { name: "Container Doble 40 Pies", m2: 30, beds: 2, baths: 1, price: 9800000, desc: "Dise\u00f1o basado en contenedor High Cube de 40 pies. Espacioso, r\u00e1pido de instalar e incluye ba\u00f1o completo." }
        ]
    },
    {
        name: "Casas Containers",
        email: "ventas@casascontainers.cl",
        models: [
            { name: "M\u00f3dulo Habitacional Premium", m2: 45, beds: 2, baths: 1, price: 14500000, desc: "Conjunto de containers de 40 y 20 pies ensamblados para un l\u00f3ok moderno, con terminaciones de alta calidad y listos para habitar." }
        ]
    },
    {
        name: "JBL Comercial",
        email: "info@jblcomercial.cl",
        models: [
            { name: "Vivienda Container Econ\u00f3mica", m2: 15, beds: 1, baths: 1, price: 4500000, desc: "Respuesta innovadora y econ\u00f3mica. Modelo compacto ideal como primera vivienda o refugio en el sur de Chile." },
            { name: "Refugio Sur 40 Pies", m2: 30, beds: 2, baths: 1, price: 8900000, desc: "Contenedor modificado con refuerzo para clima adverso, ventanas termopanel y terminaci\u00f3n industrial negra exterior." }
        ]
    },
    {
        name: "Domhouse",
        email: "ventas@domhouse.cl",
        models: [
            { name: "DomContainer Playa", m2: 30, beds: 2, baths: 1, price: 9200000, desc: "Fabricado sobre un container de 40 pies con finas terminaciones en madera, ventanales amplios, pensado espec\u00edficamente para terrenos de playa." }
        ]
    },
    {
        name: "Container World Chile",
        email: "cotizaciones@containerworld.cl",
        models: [
            { name: "World B\u00e1sico", m2: 15, beds: 1, baths: 1, price: 5000000, desc: "Caba\u00f1a instalable en un d\u00eda. Contenedor de 20 pies con todas las conexiones el\u00e9ctricas y sanitarias preparadas (Llave en Mano basic)." },
            { name: "Modular Expandible 60m2", m2: 60, beds: 3, baths: 2, price: 18000000, desc: "Unificaci\u00f3n arquitect\u00f3nica de dos contenedores de 40 pies. Casa s\u00f3lida en acero sismorresistente, excelentes terminaciones interiores de yeso cart\u00f3n y piso flotante." }
        ]
    }
];

export async function addContainerCompanies() {
    console.log('Adding companies and their container models...');

    for (const comp of companiesData) {
        // 1. Check/Add Company
        const existingCo = await client.fetch(`*[_type == "companyUser" && company_name == $name][0]`, { name: comp.name });
        let compDoc;
        if (!existingCo) {
            compDoc = await client.create({
                _type: 'companyUser',
                company_name: comp.name,
                email: comp.email,
                role: 'company',
                plan: 'starter',
                is_active: true
            });
            console.log(`Created Company: ${comp.name}`);
        } else {
            compDoc = existingCo;
            console.log(`Company exists: ${comp.name}`);
        }

        // 2. Add Models
        for (const mod of comp.models) {
            const cat = 'Container';
            const title = `${mod.name} de ${mod.m2}m2 | ${comp.name}`;
            const cleanTitle = title.substring(0, 60);
            const descSEO = `Cotiza la casa prefabricada ${mod.name} de ${mod.m2}m2. Arquitectura modular construida por ${comp.name}.`;
            const keywords = `casa prefabricada, container, casa container, ${mod.name.toLowerCase()}, casas ${comp.name.toLowerCase()}`;

            const rawDoc = {
                company_name: comp.name,
                model_name: mod.name,
                category: cat,
                surface_m2: mod.m2
            };

            const slug = createSlug(rawDoc);

            const existingMod = await client.fetch(`*[_type == "houseModel" && slug.current == $slug][0]`, { slug });

            if (!existingMod) {
                await client.create({
                    _type: 'houseModel',
                    company_name: comp.name,
                    model_name: mod.name,
                    slug: { _type: 'slug', current: slug },
                    model_url: 'https://solocasaschile.com', // fallback
                    category: cat,
                    surface_m2: mod.m2,
                    bedrooms: mod.beds,
                    bathrooms: mod.baths,
                    floors: 1,
                    structure_material: 'Acero Mar\u00edtimo (Container)',
                    price_from: mod.price,
                    currency: 'CLP',
                    description: mod.desc,
                    is_active: true,
                    seo_title: cleanTitle,
                    seo_description: descSEO,
                    seo_keywords: keywords
                });
                console.log(`  Creando Modelo: ${mod.name} -> ${slug}`);
            } else {
                console.log(`  El Modelo [${slug}] ya exist\u00eda.`);
            }
        }
    }

    console.log('Done!');
}

addContainerCompanies().catch(console.error);
