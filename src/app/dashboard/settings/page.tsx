import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { sanityClient } from "@/lib/sanity.client";
import SettingsForm from "./SettingsForm";
import CompanySettingsForm from "./CompanySettingsForm";

const SETTINGS_DOC_ID = "site-settings-singleton";

export default async function SettingsPage() {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        redirect("/login");
    }

    const isAdmin = (session?.user as any)?.role === "admin";
    const companyEmail = session?.user?.email || "";

    if (isAdmin) {
        // Cargamos la config global (Solo Admin)
        const settings = await sanityClient.fetch(
            `*[_type == "siteSettings" && _id == $id][0]`,
            { id: SETTINGS_DOC_ID },
            { cache: "no-store" }
        );

        return (
            <div className="space-y-6">
                <div>
                    <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">⚙️ Ajustes del Portal (Admin)</h2>
                    <p className="text-slate-500 text-sm mt-1">Configuración global de correos, integraciones y comportamiento.</p>
                </div>
                <SettingsForm settings={settings} />
            </div>
        );
    }

    // Para Empresas
    const company = await sanityClient.fetch(
        `*[_type == "companyUser" && email == $email][0]{
            _id, company_name, logo, plan, whatsapp_number, meeting_url, description, is_verified
        }`,
        { email: companyEmail },
        { cache: "no-store" }
    );

    if (!company) {
        return (
            <div className="p-12 text-center bg-red-50 text-red-500 font-bold rounded-3xl">
                Perfil de empresa no encontrado. Por favor contacta soporte.
            </div>
        );
    }

    return (
        <div className="space-y-8 max-w-4xl">
            <header>
                <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">🏢 Configuración de Empresa</h2>
                <p className="text-slate-500 text-sm mt-1">Personaliza tu perfil público para atraer más clientes.</p>
            </header>
            <CompanySettingsForm company={company} />
        </div>
    );
}
