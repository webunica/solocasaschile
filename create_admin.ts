import * as dotenv from 'dotenv';
dotenv.config();
import { createClient } from "next-sanity";
import bcrypt from "bcryptjs";

const client = createClient({
    projectId: process.env.SANITY_PROJECT_ID || "c3n3g73v",
    dataset: process.env.SANITY_DATASET || "production",
    apiVersion: "2024-02-26",
    token: process.env.SANITY_TOKEN || process.env.SANITY_API_WRITE_TOKEN,
    useCdn: false,
});

async function run() {
    const email = "admin@solocasaschile.com";
    const password = "admin"; // Temporary, user should change it or I can use a more secure one if I knew it.
    const hashedPassword = await bcrypt.hash(password, 10);

    const doc = {
        _type: 'companyUser',
        _id: 'admin-account',
        company_name: 'Administración SolocasasChile',
        slug: { _type: 'slug', current: 'admin-solocasaschile' },
        email: email,
        password: hashedPassword,
        role: 'admin',
        plan: 'elite',
        is_active: true,
        is_verified: true,
    };

    console.log("Creating admin account...");
    await client.createOrReplace(doc);
    console.log("Admin account created successfully with email: " + email);
}

run();
