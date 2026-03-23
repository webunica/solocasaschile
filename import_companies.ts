import { createClient } from "next-sanity";
import { parse } from "csv-parse/sync";
import fs from "fs";

const client = createClient({
    projectId: 'c3n3g73v',
    dataset: 'production',
    token: 'sk0ct6lYuk7rOavlZRL80GtlmhwwBGDCWLMQJLRzWdRVrejl79UojFkskzOqQo5jDBcbFfBPR6r0DgsCNqKLm4OfGXcT1lkmjvAHUiOLfR2t6VhNc3hHsM05O4Zbx3Mn4N8JBVLiwJ6oHk7LXyGGgsdqHrYOJ16F',
    useCdn: false,
    apiVersion: '2024-02-26',
});

function slugify(text: string) {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]+/g, '')
        .replace(/--+/g, '-');
}

async function importCompanies() {
    const csvFile = fs.readFileSync("constructoras_chile.csv", "utf-8");
    const records = parse(csvFile, {
        columns: true,
        skip_empty_lines: true,
    });

    console.log(`Starting import of ${records.length} records...`);

    let imported = 0;
    let errors = 0;

    for (const record of records) {
        try {
            const companyName = record.name || record.domain;
            if (!companyName) continue;

            const slugStr = slugify(companyName);
            const email = record.email_corp || `hola@${record.domain || slugStr + '.cl'}`;

            const doc = {
                _type: 'companyUser',
                _id: `imported-${record.id || slugStr}`,
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
                region: record.region || 'Metropolitana', // Default region
                password: 'no-password-set' // Placeholder
            };

            await client.createOrReplace(doc);
            console.log(`[${imported+1}/${records.length}] Imported: ${companyName}`);
            imported++;
        } catch (e) {
            console.error(`Error importing record:`, e);
            errors++;
        }
    }

    console.log(`\nImport completed.`);
    console.log(`Total Success: ${imported}`);
    console.log(`Total Errors: ${errors}`);
}

importCompanies().catch(console.error);
