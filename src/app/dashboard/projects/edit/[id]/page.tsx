import { sanityClient } from "@/lib/sanity.client";
import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../api/auth/[...nextauth]/route";
import EditProjectForm from "./EditProjectForm";

interface Props {
    params: Promise<{ id: string }>;
}

export default async function EditProjectPage({ params }: Props) {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session) redirect("/login");

    const project = await sanityClient.fetch(
        `*[_type == "project" && _id == $id][0]{
            _id,
            title,
            description,
            location_name,
            location,
            completion_date,
            images,
            "companyName": company->company_name
        }`,
        { id },
        { cache: "no-store" }
    );

    if (!project) return notFound();

    // Seguridad: verificar que el proyecto pertenezca al usuario (si no es admin)
    const isAdmin = (session?.user as any)?.role === "admin";
    if (!isAdmin && project.companyName !== session.user?.name) {
        redirect("/dashboard/projects");
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <EditProjectForm project={project} />
        </div>
    );
}
