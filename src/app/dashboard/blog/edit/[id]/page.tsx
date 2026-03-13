import { getServerSession } from "next-auth";
import { authOptions } from "../../../../api/auth/[...nextauth]/route";
import { redirect, notFound } from "next/navigation";
import EditPostForm from "./EditPostForm";
import { sanityClient } from "@/lib/sanity.client";

export default async function EditBlogPage({ params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "admin") {
        redirect("/dashboard");
    }

    const { id } = await params;

    const post = await sanityClient.fetch(`*[_type == "blogPost" && _id == $id][0]{
        _id,
        title,
        "slug": slug.current,
        category,
        excerpt,
        htmlContent,
        schemaMarkup,
        "coverImageUrl": coverImage.asset->url,
        "imageAlt": coverImage.alt,
        "imageCaption": coverImage.caption
    }`, { id });

    if (!post) {
        notFound();
    }

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-black text-[#3200C1] mb-2">Editar Publicación</h1>
            <p className="text-slate-500 mb-8">Modifica el contenido y configuración SEO de este artículo.</p>
            
            <EditPostForm post={post} />
        </div>
    );
}
