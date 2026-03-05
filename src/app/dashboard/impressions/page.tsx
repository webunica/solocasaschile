import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]/route";
import { sanityClient } from "@/lib/sanity.client";
import { BarChart3, ExternalLink, Calendar, MousePointerClick, TrendingUp, Building2 } from "lucide-react";
import Link from "next/link";

export default async function ImpressionsPage() {
    const session = await getServerSession(authOptions);
    const isAdmin = (session?.user as any)?.role === "admin";
    const companyName = session?.user?.name || "";

    // Traer los clics filtrados por empresa o todos (admin)
    const query = isAdmin
        ? `*[_type == "propertyClick"] | order(clicked_at desc) [0...200] {
            _id, model_id, model_name, company_name, target_url, source, clicked_at
          }`
        : `*[_type == "propertyClick" && company_name == $company] | order(clicked_at desc) [0...200] {
            _id, model_id, model_name, company_name, target_url, source, clicked_at
          }`;

    const clicks: any[] = await sanityClient.fetch(
        query,
        { company: companyName },
        { cache: "no-store" }
    );

    // ── Métricas rápidas ────────────────────────────────────────
    const total = clicks.length;
    const fromCard = clicks.filter((c) => c.source === "card").length;
    const fromDetail = clicks.filter((c) => c.source === "detail").length;

    // Top modelos
    const modelCounts: Record<string, { name: string; company: string; count: number; url: string }> = {};
    for (const c of clicks) {
        const key = c.model_id || c.model_name;
        if (!modelCounts[key]) {
            modelCounts[key] = { name: c.model_name, company: c.company_name, count: 0, url: c.target_url };
        }
        modelCounts[key].count++;
    }
    const topModels = Object.values(modelCounts).sort((a, b) => b.count - a.count).slice(0, 10);

    // Top empresas (admin)
    const companyCounts: Record<string, number> = {};
    if (isAdmin) {
        for (const c of clicks) {
            if (c.company_name) {
                companyCounts[c.company_name] = (companyCounts[c.company_name] || 0) + 1;
            }
        }
    }
    const topCompanies = Object.entries(companyCounts).sort((a, b) => b[1] - a[1]).slice(0, 8);

    // Últimos 7 días
    const now = Date.now();
    const last7d = clicks.filter((c) => now - new Date(c.clicked_at).getTime() < 7 * 86400 * 1000).length;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-black text-slate-800">📊 Impresiones & Clics</h2>
                    <p className="text-xs text-slate-400 mt-1">
                        Registro de cada vez que un visitante hace clic en «Ver Publicación» de tus propiedades
                    </p>
                </div>
                {isAdmin && (
                    <span className="text-xs font-bold px-3 py-1.5 bg-[#37FFDB]/20 text-[#3200C1] rounded-full">
                        Vista Global (Admin)
                    </span>
                )}
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                        <MousePointerClick className="w-4 h-4 text-[#3200C1]" />
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Clics Totales</p>
                    </div>
                    <p className="text-3xl font-black text-[#3200C1]">{total}</p>
                </div>
                <div className="bg-emerald-50 rounded-2xl border border-emerald-200 p-5 shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="w-4 h-4 text-emerald-600" />
                        <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Últimos 7 días</p>
                    </div>
                    <p className="text-3xl font-black text-emerald-700">{last7d}</p>
                </div>
                <div className="bg-blue-50 rounded-2xl border border-blue-200 p-5 shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                        <BarChart3 className="w-4 h-4 text-blue-600" />
                        <p className="text-xs font-bold text-blue-600 uppercase tracking-widest">Desde Listado</p>
                    </div>
                    <p className="text-3xl font-black text-blue-700">{fromCard}</p>
                </div>
                <div className="bg-purple-50 rounded-2xl border border-purple-200 p-5 shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                        <ExternalLink className="w-4 h-4 text-purple-600" />
                        <p className="text-xs font-bold text-purple-600 uppercase tracking-widest">Desde Detalle</p>
                    </div>
                    <p className="text-3xl font-black text-purple-700">{fromDetail}</p>
                </div>
            </div>

            {/* Top Modelos */}
            {topModels.length > 0 && (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
                        <BarChart3 className="w-5 h-5 text-[#3200C1]" />
                        <h3 className="font-bold text-slate-800">Top Modelos por Clics</h3>
                    </div>
                    <ul className="divide-y divide-slate-50">
                        {topModels.map((m, i) => (
                            <li key={m.name + i} className="px-6 py-4 flex items-center gap-4 hover:bg-slate-50 transition-colors">
                                <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${i === 0 ? "bg-amber-400 text-amber-900" :
                                        i === 1 ? "bg-slate-200 text-slate-700" :
                                            i === 2 ? "bg-orange-200 text-orange-700" :
                                                "bg-slate-100 text-slate-500"
                                    }`}>{i + 1}</span>
                                <div className="flex-1 min-w-0">
                                    <p className="font-bold text-slate-800 truncate">{m.name}</p>
                                    {isAdmin && <p className="text-xs text-slate-400 truncate">{m.company}</p>}
                                </div>
                                {/* Barra visual */}
                                <div className="hidden sm:flex items-center gap-2 w-32">
                                    <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-[#37FFDB] rounded-full"
                                            style={{ width: `${Math.round((m.count / (topModels[0]?.count || 1)) * 100)}%` }}
                                        />
                                    </div>
                                </div>
                                <span className="text-sm font-black text-[#3200C1] w-12 text-right shrink-0">
                                    {m.count} {m.count === 1 ? "clic" : "clics"}
                                </span>
                                {m.url && (
                                    <a href={m.url} target="_blank" rel="noopener noreferrer"
                                        className="p-1.5 rounded-lg text-slate-400 hover:text-[#3200C1] hover:bg-[#37FFDB]/20 transition-colors">
                                        <ExternalLink className="w-4 h-4" />
                                    </a>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Top Empresas — solo admin */}
            {isAdmin && topCompanies.length > 0 && (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
                        <Building2 className="w-5 h-5 text-[#3200C1]" />
                        <h3 className="font-bold text-slate-800">Clics por Empresa</h3>
                    </div>
                    <ul className="divide-y divide-slate-50">
                        {topCompanies.map(([name, count]) => (
                            <li key={name} className="px-6 py-3 flex items-center gap-4 hover:bg-slate-50 transition-colors">
                                <div className="flex-1 font-medium text-slate-700 text-sm">{name}</div>
                                <div className="hidden sm:flex items-center gap-2 w-32">
                                    <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-[#3200C1] rounded-full"
                                            style={{ width: `${Math.round((count / (topCompanies[0]?.[1] || 1)) * 100)}%` }}
                                        />
                                    </div>
                                </div>
                                <span className="text-sm font-black text-[#3200C1] w-16 text-right">{count} clics</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Historial de clics */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-[#3200C1]" />
                        <h3 className="font-bold text-slate-800">Historial de Clics Recientes</h3>
                    </div>
                    <span className="text-xs text-slate-400">{Math.min(clicks.length, 200)} registros</span>
                </div>

                {clicks.length === 0 ? (
                    <div className="py-16 text-center text-slate-400">
                        <MousePointerClick className="w-10 h-10 mx-auto mb-3 opacity-30" />
                        <p className="font-medium">Aún no hay clics registrados.</p>
                        <p className="text-xs mt-1">Cuando los visitantes hagan clic en «Ver Publicación», aparecerán aquí.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-slate-500 bg-slate-50 uppercase">
                                <tr>
                                    <th className="px-6 py-3 font-bold">Modelo</th>
                                    {isAdmin && <th className="px-6 py-3 font-bold">Empresa</th>}
                                    <th className="px-6 py-3 font-bold">Origen</th>
                                    <th className="px-6 py-3 font-bold">Fecha</th>
                                    <th className="px-6 py-3 font-bold">Enlace</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {clicks.map((c: any) => (
                                    <tr key={c._id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-3">
                                            <Link href={`/modelo/${c.model_id}`} className="font-bold text-slate-800 hover:text-[#3200C1] transition-colors">
                                                {c.model_name || "—"}
                                            </Link>
                                        </td>
                                        {isAdmin && (
                                            <td className="px-6 py-3 text-xs text-slate-500">{c.company_name || "—"}</td>
                                        )}
                                        <td className="px-6 py-3">
                                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${c.source === "detail"
                                                    ? "bg-purple-100 text-purple-700"
                                                    : "bg-[#37FFDB]/30 text-[#3200C1]"
                                                }`}>
                                                {c.source === "detail" ? "Detalle" : "Listado"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-3 text-xs text-slate-500 whitespace-nowrap">
                                            {c.clicked_at
                                                ? new Date(c.clicked_at).toLocaleDateString("es-CL", {
                                                    day: "2-digit",
                                                    month: "short",
                                                    year: "numeric",
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })
                                                : "—"}
                                        </td>
                                        <td className="px-6 py-3">
                                            {c.target_url ? (
                                                <a
                                                    href={c.target_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1.5 text-[#3200C1] font-bold text-xs hover:underline"
                                                >
                                                    <ExternalLink className="w-3.5 h-3.5" />
                                                    Ver
                                                </a>
                                            ) : (
                                                <span className="text-slate-300 text-xs">—</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
