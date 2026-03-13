"use server";

import { sanityWriteClient } from "@/lib/sanity.server";
import { revalidatePath } from "next/cache";

export async function createPostAction(formData: FormData) {
    try {
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

        // Subida de imagen principal si existe
        let coverImageAsset;
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

        // Crear documento en Sanity
        await sanityWriteClient.create({
            _type: "blogPost",
            title,
            slug: { _type: "slug", current: slug },
            category,
            excerpt,
            htmlContent,
            schemaMarkup,
            ...(coverImageAsset && { coverImage: coverImageAsset }),
            publishedAt: new Date().toISOString()
        });

        revalidatePath("/dashboard/blog");
        revalidatePath("/blog", "layout");
        revalidatePath(`/blog/${slug}`);

        return { success: true };
    } catch (error: any) {
        return { error: error.message || "Error al crear la publicación" };
    }
}
