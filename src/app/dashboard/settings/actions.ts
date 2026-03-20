"use server";

import { sanityWriteClient } from "@/lib/sanity.server";
import { revalidatePath } from "next/cache";

export async function updateCompanyProfileAction(companyId: string, data: any) {
    if (!companyId) return { success: false, error: "ID de empresa no proporcionado." };

    try {
        await sanityWriteClient
            .patch(companyId)
            .set({
                description: data.description,
                whatsapp_number: data.whatsapp_number,
                meeting_url: data.meeting_url,
                years_experience: data.years_experience,
                projects_completed_count: data.projects_completed_count,
                badges: data.badges
            })
            .commit();

        revalidatePath("/dashboard/settings");
        return { success: true };
    } catch (err: any) {
        console.error("Error al actualizar perfil de empresa:", err);
        return { success: false, error: err.message || "Error al conectar con Sanity" };
    }
}
