import { createClient } from "@sanity/client";
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    token: process.env.SANITY_API_WRITE_TOKEN || '',
    useCdn: false,
    apiVersion: '2024-02-26',
});

async function main() {
    const docs = await client.fetch(`*[_type in ["companyUser", "houseModel"] && _createdAt > "2026-03-21T18:00:00Z"]`);
    console.log(`Found ${docs.length} documents to delete...`);
    
    // Process in batches of 50 to avoid payload too large
    for (let i = 0; i < docs.length; i += 50) {
        const batch = docs.slice(i, i + 50);
        const transaction = client.transaction();
        batch.forEach((d: any) => transaction.delete(d._id));
        await transaction.commit();
        console.log(`Deleted batch ${i/50 + 1}`);
    }
    
    console.log("Cleanup completed.");
}

main();
