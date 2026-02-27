import { getServerSession } from "next-auth";
import { authOptions } from "../../../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import CreateCompanyForm from "./CreateCompanyForm";

export default async function CreateCompanyPage({
    searchParams,
}: {
    searchParams: Promise<{ name?: string }>;
}) {
    const session = await getServerSession(authOptions);
    const isAdmin = (session?.user as any)?.role === "admin";

    if (!isAdmin) redirect("/dashboard");

    const { name } = await searchParams;

    return (
        <div>
            <CreateCompanyForm initialName={name} />
        </div>
    );
}
