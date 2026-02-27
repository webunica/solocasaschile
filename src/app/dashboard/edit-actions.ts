"use server";

import { sanityWriteClient } from "@/lib/sanity.server";
import { revalidatePath } from "next/cache";

export async function editModelAction(id: string, formData: FormData) {
    if (!process.env.SANITY_API_WRITE_TOKEN) {
        throw new Error("No hay token de escritura configurado.");
    }

    try {
        // Obtenemos los campos simples
        const model_name = formData.get("model_name")?.toString() || "";
        const category = formData.get("category")?.toString() || "";
        const surface_m2 = parseFloat(formData.get("surface_m2")?.toString() || "0");
        const price_from = parseFloat(formData.get("price_from")?.toString() || "0");

        // Características físicas
        const bedrooms = parseInt(formData.get("bedrooms")?.toString() || "0");
        const bathrooms = parseInt(formData.get("bathrooms")?.toString() || "0");
        const floors = parseInt(formData.get("floors")?.toString() || "1");
        const structure_material = formData.get("structure_material")?.toString() || "";
        const delivery_modes_raw = formData.get("delivery_modes")?.toString() || "";
        const delivery_modes = delivery_modes_raw ? delivery_modes_raw.split(',').map(m => m.trim()) : [];
        const description = formData.get("description")?.toString() || "";

        // SEO
        const seo_title = formData.get("seo_title")?.toString() || "";
        const seo_description = formData.get("seo_description")?.toString() || "";
        const seo_keywords = formData.get("seo_keywords")?.toString() || "";

        // Procesar fotos subidas nuevas si vienen (opcional en edición)
        const photos = formData.getAll("photos") as File[];
        const imageAssets: any[] = [];

        for (const [idx, file] of photos.entries()) {
            if (file.size > 0 && file.name) {
                const asset = await sanityWriteClient.assets.upload('image', file, {
                    filename: file.name
                });

                imageAssets.push({
                    _key: `img-${Date.now()}-${idx}`,
                    _type: "image",
                    asset: {
                        _type: "reference",
                        _ref: asset._id
                    }
                });
            }
        }

        // Preparamos el objeto Patch para mutar en Sandbox / Document
        const patchData: any = {
            model_name,
            category,
            surface_m2,
            price_from,
            bedrooms,
            bathrooms,
            floors,
            structure_material,
            delivery_modes,
            description,
            seo_title,
            seo_description,
            seo_keywords,
        };

        const mutation = sanityWriteClient.patch(id).set(patchData);

        // Si adjuntó fotos nuevas, se agregan al set de imágenes o si quieres reemplazar array usaríamos .set({images:...})
        if (imageAssets.length > 0) {
            mutation.setIfMissing({ images: [] }).append('images', imageAssets);
        }

        await mutation.commit();

        revalidatePath("/dashboard");
        revalidatePath("/");

        return { success: true };

    } catch (error: any) {
        console.error("Edit Model Error:", error);
        return { error: error.message || "Ocurrió un error inesperado al actualizar." };
    }
}
