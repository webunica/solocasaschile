import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@sanity/client";
import bcrypt from "bcryptjs";

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || process.env.SANITY_PROJECT_ID || "c3n3g73v",
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || process.env.SANITY_DATASET || "production",
    apiVersion: "2024-02-26",
    token: process.env.SANITY_API_WRITE_TOKEN,
    useCdn: false,
});

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        
        const company_name = formData.get("company_name") as string;
        const email = formData.get("email") as string;
        const contact_phone = formData.get("contact_phone") as string;
        const password = formData.get("password") as string;
        
        const logoFile = formData.get("logo") as File | null;
        const faviconFile = formData.get("favicon") as File | null;

        if (!company_name || !email || !password) {
            return NextResponse.json({ error: "Nombre de empresa, email y contraseña son obligatorios." }, { status: 400 });
        }

        if (password.length < 8) {
            return NextResponse.json({ error: "La contraseña debe tener al menos 8 caracteres." }, { status: 400 });
        }

        // Check if email already exists
        const existing = await client.fetch(
            `*[_type == "companyUser" && email == $email][0]._id`,
            { email }
        );

        if (existing) {
            return NextResponse.json({ error: "Ya existe una cuenta con ese correo. ¿Olvidaste tu contraseña? Inicia sesión." }, { status: 409 });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Upload images if they exist
        let logoAsset;
        if (logoFile && logoFile.size > 0) {
            const buffer = Buffer.from(await logoFile.arrayBuffer());
            const asset = await client.assets.upload('image', buffer, { filename: logoFile.name });
            logoAsset = { _type: 'image', asset: { _type: "reference", _ref: asset._id } };
        }

        let faviconAsset;
        if (faviconFile && faviconFile.size > 0) {
            const buffer = Buffer.from(await faviconFile.arrayBuffer());
            const asset = await client.assets.upload('image', buffer, { filename: faviconFile.name });
            faviconAsset = { _type: 'image', asset: { _type: "reference", _ref: asset._id } };
        }

        // Create the company user doc
        await client.create({
            _type: "companyUser",
            company_name,
            email,
            contact_phone: contact_phone || "",
            role: "company",
            plan: "starter",
            is_active: true,
            password: hashedPassword,
            ...(logoAsset && { logo: logoAsset }),
            ...(faviconAsset && { favicon: faviconAsset })
        });

        return NextResponse.json({ success: true });
    } catch (err: any) {
        console.error("Register error:", err);
        return NextResponse.json({ error: `Error interno: ${err.message}` }, { status: 500 });
    }
}
