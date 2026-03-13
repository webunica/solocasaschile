import { getServerSession } from "next-auth";
import { authOptions } from "../../../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import CreatePostForm from "./CreatePostForm";

export default async function CreateBlogPage() {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "admin") {
        redirect("/dashboard");
    }

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-black text-[#3200C1] mb-2">Añadir Publicación</h1>
            <p className="text-slate-500 mb-8">Crea un nuevo artículo para el blog con su configuración SEO.</p>
            
            <CreatePostForm />
        </div>
    );
}
