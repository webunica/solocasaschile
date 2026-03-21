"use server";

import { sanityWriteClient } from "@/lib/sanity.server";
import { revalidatePath } from "next/cache";

const SETTINGS_DOC_ID = "site-settings-singleton";

export async function saveSettingsAction(formData: FormData) {
    if (!process.env.SANITY_API_WRITE_TOKEN) {
        return { error: "No hay token de escritura configurado en el servidor." };
    }

    try {
        const resend_api_key = formData.get("resend_api_key")?.toString() || "";
        const from_email = formData.get("from_email")?.toString() || "";
        const admin_email = formData.get("admin_email")?.toString() || "";
        const site_name = formData.get("site_name")?.toString() || "";
        const whatsapp_fallback = formData.get("whatsapp_fallback")?.toString() || "";
        const home_version = formData.get("home_version")?.toString() || "v1";

        // Aseguramos que existe el documento sin sobreescribir
        await sanityWriteClient.createIfNotExists({ _id: SETTINGS_DOC_ID, _type: "siteSettings" });

        // Actualizamos solo los campos del formulario
        await sanityWriteClient.patch(SETTINGS_DOC_ID).set({
            resend_api_key,
            from_email,
            admin_email,
            site_name,
            whatsapp_fallback,
            home_version
        }).commit();

        revalidatePath("/");
        revalidatePath("/dashboard/settings");
        return { success: true };

    } catch (error: any) {
        console.error("SaveSettings Error:", error);
        return { error: error.message || "Error al guardar los ajustes." };
    }
}
