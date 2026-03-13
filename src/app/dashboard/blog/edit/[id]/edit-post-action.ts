"use server";

import { sanityWriteClient } from "@/lib/sanity.server";
import { revalidatePath } from "next/cache";

export async function editPostAction(id: string, formData: FormData) {
    try {
        if (!id) throw new Error("ID de publicación inválido");

        const title = formData.get("title") as string;
        const slug = formData.get("slug") as string;
        const category = formData.get("category") as string;
        const excerpt = formData.get("excerpt") as string;
        const htmlContent = formData.get("htmlContent") as string;
        const schemaMarkup = formData.get("schemaMarkup") as string;
        const imageFile = formData.get("coverImage") as File;
        const imageAlt = formData.get("imageAlt") as string;
        const imageCaption = formData.get("imageCaption") as string;

        if (!title || !slug) {
            return { error: "El título y el slug son obligatorios." };
        }

        const patchData: any = {
            title,
            slug: { _type: "slug", current: slug },
            category: category || "",
            excerpt: excerpt || "",
            htmlContent: htmlContent || "",
            schemaMarkup: schemaMarkup || "",
        };

        // Si sube una nueva imagen, o si cambia el alt/caption
        let coverImageAsset: any = undefined;

        if (imageFile && imageFile.size > 0 && imageFile.name) {
            const buffer = Buffer.from(await imageFile.arrayBuffer());
            const asset = await sanityWriteClient.assets.upload('image', buffer, { filename: imageFile.name });
            coverImageAsset = {
                _type: "image",
                asset: { _type: "reference", _ref: asset._id },
                alt: imageAlt || title,
                caption: imageCaption || ""
            };
        }

        if (coverImageAsset) {
            patchData.coverImage = coverImageAsset;
        } else {
            // Solo actualizar alt y caption de la imagen existente si no me dan archivo nuevo
            // Usando set en subcampos si no quiero reemplazar el objeto completo
            patchData['coverImage.alt'] = imageAlt || title;
            patchData['coverImage.caption'] = imageCaption || "";
        }

        // Patch en Sanity
        await sanityWriteClient.patch(id).set(patchData).commit();

        revalidatePath(`/dashboard/blog/edit/${id}`);
        revalidatePath("/dashboard/blog");
        revalidatePath("/blog", "layout");
        revalidatePath(`/blog/${slug}`);

        return { success: true };
    } catch (error: any) {
        return { error: error.message || "Error al editar la publicación" };
    }
}
