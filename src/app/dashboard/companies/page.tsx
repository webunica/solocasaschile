import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { sanityClient } from "@/lib/sanity.client";
import { KeyRound, Building2, PlusCircle, Zap } from "lucide-react";
import Link from "next/link";
import ToggleStatusButton from "./ToggleStatusButton";
import BulkCreateButton from "./BulkCreateButton";

const PLAN_CONFIG: Record<string, { label: string; uf: string; clp: string; color: string }> = {
    starter: { label: "Plan Starter", uf: "3 UF", clp: "$119.340", color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
    builder: { label: "Plan Crecer", uf: "6 UF", clp: "$238.680", color: "bg-blue-100 text-blue-700 border-blue-200" },
    constructor: { label: "Plan Destacado", uf: "14 UF", clp: "$556.920", color: "bg-purple-100 text-purple-700 border-purple-200" },
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

    // 5. Métricas
    const registeredActive = b2bAccounts.filter(u => u.is_active !== false && u.role !== "admin");
    const ingresos_uf = registeredActive.reduce((sum, u) => {
        return sum + (u.plan === "constructor" ? 14 : u.plan === "builder" ? 6 : 3);
    }, 0);

    return (
        <div className="space-y-6">
            {/* Alerta de empresas sin cuenta + botón masivo */}
            {allCompanyNames.filter(n => !b2bMap[n]).length > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
                    <div className="flex items-start gap-3 mb-4">
                        <div className="w-8 h-8 rounded-lg bg-amber-400 flex items-center justify-center shrink-0">
                            <Zap className="w-4 h-4 text-amber-900" />
                        </div>
                        <div>
                            <p className="font-black text-amber-900">{allCompanyNames.filter(n => !b2bMap[n]).length} empresas sin cuenta B2B</p>
                            <p className="text-xs text-amber-700 mt-0.5">
                                Se crearán con <strong>Plan Starter activo</strong>, email <code className="bg-amber-100 px-1 rounded">admin@nombre-empresa.cl</code> y contraseña temporal <strong>Starter2025!</strong>
                            </p>
                        </div>
                    </div>
                    <BulkCreateButton pendingCount={allCompanyNames.filter(n => !b2bMap[n]).length} />
                </div>
            )}
            {/* Métricas */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total Empresas en BD</p>
                    <p className="text-3xl font-black text-[#3200C1]">{allCompanyNames.length}</p>
                </div>
                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Cuentas B2B Activas</p>
                    <p className="text-3xl font-black text-[#3200C1]">{registeredActive.length}</p>
                </div>
                <div className="bg-[#37FFDB]/10 rounded-2xl border border-[#37FFDB]/30 p-5 shadow-sm">
                    <p className="text-xs font-bold text-[#3200C1]/60 uppercase tracking-widest mb-1">Sin Cuenta B2B</p>
                    <p className="text-3xl font-black text-[#3200C1]">
                        {allCompanyNames.filter(n => !b2bMap[n]).length}
                    </p>
                    <p className="text-xs text-[#3200C1]/50 mt-1">Potenciales clientes</p>
                </div>
                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Ingresos B2B</p>
                    <p className="text-3xl font-black text-[#3200C1]">{ingresos_uf} <span className="text-base font-bold text-slate-400">UF/mes</span></p>
                </div>
            </div>

            {/* Tabla unificada: todas las empresas */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                    <h3 className="font-bold text-slate-800">Todas las Empresas ({allCompanyNames.length})</h3>
                    <span className="text-xs text-slate-400">Empresas con modelos en la base de datos</span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-slate-500 bg-slate-50 uppercase">
                            <tr>
                                <th className="px-6 py-4 font-bold">Empresa</th>
                                <th className="px-6 py-4 font-bold">Correo / Plan</th>
                                <th className="px-6 py-4 font-bold text-center">Modelos</th>
                                <th className="px-6 py-4 font-bold text-center">Estado</th>
                                <th className="px-6 py-4 font-bold text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {allCompanyNames.map((companyName) => {
                                const b2b = b2bMap[companyName];
                                const hasB2B = !!b2b;
                                const isActive = hasB2B ? b2b.is_active !== false : null;
                                const isAdminRole = hasB2B && b2b.role === "admin";
                                const plan = b2b ? (PLAN_CONFIG[b2b.plan] || PLAN_CONFIG.starter) : null;
                                const count = modelCounts[companyName] || b2b?.model_count || 0;

                                return (
                                    <tr key={companyName} className={`hover:bg-slate-50 transition-colors ${hasB2B && !isActive ? "opacity-50" : ""}`}>
                                        {/* Empresa */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200 overflow-hidden">
                                                    {b2b?.logo_url
                                                        ? <img src={b2b.logo_url} alt="" className="w-full h-full object-cover" />
                                                        : <Building2 className="w-4 h-4 text-slate-400" />
                                                    }
                                                </div>
                                                <div>
                                                    <span className="font-bold text-slate-800 block leading-tight">{companyName}</span>
                                                    {isAdminRole && (
                                                        <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Superadmin</span>
                                                    )}
                                                    {!hasB2B && (
                                                        <span className="text-[10px] font-bold text-slate-400">Sin cuenta B2B</span>
                                                    )}
                                                </div>
                                            </div>
                                        </td>

                                        {/* Correo / Plan */}
                                        <td className="px-6 py-4">
                                            {hasB2B ? (
                                                <div>
                                                    <p className="text-xs text-slate-500 font-medium mb-1">{b2b.email}</p>
                                                    {isAdminRole ? (
                                                        <span className="px-2.5 py-1 text-xs font-black rounded-full border bg-amber-100 text-amber-700 border-amber-200">Superadmin</span>
                                                    ) : plan ? (
                                                        <span className={`px-2.5 py-1 text-xs font-black rounded-full border ${plan.color}`}>
                                                            {plan.label} — {plan.uf}
                                                        </span>
                                                    ) : null}
                                                </div>
                                            ) : (
                                                <span className="text-xs text-slate-400 italic">—</span>
                                            )}
                                        </td>

                                        {/* Modelos */}
                                        <td className="px-6 py-4 text-center">
                                            <span className="font-black text-lg text-slate-700">{count}</span>
                                            {hasB2B && !isAdminRole && b2b.plan === "starter" && (
                                                <span className="block text-[10px] text-slate-400">de 5 máx.</span>
                                            )}
                                        </td>

                                        {/* Estado */}
                                        <td className="px-6 py-4">
                                            {hasB2B && !isAdminRole ? (
                                                <div className="flex flex-col items-center gap-1">
                                                    <ToggleStatusButton id={b2b._id} isActive={isActive!} />
                                                    <span className={`text-[10px] font-bold ${isActive ? "text-emerald-600" : "text-slate-400"}`}>
                                                        {isActive ? "Activa" : "Inactiva"}
                                                    </span>
                                                </div>
                                            ) : !hasB2B ? (
                                                <div className="flex justify-center">
                                                    <span className="px-2 py-1 text-[10px] font-bold rounded-full bg-slate-100 text-slate-500 border border-slate-200">Sin cuenta</span>
                                                </div>
                                            ) : (
                                                <div className="flex justify-center">
                                                    <span className="text-xs text-slate-400">—</span>
                                                </div>
                                            )}
                                        </td>

                                        {/* Acciones */}
                                        <td className="px-6 py-4 text-right">
                                            {hasB2B ? (
                                                <Link
                                                    href={`/dashboard/companies/edit/${b2b._id}`}
                                                    className="p-2 hover:text-amber-500 hover:bg-amber-50 rounded-lg transition-colors inline-flex"
                                                    title="Editar empresa"
                                                >
                                                    <KeyRound className="w-4 h-4" />
                                                </Link>
                                            ) : (
                                                <Link
                                                    href={`/dashboard/companies/create?name=${encodeURIComponent(companyName)}`}
                                                    className="p-2 hover:text-[#3200C1] hover:bg-[#3200C1]/5 rounded-lg transition-colors inline-flex"
                                                    title="Crear cuenta B2B para esta empresa"
                                                >
                                                    <PlusCircle className="w-4 h-4" />
                                                </Link>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

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
                        <tr className="hover:bg-slate-50"><td className="px-6 py-4 font-black text-emerald-600">🟢 Plan Starter</td><td className="px-6 py-4 font-bold text-right">3 UF</td><td className="px-6 py-4 text-slate-500 text-right">$119.340</td><td className="px-6 py-4 text-slate-500">Hasta 5 modelos, recepción de cotizaciones, visibilidad estándar.</td></tr>
                        <tr className="hover:bg-slate-50"><td className="px-6 py-4 font-black text-blue-600">🔵 Plan Crecer</td><td className="px-6 py-4 font-bold text-right">6 UF</td><td className="px-6 py-4 text-slate-500 text-right">$238.680</td><td className="px-6 py-4 text-slate-500">Catálogo ilimitado, prioridad en el buscador, menciones en RRSS del HUB, leads calificados.</td></tr>
                        <tr className="hover:bg-slate-50"><td className="px-6 py-4 font-black text-purple-600">🟣 Plan Destacado</td><td className="px-6 py-4 font-bold text-right">14 UF</td><td className="px-6 py-4 text-slate-500 text-right">$556.920</td><td className="px-6 py-4 text-slate-500">Todo lo anterior + banners destacados + artículos exclusivos en el Blog.</td></tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}
