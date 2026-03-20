"use server";

import { sanityWriteClient } from "@/lib/sanity.server";
import { revalidatePath } from "next/cache";

export async function updateCompanyProfileAction(companyId: string, formData: FormData) {
    if (!companyId) return { success: false, error: "ID de empresa no proporcionado." };

    try {
        const description = formData.get("description")?.toString() || "";
        const whatsapp_number = formData.get("whatsapp_number")?.toString() || "";
        const meeting_url = formData.get("meeting_url")?.toString() || "";
        const slug = formData.get("slug")?.toString() || "";
        const years_experience = parseInt(formData.get("years_experience")?.toString() || "0");
        const projects_completed_count = parseInt(formData.get("projects_completed_count")?.toString() || "0");
        const badges = formData.getAll("badges") as string[];
        
        const logoFile = formData.get("logo") as File;
        let logoAssetId = "";

        if (logoFile && logoFile.size > 0 && logoFile.name !== "undefined") {
            const asset = await sanityWriteClient.assets.upload('image', logoFile, {
                filename: logoFile.name
            });
            logoAssetId = asset._id;
        }

        const patch: any = {
            description,
            whatsapp_number,
            meeting_url,
            years_experience,
            projects_completed_count,
            badges,
            slug: { _type: 'slug', current: slug }
        };

        if (logoAssetId) {
            patch.logo = {
                _type: 'image',
                asset: {
                    _type: 'reference',
                    _ref: logoAssetId
                }
            };
        }

        await sanityWriteClient
            .patch(companyId)
            .set(patch)
            .commit();

        revalidatePath("/dashboard/settings");
        revalidatePath("/profesional/[slug]", "page");
        
        return { success: true };
    } catch (err: any) {
        console.error("Error al actualizar perfil de empresa:", err);
        return { success: false, error: err.message || "Error al conectar con Sanity" };
    }
}
