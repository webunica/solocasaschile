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
        const coverage_areas = formData.getAll("coverage_areas") as string[];
        
        const logoFile = formData.get("logo") as File;
        const coverFile = formData.get("cover") as File;
        let logoAssetId = "";
        let coverAssetId = "";

        if (logoFile && logoFile.size > 0 && logoFile.name !== "undefined") {
            const asset = await sanityWriteClient.assets.upload('image', logoFile, {
                filename: logoFile.name
            });
            logoAssetId = asset._id;
        }

        if (coverFile && coverFile.size > 0 && coverFile.name !== "undefined") {
            const asset = await sanityWriteClient.assets.upload('image', coverFile, {
                filename: coverFile.name
            });
            coverAssetId = asset._id;
        }

        const patch: any = {
            description,
            whatsapp_number,
            meeting_url,
            years_experience,
            projects_completed_count,
            badges,
            coverage_areas,
            slug: { _type: 'slug', current: slug }
        };

        if (logoAssetId) {
            patch.logo = {
                _type: 'image',
                asset: { _type: 'reference', _ref: logoAssetId }
            };
        }

        if (coverAssetId) {
            patch.cover_image = {
                _type: 'image',
                asset: { _type: 'reference', _ref: coverAssetId }
            };
        }

        await sanityWriteClient
            .patch(companyId)
            .set(patch)
            .commit();

        revalidatePath("/dashboard/settings");
        revalidatePath("/empresas-construccion");
        revalidatePath("/empresas-construccion/[region]", "page");
        revalidatePath("/empresas-construccion/[region]/[slug]", "page");
        
        return { success: true };
    } catch (err: any) {
        console.error("Error al actualizar perfil de empresa:", err);
        return { success: false, error: err.message || "Error al conectar con Sanity" };
    }
}
