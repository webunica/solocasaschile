"use server";

import { sanityWriteClient } from "@/lib/sanity.server";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

export async function editCompanyAction(id: string, formData: FormData) {
    if (!process.env.SANITY_API_WRITE_TOKEN) {
        throw new Error("No hay token de escritura configurado.");
    }

    try {
        const company_name = formData.get("company_name")?.toString() || "";
        const email = formData.get("email")?.toString() || "";
        const role = formData.get("role")?.toString() || "company";
        const plan = formData.get("plan")?.toString() || "starter";
        const new_password = formData.get("new_password")?.toString() || "";

        // Preparamos los datos base
        const patchData: any = {
            company_name,
            email,
            role,
            plan,
        };

        // Si el admin escribió una nueva contraseña, la encriptamos antes de guardarla
        if (new_password) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(new_password, salt);
            patchData.password = hashedPassword;
        }

        // Subida de logo si existe
        const logoFile = formData.get("logo") as File;
        if (logoFile && logoFile.size > 0 && logoFile.name) {
            const asset = await sanityWriteClient.assets.upload('image', logoFile, {
                filename: logoFile.name
            });

            patchData.logo = {
                _type: "image",
                asset: {
                    _type: "reference",
                    _ref: asset._id
                }
            };
        }

        // Aplicamos el parche del lado del servidor
        await sanityWriteClient.patch(id).set(patchData).commit();

        revalidatePath("/dashboard/companies");

        return { success: true };

    } catch (error: any) {
        console.error("Edit Company Error:", error);
        return { error: error.message || "Error al actualizar los datos de la constructora." };
    }
}
