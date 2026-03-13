import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import SocialPublishForm from "./SocialPublishForm";

export default async function SocialPage() {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "admin") {
        redirect("/dashboard");
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-black text-[#3200C1]">Publicar en Redes Sociales</h1>
                <p className="text-slate-500 mt-2">Crea y publica contenido directamente en Facebook e Instagram desde aquí.</p>
            </div>
            <SocialPublishForm />
        </div>
    );
}
