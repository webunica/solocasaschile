import { NextResponse } from "next/server";
import { sanityWriteClient } from "@/lib/sanity.server";
import fs from "fs";
import path from "path";
import { parse } from "csv-parse/sync";

export async function GET() {
    try {
        console.log("Starting Cleanup...");
        
        // 1. Cleanup
        const companiesCount = await sanityWriteClient.fetch(`count(*[_type == "companyUser"])`);
        const modelsCount = await sanityWriteClient.fetch(`count(*[_type == "houseModel"])`);
        
        await sanityWriteClient.delete({ query: '*[_type == "houseModel"]' });
        await sanityWriteClient.delete({ query: '*[_type == "companyUser"]' });
        await sanityWriteClient.delete({ query: '*[_type == "propertyClick"]' });
        await sanityWriteClient.delete({ query: '*[_type == "modelView"]' });

        console.log(`Deleted ${companiesCount} companies and ${modelsCount} models.`);

        // 2. Import
        const csvPath = path.join(process.cwd(), "constructoras_chile.csv");
        if (!fs.existsSync(csvPath)) {
            return NextResponse.json({ error: "CSV not found at " + csvPath }, { status: 404 });
        }

        const csvContent = fs.readFileSync(csvPath, "utf-8");
        const records = parse(csvContent, { columns: true, skip_empty_lines: true });

        console.log(`Importing ${records.length} records...`);

        function slugify(text: string) {
            return text.toString().toLowerCase().trim()
                .replace(/\s+/g, '-')
                .replace(/[^\w-]+/g, '')
                .replace(/--+/g, '-');
        }

        let imported = 0;
        const regionMapping: Record<string, string> = {
            'Arica': 'Arica y Parinacota',
            'Iquique': 'Tarapacá',
            'Antofagasta': 'Antofagasta',
            'Calama': 'Antofagasta',
            'Copiapó': 'Atacama',
            'Vallenar': 'Atacama',
            'La Serena': 'Coquimbo',
            'Coquimbo': 'Coquimbo',
            'Ovalle': 'Coquimbo',
            'Valparaíso': 'Valparaíso',
            'Viña del Mar': 'Valparaíso',
            'Quilpué': 'Valparaíso',
            'Villa Alemana': 'Valparaíso',
            'Quillota': 'Valparaíso',
            'San Antonio': 'Valparaíso',
            'Los Andes': 'Valparaíso',
            'San Felipe': 'Valparaíso',
            'Santiago': 'Metropolitana de Santiago',
            'Puente Alto': 'Metropolitana de Santiago',
            'Maipú': 'Metropolitana de Santiago',
            'Rancagua': 'O\'Higgins',
            'San Fernando': 'O\'Higgins',
            'Curicó': 'Maule',
            'Talca': 'Maule',
            'Linares': 'Maule',
            'Chillán': 'Ñuble',
            'Concepción': 'Biobío',
            'Talcahuano': 'Biobío',
            'Los Ángeles': 'Biobío',
            'Temuco': 'La Araucanía',
            'Angol': 'La Araucanía',
            'Villarrica': 'La Araucanía',
            'Pucón': 'La Araucanía',
            'Valdivia': 'Los Ríos',
            'Osorno': 'Los Lagos',
            'Puerto Montt': 'Los Lagos',
            'Puerto Varas': 'Los Lagos',
            'Chiloé': 'Los Lagos',
            'Castro': 'Los Lagos',
            'Coyhaique': 'Aysén',
            'Punta Arenas': 'Magallanes',
        };

        for (const record of records as any[]) {
            const companyName = record.name || record.domain;
            if (!companyName || ["Instagram", "WhatsApp.com", "TikTok", "X (formerly Twitter)", "Trato Directo", "Página Principal", "Mercado PÃºblico", "Página principal"].includes(companyName)) continue;

            const slugStr = slugify(companyName);
            const email = record.email_corp || `hola@${record.domain || slugStr + '.cl'}`;
            const desc = record.description || '';
            
            // Deduce region
            let region = record.region || '';
            if (!region) {
                for (const [city, reg] of Object.entries(regionMapping)) {
                    if (desc.toLowerCase().includes(city.toLowerCase()) || companyName.toLowerCase().includes(city.toLowerCase())) {
                        region = reg;
                        break;
                    }
                }
            }
            if (!region) region = "Metropolitana de Santiago"; // Default

            const doc = {
                _type: 'companyUser',
                _id: `imported-${slugStr}`,
                company_name: companyName,
                slug: { _type: 'slug', current: slugStr },
                description: desc.substring(0, 500),
                email: email.toLowerCase().trim(),
                role: 'company',
                plan: 'free',
                is_active: true,
                contact_phone: record.phone_corp || '',
                whatsapp_number: record.phone_corp ? record.phone_corp.replace(/\s+/g, '').replace('+', '') : '',
                address: record.address || '',
                region: region,
                website: record.url || (record.domain ? `https://${record.domain}` : '')
            };

            await sanityWriteClient.createOrReplace(doc);
            imported++;
            if (imported % 20 === 0) console.log(`Imported ${imported}...`);
        }

        return NextResponse.json({ 
            success: true, 
            deleted: { companies: companiesCount, models: modelsCount },
            imported: imported 
        });

    } catch (error: any) {
        console.error("Batch Import Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
