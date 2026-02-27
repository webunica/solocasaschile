"use server";

import { sanityWriteClient } from "@/lib/sanity.server";
import { revalidatePath } from "next/cache";

export async function deleteModelAction(id: string) {
    if (!process.env.SANITY_API_WRITE_TOKEN) {
        throw new Error("No hay token de escritura configurado en las variables de entorno.");
    }

    try {
        await sanityWriteClient.delete(id);
        revalidatePath("/dashboard");     // Refresca la tabla del dashboard
        revalidatePath("/");              // Refresca el inicio público
        return { success: true };
    } catch (error: any) {
        console.error("Delete Error:", error);
        return { error: error.message };
    }
}

export async function createModelAction(formData: FormData) {
    if (!process.env.SANITY_API_WRITE_TOKEN) {
        throw new Error("No hay token de escritura configurado.");
    }

    try {
        // Obtenemos los campos simples
        const company_name = formData.get("company_name")?.toString() || "";

        // ── Validar límite de plan Starter ────────────────────────
        const companyUser = await sanityWriteClient.fetch(
            `*[_type == "companyUser" && company_name == $name][0]{ plan }`,
            { name: company_name }
        );
        if (companyUser?.plan === "starter" || !companyUser?.plan) {
            const modelCount: number = await sanityWriteClient.fetch(
                `count(*[_type == "houseModel" && company_name == $name])`,
                { name: company_name }
            );
            if (modelCount >= 5) {
                return { error: "Has alcanzado el límite de 5 modelos del Plan Starter. Actualiza tu plan a Builder para publicar más." };
            }
        }

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
        // Convertir string "Llave en mano, Obra gruesa" a array
        const delivery_modes = delivery_modes_raw ? delivery_modes_raw.split(',').map(m => m.trim()) : [];

        // Texto descriptivo general
        const description = formData.get("description")?.toString() || "";

        // SEO
        const seo_title = formData.get("seo_title")?.toString() || "";
        const seo_description = formData.get("seo_description")?.toString() || "";
        const seo_keywords = formData.get("seo_keywords")?.toString() || "";

        // Procesar fotos subidas (múltiples archivos bajo el name "photos")
        const photos = formData.getAll("photos") as File[];
        const imageAssets = [];

        for (const [idx, file] of photos.entries()) {
            if (file.size > 0 && file.name) {
                // Subir archivo binario a Sanity
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

        const doc = {
            _type: 'houseModel',
            company_name,
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
            ...(imageAssets.length > 0 && { images: imageAssets })
        };

        await sanityWriteClient.create(doc);

        revalidatePath("/dashboard");
        revalidatePath("/");

        return { success: true };

    } catch (error: any) {
        console.error("Create Model Error:", error);
        return { error: error.message || "Ocurrió un error inesperado al publicar." };
    }
}
