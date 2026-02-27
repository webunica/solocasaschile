"use server";

import { sanityWriteClient } from "@/lib/sanity.server";
import { sanityClient } from "@/lib/sanity.client";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

function normalizeCompanyName(name: string): string {
    return name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // quitar tildes
        .replace(/[^a-z0-9\s-]/g, "")    // solo letras, números, espacios, guiones
        .trim()
        .replace(/\s+/g, "-");           // espacios → guiones
}

export async function bulkCreateCompaniesAction() {
    if (!process.env.SANITY_API_WRITE_TOKEN) {
        return { error: "No hay token de escritura configurado." };
    }

    try {
        // 1. Todos los nombres de empresas con modelos
        const allNames: string[] = await sanityClient.fetch(
            `array::unique(*[_type == "houseModel" && defined(company_name)].company_name)`
        );

        // 2. Nombres que ya tienen cuenta B2B
        const existingAccounts: { company_name: string; email: string }[] = await sanityClient.fetch(
            `*[_type == "companyUser"]{ company_name, email }`
        );
        const existingNames = new Set(existingAccounts.map((a) => a.company_name));
        const existingEmails = new Set(existingAccounts.map((a) => a.email));

        // 3. Filtrar solo las que NO tienen cuenta
        const toCreate = allNames.filter((name) => !existingNames.has(name));

        if (toCreate.length === 0) {
            return { success: true, created: [], skipped: 0, message: "Todas las empresas ya tienen cuenta B2B." };
        }

        const DEFAULT_PASSWORD = "Starter2025!";
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(DEFAULT_PASSWORD, salt);

        const created: { company_name: string; email: string }[] = [];
        const skippedDuplEmail: string[] = [];

        // 4. Crear en Sanity con transaction
        const transaction = sanityWriteClient.transaction();

        for (const name of toCreate) {
            const normalized = normalizeCompanyName(name);
            let email = `admin@${normalized}.cl`;

            // Si el email ya existe (colisión), agregar sufijo numérico
            if (existingEmails.has(email)) {
                let suffix = 2;
                while (existingEmails.has(`admin${suffix}@${normalized}.cl`)) suffix++;
                email = `admin${suffix}@${normalized}.cl`;
            }

            if (existingEmails.has(email)) {
                skippedDuplEmail.push(name);
                continue;
            }

            existingEmails.add(email); // marcar como usado para evitar colisiones internas

            transaction.create({
                _type: "companyUser",
                company_name: name,
                email,
                password: hashedPassword,
                plan: "starter",
                role: "company",
                is_active: true,
            });

            created.push({ company_name: name, email });
        }

        await transaction.commit();

        revalidatePath("/dashboard/companies");

        return {
            success: true,
            created,
            defaultPassword: DEFAULT_PASSWORD,
            skipped: skippedDuplEmail.length,
            message: `Se crearon ${created.length} cuentas B2B con éxito.`,
        };

    } catch (error: any) {
        console.error("Bulk Create Error:", error);
        return { error: error.message || "Error en la creación masiva." };
    }
}
