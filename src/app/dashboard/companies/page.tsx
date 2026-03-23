import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { sanityClient } from "@/lib/sanity.client";
import { KeyRound, Building2, PlusCircle, Zap } from "lucide-react";
import Link from "next/link";
import ToggleStatusButton from "./ToggleStatusButton";
import BulkCreateButton from "./BulkCreateButton";
import CompaniesTable from "./CompaniesTable";

const PLAN_CONFIG: Record<string, { label: string; uf: string; clp: string; color: string }> = {
    free: { label: "Plan Inicial", uf: "0 UF", clp: "$0", color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
    pro: { label: "Plan Pro", uf: "-", clp: "$34.900", color: "bg-blue-100 text-blue-700 border-blue-200" },
    elite: { label: "Plan Elite", uf: "-", clp: "$79.900", color: "bg-purple-100 text-purple-700 border-purple-200" },
};

export default async function CompaniesManagementPage() {
    const session = await getServerSession(authOptions);
    const isAdmin = (session?.user as any)?.role === "admin";

    if (!isAdmin) redirect("/dashboard");

    // 1. Todas las empresas con casas en la BD (distintas)
    const allCompanyNames: string[] = await sanityClient.fetch(
        `array::unique(*[_type == "houseModel" && defined(company_name)].company_name) | order(@)`,
        {},
        { cache: "no-store" }
    );

    // 2. Cuentas B2B registradas
    const b2bAccounts: any[] = await sanityClient.fetch(
        `*[_type == "companyUser"] | order(company_name asc) {
            _id, company_name, email, role, plan, is_active,
            "logo_url": logo.asset->url,
            "model_count": count(*[_type == "houseModel" && company_name == ^.company_name])
        }`,
        {},
        { cache: "no-store" }
    );

    // 3. Contar modelos por empresa (query simple: solo el campo company_name)
    const allModelNames: string[] = await sanityClient.fetch(
        `*[_type == "houseModel" && defined(company_name)].company_name`,
        {},
        { cache: "no-store" }
    );
    const modelCounts: Record<string, number> = {};
    allModelNames.forEach((name) => {
        modelCounts[name] = (modelCounts[name] || 0) + 1;
    });

    // 4. Mapa de cuentas B2B por nombre de empresa
    const b2bMap: Record<string, any> = {};
    b2bAccounts.forEach((acc) => { b2bMap[acc.company_name] = acc; });

    // 5. Lista unificada: empresas con modelos + cuentas B2B (aunque no tengan modelos)
    const allNamesSet = new Set<string>([
        ...allCompanyNames,
        ...b2bAccounts.map(acc => acc.company_name).filter(Boolean),
    ]);
    const allNames = Array.from(allNamesSet).sort((a, b) => a.localeCompare(b, "es"));

    // 6. Métricas
    const registeredActive = b2bAccounts.filter(u => u.is_active !== false && u.role !== "admin");
    const ingresos_clp = registeredActive.reduce((sum, u) => {
        return sum + (u.plan === "elite" ? 79900 : u.plan === "pro" ? 34900 : 0);
    }, 0);

    return (
        <div className="space-y-6">
            {/* Alerta de empresas sin cuenta + botón masivo */}
            {allNames.filter(n => !b2bMap[n]).length > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
                    <div className="flex items-start gap-3 mb-4">
                        <div className="w-8 h-8 rounded-lg bg-amber-400 flex items-center justify-center shrink-0">
                            <Zap className="w-4 h-4 text-amber-900" />
                        </div>
                        <div>
                            <p className="font-black text-amber-900">{allNames.filter(n => !b2bMap[n]).length} empresas sin cuenta B2B</p>
                            <p className="text-xs text-amber-700 mt-0.5">
                                Se crearán con <strong>Plan Inicial activo</strong>, email <code className="bg-amber-100 px-1 rounded">admin@nombre-empresa.cl</code> y contraseña temporal <strong>Starter2025!</strong>
                            </p>
                        </div>
                    </div>
                    <BulkCreateButton pendingCount={allNames.filter(n => !b2bMap[n]).length} />
                </div>
            )}
            {/* Métricas */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total Empresas en BD</p>
                    <p className="text-3xl font-black text-[#3200C1]">{allNames.length}</p>
                </div>
                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Cuentas B2B Activas</p>
                    <p className="text-3xl font-black text-[#3200C1]">{registeredActive.length}</p>
                </div>
                <div className="bg-[#37FFDB]/10 rounded-2xl border border-[#37FFDB]/30 p-5 shadow-sm">
                    <p className="text-xs font-bold text-[#3200C1]/60 uppercase tracking-widest mb-1">Sin Cuenta B2B</p>
                    <p className="text-3xl font-black text-[#3200C1]">
                        {allNames.filter(n => !b2bMap[n]).length}
                    </p>
                    <p className="text-xs text-[#3200C1]/50 mt-1">Potenciales clientes</p>
                </div>
                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Ingresos B2B Mensuales</p>
                    <p className="text-3xl font-black text-[#3200C1]">${ingresos_clp.toLocaleString("es-CL")} <span className="text-base font-bold text-slate-400">CLP</span></p>
                </div>
            </div>

            {/* Nueva Tabla Unificada con Selección y Eliminación Masiva */}
            <CompaniesTable 
                allNames={allNames}
                b2bMap={b2bMap}
                modelCounts={modelCounts}
            />

            {/* Tabla de planes */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-200">
                    <h3 className="font-bold text-slate-800">📋 Planes Disponibles</h3>
                </div>
                <table className="w-full text-sm">
                    <thead className="text-xs text-slate-500 bg-slate-50 uppercase">
                        <tr>
                            <th className="px-6 py-3 font-bold text-left">Plan</th>
                            <th className="px-6 py-3 font-bold text-right">Precio UF</th>
                            <th className="px-6 py-3 font-bold text-right">Precio CLP</th>
                            <th className="px-6 py-3 font-bold text-left">Descripción</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        <tr className="hover:bg-slate-50"><td className="px-6 py-4 font-black text-emerald-600">🟢 Plan Inicial</td><td className="px-6 py-4 font-bold text-right">Gratis (4m)</td><td className="px-6 py-4 text-slate-500 text-right">$0</td><td className="px-6 py-4 text-slate-500">Hasta 3 modelos, botón WhatsApp con mensaje y perfil público.</td></tr>
                        <tr className="hover:bg-slate-50"><td className="px-6 py-4 font-black text-blue-600">🔵 Plan Pro</td><td className="px-6 py-4 font-bold text-right">-</td><td className="px-6 py-4 text-slate-500 text-right">$34.900 /mes</td><td className="px-6 py-4 text-slate-500">20 modelos, leads a WhatsApp, empresa verificada, PDF automático.</td></tr>
                        <tr className="hover:bg-slate-50"><td className="px-6 py-4 font-black text-purple-600">🟣 Plan Elite</td><td className="px-6 py-4 font-bold text-right">-</td><td className="px-6 py-4 text-slate-500 text-right">$79.900 /mes</td><td className="px-6 py-4 text-slate-500">Ilimitados, corporativo, comparador destacado, landing premium.</td></tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}
