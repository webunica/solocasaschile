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

export async function updateProjectAction(projectId: string, formData: FormData) {
    if (!process.env.SANITY_API_WRITE_TOKEN) {
        throw new Error("No hay token de escritura configurado.");
    }

    try {
        console.log("Iniciando updateProjectAction para:", projectId);
        const title = formData.get("title")?.toString() || "";
        const description = formData.get("description")?.toString() || "";
        const location_name = formData.get("location_name")?.toString() || "";
        const completion_date = formData.get("completion_date")?.toString() || "";
        const lat = parseFloat(formData.get("lat")?.toString() || "0");
        const lng = parseFloat(formData.get("lng")?.toString() || "0");

        // Fotos nuevas
        let newPhotos = formData.getAll("photos") as File[];
        const imageAssets = [];

        for (const [idx, file] of newPhotos.entries()) {
            if (file.size > 0 && file.name && file.name !== "undefined") {
                const asset = await sanityWriteClient.assets.upload('image', file, {
                    filename: file.name
                });
                imageAssets.push({
                    _key: `img-${Date.now()}-${idx}`,
                    _type: "image",
                    asset: { _type: "reference", _ref: asset._id }
                });
            }
        }

        const patchData: any = {
            title,
            description,
            location_name,
            completion_date,
        };

        if (lat !== 0 && lng !== 0) {
            patchData.location = { _type: 'geopoint', lat, lng };
        }

        let patch = sanityWriteClient.patch(projectId).set(patchData);

        // Si hay fotos nuevas, las añadimos
        if (imageAssets.length > 0) {
            patch = patch.append('images', imageAssets);
        }

        await patch.commit();

        revalidatePath("/dashboard/projects");
        return { success: true };
    } catch (error: any) {
        console.error("Update Project Error:", error);
        return { error: error.message || "Error al actualizar el proyecto." };
    }
}

export async function createProjectAction(formData: FormData) {
    if (!process.env.SANITY_API_WRITE_TOKEN) {
        throw new Error("No hay token de escritura configurado.");
    }

    try {
        console.log("Iniciando createProjectAction...");
        const companyId = formData.get("companyId")?.toString() || "";
        const title = formData.get("title")?.toString() || "";
        const description = formData.get("description")?.toString() || "";
        const location_name = formData.get("location_name")?.toString() || "";
        const completion_date = formData.get("completion_date")?.toString() || "";
        
        console.log("Datos recibidos:", { companyId, title, location_name });

        if (!companyId) {
            return { error: "ID de empresa no encontrado en la petición." };
        }

        // Coordenadas
        const lat = parseFloat(formData.get("lat")?.toString() || "0");
        const lng = parseFloat(formData.get("lng")?.toString() || "0");

        // Fotos
        let photos = formData.getAll("photos") as File[];
        const imageAssets = [];

        console.log(`Subiendo ${photos.length} fotos...`);

        for (const [idx, file] of photos.entries()) {
            if (file.size > 0 && file.name && file.name !== "undefined") {
                try {
                    console.log(`Subiendo foto ${idx + 1}: ${file.name}`);
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
                } catch (uploadErr: any) {
                    console.error(`Error subiendo foto ${idx}:`, uploadErr);
                    // Continuamos con las demás fotos
                }
            }
        }

        const doc: any = {
            _type: 'project',
            company: {
                _type: 'reference',
                _ref: companyId
            },
            title,
            description,
            location_name,
            completion_date,
            ...(imageAssets.length > 0 && { images: imageAssets }),
        };

        if (lat !== 0 && lng !== 0) {
            doc.location = {
                _type: 'geopoint',
                lat,
                lng
            };
        }

        console.log("Creando documento en Sanity...");
        const result = await sanityWriteClient.create(doc);
        console.log("Proyecto creado éxito:", result._id);

        revalidatePath("/dashboard/projects");
        revalidatePath("/empresas-construccion");

        return { success: true };

    } catch (error: any) {
        console.error("CRITICAL: Create Project Error:", error);
        return { error: `Error del servidor: ${error.message || "Error desconocido"}` };
    }
}
