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
    const admins = await client.fetch(`*[_type == "companyUser" && role == "admin"]`);
    console.log(`Found ${admins.length} admin accounts.`);
    
    if (admins.length > 0) {
        const transaction = client.transaction();
        admins.forEach((admin: any) => {
            transaction.patch(admin._id, (p: any) => p.set({ is_active: true }));
            console.log(`Reactivating: ${admin.email}`);
        });
        await transaction.commit();
        console.log("Admins successfully reactivated.");
    } else {
        console.log("No admins found.");
    }
}

main();
