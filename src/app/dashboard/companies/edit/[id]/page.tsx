import { sanityClient } from "@/lib/sanity.client";
import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import EditCompanyForm from "./EditCompanyForm";

export default async function EditCompanyPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    const isAdmin = (session?.user as any)?.role === "admin";

    if (!isAdmin) {
        redirect("/dashboard");
    }

    const query = `*[_type == "companyUser" && _id == $id][0] {
        _id,
        company_name,
        email,
        role,
        "logo_url": logo.asset->url
    }`;
    const companyUser = await sanityClient.fetch(query, { id });

    if (!companyUser) {
        notFound();
    }

    return <EditCompanyForm companyUser={companyUser} />;
}
