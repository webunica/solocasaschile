import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { sanityClient } from "@/lib/sanity.client";
import SettingsForm from "./SettingsForm";

const SETTINGS_DOC_ID = "site-settings-singleton";

export default async function SettingsPage() {
    const session = await getServerSession(authOptions);
    const isAdmin = (session?.user as any)?.role === "admin";

    if (!isAdmin) {
        redirect("/dashboard");
    }

    // Cargamos la config actual desde Sanity
    const settings = await sanityClient.fetch(
        `*[_type == "siteSettings" && _id == $id][0]`,
        { id: SETTINGS_DOC_ID },
        { cache: "no-store" }
    );

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-black text-slate-800">Ajustes del Portal</h2>
                <p className="text-slate-500 text-sm mt-1">Configuración global de emails, integraciones y comportamiento del sitio.</p>
            </div>
            <SettingsForm settings={settings} />
        </div>
    );
}
