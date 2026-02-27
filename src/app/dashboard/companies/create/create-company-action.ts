"use server";

import { sanityWriteClient } from "@/lib/sanity.server";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

export async function createCompanyAction(formData: FormData) {
    if (!process.env.SANITY_API_WRITE_TOKEN) {
        return { error: "No hay token de escritura configurado." };
    }

    try {
        const company_name = formData.get("company_name")?.toString().trim() || "";
        const email = formData.get("email")?.toString().trim() || "";
        const password = formData.get("password")?.toString() || "";
        const plan = formData.get("plan")?.toString() || "starter";
        const role = formData.get("role")?.toString() || "company";

        if (!company_name || !email || !password) {
            return { error: "Nombre, correo y contraseña son obligatorios." };
        }
        if (password.length < 6) {
            return { error: "La contraseña debe tener al menos 6 caracteres." };
        }

        // Verificar que no exista ya una cuenta con ese email
        const existing = await sanityWriteClient.fetch(
            `*[_type == "companyUser" && email == $email][0]._id`,
            { email }
        );
        if (existing) {
            return { error: "Ya existe una cuenta B2B con ese correo electrónico." };
        }

        // Hash de la contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Crear documento en Sanity
        await sanityWriteClient.create({
            _type: "companyUser",
            company_name,
            email,
            password: hashedPassword,
            plan,
            role,
            is_active: true,
        });

        revalidatePath("/dashboard/companies");
        return { success: true };

    } catch (error: any) {
        console.error("Create Company Error:", error);
        return { error: error.message || "Error al crear la cuenta." };
    }
}
