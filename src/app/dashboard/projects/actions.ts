"use server";

import { sanityWriteClient } from "@/lib/sanity.server";
import { revalidatePath } from "next/cache";

export async function deleteProjectAction(id: string) {
    if (!process.env.SANITY_API_WRITE_TOKEN) {
        throw new Error("No hay token de escritura configurado.");
    }

    try {
        await sanityWriteClient.delete(id);
        revalidatePath("/dashboard/projects");
        return { success: true };
    } catch (error: any) {
        console.error("Delete Project Error:", error);
        return { error: error.message };
    }
}

export async function createProjectAction(formData: FormData) {
    if (!process.env.SANITY_API_WRITE_TOKEN) {
        throw new Error("No hay token de escritura configurado.");
    }

    try {
        const companyId = formData.get("companyId")?.toString() || "";
        const title = formData.get("title")?.toString() || "";
        const description = formData.get("description")?.toString() || "";
        const location_name = formData.get("location_name")?.toString() || "";
        const completion_date = formData.get("completion_date")?.toString() || "";
        
        // Coordenadas
        const lat = parseFloat(formData.get("lat")?.toString() || "0");
        const lng = parseFloat(formData.get("lng")?.toString() || "0");

        // Fotos
        let photos = formData.getAll("photos") as File[];
        const imageAssets = [];

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

        const doc = {
            _type: 'project',
            company: {
                _type: 'reference',
                _ref: companyId
            },
            title,
            description,
            location_name,
            completion_date,
            ...(lat !== 0 && lng !== 0 && {
                location: {
                    _type: 'geopoint',
                    lat,
                    lng
                }
            }),
            ...(imageAssets.length > 0 && { images: imageAssets }),
        };

        await sanityWriteClient.create(doc);

        revalidatePath("/dashboard/projects");
        revalidatePath("/profesional"); // Revalidar perfiles públicos

        return { success: true };

    } catch (error: any) {
        console.error("Create Project Error:", error);
        return { error: error.message || "Error al publicar el proyecto." };
    }
}
