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
        for (const record of records as any[]) {
            const companyName = record.name || record.domain;
            if (!companyName) continue;

            const slugStr = slugify(companyName);
            const email = record.email_corp || `hola@${record.domain || slugStr + '.cl'}`;

            const doc = {
                _type: 'companyUser',
                _id: `imported-${slugStr}`,
                company_name: companyName,
                slug: { _type: 'slug', current: slugStr },
                description: record.description ? record.description.substring(0, 500) : '',
                email: email.toLowerCase().trim(),
                role: 'company',
                plan: 'free',
                is_active: true,
                contact_phone: record.phone_corp || '',
                whatsapp_number: record.phone_corp ? record.phone_corp.replace(/\s+/g, '').replace('+', '') : '',
                address: record.address || '',
                region: record.region || 'Metropolitana',
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
