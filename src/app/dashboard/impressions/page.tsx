import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]/route";
import { sanityClient } from "@/lib/sanity.client";
import { BarChart3, ExternalLink, Calendar, MousePointerClick, TrendingUp, Building2, Mail, Package } from "lucide-react";
import Link from "next/link";

export default async function ImpressionsPage() {
    const session = await getServerSession(authOptions);
    const isAdmin = (session?.user as any)?.role === "admin";
    const companyName = session?.user?.name || "";

    // 1. Obtener datos de la empresa (Plan)
    const companyData = await sanityClient.fetch(
        `*[_type == "companyUser" && company_name == $company][0]{ plan }`,
        { company: companyName },
        { cache: "no-store" }
    );
    const currentPlan = isAdmin ? "elite" : (companyData?.plan || "free");

    // 2. Traer los clics
    const clicksQuery = isAdmin
        ? `*[_type == "propertyClick"] | order(clicked_at desc) [0...500] {
            _id, model_id, model_name, company_name, target_url, source, clicked_at
          }`
        : `*[_type == "propertyClick" && company_name == $company] | order(clicked_at desc) [0...500] {
            _id, model_id, model_name, company_name, target_url, source, clicked_at
          }`;

    // 3. Traer las vistas (Solo si es Pro o superior)
    const viewsQuery = isAdmin
        ? `*[_type == "modelView"] | order(viewed_at desc) [0...1000]`
        : `*[_type == "modelView" && company_name == $company] | order(viewed_at desc) [0...1000]`;

    // 4. Traer leads
    const leadsQuery = isAdmin
        ? `*[_type == "lead"] | order(_createdAt desc)`
        : `*[_type == "lead" && company_name == $company] | order(_createdAt desc)`;

    const [clicks, views, leads] = await Promise.all([
        sanityClient.fetch(clicksQuery, { company: companyName }, { cache: "no-store" }),
        sanityClient.fetch(viewsQuery, { company: companyName }, { cache: "no-store" }),
        sanityClient.fetch(leadsQuery, { company: companyName }, { cache: "no-store" }),
    ]);

    // ── Métricas rápidas ────────────────────────────────────────
    const totalClicks = clicks.length;
    const totalViews = views.length;
    const totalLeads = leads.length;

    // CTR estimado (Clicks / Views)
    const ctr = totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(1) : "0";

    // Clics por origen
    const fromCard = clicks.filter((c: any) => c.source === "card").length;
    const fromDetail = clicks.filter((c: any) => c.source === "detail").length;
    const fromWA = clicks.filter((c: any) => c.source === "whatsapp").length;

    // Top modelos (Combinando vistas y clics)
    const modelStats: Record<string, { name: string; views: number; clicks: number; leads: number }> = {};
    
    views.forEach((v: any) => {
        const id = v.model_id || "desconocido";
        if (!modelStats[id]) modelStats[id] = { name: v.model_name, views: 0, clicks: 0, leads: 0 };
        modelStats[id].views++;
    });
    clicks.forEach((c: any) => {
        const id = c.model_id || "desconocido";
        if (!modelStats[id]) modelStats[id] = { name: c.model_name, views: 0, clicks: 0, leads: 0 };
        modelStats[id].clicks++;
    });
    leads.forEach((l: any) => {
        const id = l.model_id || "desconocido";
        if (!modelStats[id]) modelStats[id] = { name: l.model_name, views: 0, clicks: 0, leads: 0 };
        modelStats[id].leads++;
    });

    const topModels = Object.values(modelStats).sort((a, b) => b.views - a.views).slice(0, 10);

    // Top empresas (Admin)
    const companyCounts: Record<string, number> = {};
    if (isAdmin) {
        clicks.forEach((c: any) => {
            if (c.company_name) {
                companyCounts[c.company_name] = (companyCounts[c.company_name] || 0) + 1;
            }
        });
    }
    const topCompanies = Object.entries(companyCounts).sort((a, b) => b[1] - a[1]).slice(0, 8);

    return (
        <div className="space-y-8">
            {/* Header / Upgrade Callout */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2">
                        <BarChart3 className="w-6 h-6 text-[#3200C1]" /> 
                        Centro de Estadísticas
                    </h2>
                    <p className="text-sm text-slate-400 mt-1 uppercase tracking-tighter font-bold">
                        Plan Actual: <span className="text-[#3200C1]">{currentPlan.toUpperCase()}</span>
                    </p>
                </div>
                {currentPlan === "free" && (
                    <Link href="/dashboard/settings" className="px-4 py-2 bg-amber-100 text-amber-700 rounded-xl text-xs font-black hover:bg-amber-200 transition-colors">
                        ⭐ MEJORAR A PRO PARA MÁS MÉTRICAS
                    </Link>
                )}
                {currentPlan === "elite" && (
                    <button className="px-5 py-2.5 bg-slate-800 text-white rounded-xl text-xs font-black flex items-center gap-2 hover:bg-slate-700 transition-all">
                        <Package className="w-4 h-4 text-[#37FFDB]" /> EXPORTAR CSV (ELITE)
                    </button>
                )}
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                            <MousePointerClick className="w-4 h-4 text-blue-600" />
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Clics Totales</p>
                    </div>
                    <p className="text-3xl font-black text-slate-800">{totalClicks}</p>
                    <p className="text-xs text-slate-400 mt-1">Interés en contacto</p>
                </div>

                <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">
                            <TrendingUp className="w-4 h-4 text-purple-600" />
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Vistas Totales</p>
                    </div>
                    <p className="text-3xl font-black text-slate-800">
                        {currentPlan === "free" ? "—" : totalViews}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                        {currentPlan === "free" ? "Solo disponible en PRO" : "Visualizaciones fichas"}
                    </p>
                </div>

                <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                            <Mail className="w-4 h-4 text-emerald-600" />
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Leads Totales</p>
                    </div>
                    <p className="text-3xl font-black text-slate-800">{totalLeads}</p>
                    <p className="text-xs text-slate-400 mt-1">Consultas recibidas</p>
                </div>

                <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
                            <TrendingUp className="w-4 h-4 text-amber-600" />
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">CTR (Rendimiento)</p>
                    </div>
                    <p className="text-3xl font-black text-slate-800">
                        {currentPlan === "free" ? "—" : `${ctr}%`}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                        {currentPlan === "free" ? "Solo en PRO/Elite" : "Conversión Clic/Vista"}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Tabla Top Modelos */}
                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                        <h3 className="font-black text-slate-800 flex items-center gap-2">
                            <Package className="w-5 h-5 text-[#3200C1]" /> Ranking de Modelos
                        </h3>
                    </div>
                    {topModels.length === 0 ? (
                        <div className="p-12 text-center text-slate-300 italic text-sm">Aún no hay datos suficientes.</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-slate-50 text-slate-400 text-[10px] uppercase font-black tracking-widest">
                                    <tr>
                                        <th className="px-6 py-4 text-left">Modelo</th>
                                        <th className="px-6 py-4 text-center">Vistas</th>
                                        <th className="px-6 py-4 text-center">Clics</th>
                                        <th className="px-6 py-4 text-center">Leads</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {topModels.map((m: any, i) => (
                                        <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                                            <td className="px-6 py-4 font-bold text-slate-700 truncate max-w-[200px]">{m.name || "Sin nombre"}</td>
                                            <td className="px-6 py-4 text-center text-slate-500 font-medium">{currentPlan === 'free' ? '—' : m.views}</td>
                                            <td className="px-6 py-4 text-center text-[#3200C1] font-black">{m.clicks}</td>
                                            <td className="px-6 py-4 text-center">
                                                <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded-lg font-black text-[10px]">
                                                    {m.leads}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Resumen de Origen / WhatsApp Clics */}
                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
                    <h3 className="font-black text-slate-800 mb-6 flex items-center gap-2">
                        <MousePointerClick className="w-5 h-5 text-[#3200C1]" /> Canales de Interés
                    </h3>
                    <div className="space-y-6">
                        <div>
                            <div className="flex justify-between items-end mb-2">
                                <span className="text-sm font-bold text-slate-600">Botón WhatsApp</span>
                                <span className="text-sm font-black text-[#25D366]">{fromWA}</span>
                            </div>
                            <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-[#25D366]" style={{ width: `${totalClicks > 0 ? (fromWA / totalClicks) * 100 : 0}%` }}></div>
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between items-end mb-2">
                                <span className="text-sm font-bold text-slate-600">Ver Publicación Original</span>
                                <span className="text-sm font-black text-blue-600">{fromCard + fromDetail}</span>
                            </div>
                            <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-500" style={{ width: `${totalClicks > 0 ? ((fromCard + fromDetail) / totalClicks) * 100 : 0}%` }}></div>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-slate-100">
                            <div className="bg-[#3200C1]/5 rounded-2xl p-4 flex items-start gap-3">
                                <div className="p-2 bg-[#3200C1] rounded-lg text-white">
                                    <TrendingUp className="w-4 h-4" />
                                </div>
                                <div>
                                    <p className="text-xs font-black text-[#3200C1] uppercase">Análisis de rendimiento</p>
                                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                                        {ctr > "5" ? "¡Excelente! Tu tasa de clics es alta. Significa que tus modelos son muy atractivos." : "Consejo: Mejora las descripciones o baja levemente el precio para aumentar el CTR."}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Administrador Global */}
            {isAdmin && topCompanies.length > 0 && (
                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden mt-10">
                    <div className="px-8 py-6 border-b border-slate-100 bg-[#3200C1] text-white">
                        <h3 className="font-black flex items-center gap-2">
                            <Building2 className="w-5 h-5 text-[#37FFDB]" /> Control Global de Empresas (Admin)
                        </h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 divide-x divide-y divide-slate-100">
                        {topCompanies.map(([name, count]) => (
                            <div key={name} className="p-6 hover:bg-slate-50 transition-colors">
                                <p className="text-[10px] font-black text-slate-400 uppercase mb-1">{name}</p>
                                <p className="text-xl font-black text-[#3200C1]">{count as number} <span className="text-xs font-normal text-slate-400">clics</span></p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
