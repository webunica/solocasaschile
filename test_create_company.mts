import { createClient } from "@sanity/client";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
    apiVersion: "2024-02-26",
    token: process.env.SANITY_API_WRITE_TOKEN,
    useCdn: false,
});

async function main() {
    try {
        const doc = await client.create({
            _type: "companyUser",
            company_name: "Test CLI",
            email: "testcli@test.com",
            contact_phone: "+56912345678",
            role: "company",
            plan: "starter",
            is_active: true,
            password: "somehashedpassword",
        });
        console.log("Success:", doc._id);

        // clean up
        await client.delete(doc._id);
        console.log("Deleted.");
    } catch (error) {
        console.error("Error creating document:", error);
    }
}

main();
