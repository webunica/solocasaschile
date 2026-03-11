import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@sanity/client";
import bcrypt from "bcryptjs";

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
    apiVersion: "2024-02-26",
    token: process.env.SANITY_API_WRITE_TOKEN,
    useCdn: false,
});

export async function POST(req: NextRequest) {
    try {
        const { company_name, email, contact_phone, password } = await req.json();

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
            return NextResponse.json({ error: "Ya existe una cuenta asociada a ese correo electrónico." }, { status: 409 });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

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
        });

        return NextResponse.json({ success: true });
    } catch (err: any) {
        console.error("Register error:", err);
        return NextResponse.json({ error: "Error interno al crear la cuenta." }, { status: 500 });
    }
}
