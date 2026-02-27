import { sanityClient } from "@/lib/sanity.client";
import { Edit, Eye } from "lucide-react";
import Link from "next/link";
import { DeleteButton } from "./components/DeleteButton";
import { ToggleModelButton } from "./components/ToggleModelButton";

import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";

export default async function DashboardPage() {
    const session = await getServerSession(authOptions);
    const CURRENT_COMPANY = session?.user?.name || "";
    const isAdmin = (session?.user as any)?.role === "admin";

    const groqQuery = isAdmin
        ? `*[_type == "houseModel"] | order(_updatedAt desc) {
            _id,
            company_name,
            model_name,
            category,
            surface_m2,
            price_from,
            is_active,
            "imageUrl": coalesce(images[0].asset->url, image_urls[0]),
            _updatedAt
        }`
        : `*[_type == "houseModel" && company_name == $company] | order(_updatedAt desc) {
            _id,
            model_name,
            category,
            surface_m2,
            price_from,
            is_active,
            "imageUrl": coalesce(images[0].asset->url, image_urls[0]),
            _updatedAt
        }`;

    const models = await sanityClient.fetch(groqQuery, { company: CURRENT_COMPANY }, {
        cache: "no-store",
    });

    const totalActive = models.filter((m: any) => m.is_active !== false).length;
    const totalInactive = models.filter((m: any) => m.is_active === false).length;

    return (
        <div className="space-y-6">
            {/* Métricas rápidas */}
            {models.length > 0 && (
                <div className="grid grid-cols-3 gap-4">
                    <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total Modelos</p>
                        <p className="text-3xl font-black text-[#3200C1]">{models.length}</p>
                    </div>
                    <div className="bg-emerald-50 rounded-2xl border border-emerald-200 p-4 shadow-sm">
                        <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-1">🟢 Activos</p>
                        <p className="text-3xl font-black text-emerald-700">{totalActive}</p>
                    </div>
                    <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 shadow-sm">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">⚪ Inactivos</p>
                        <p className="text-3xl font-black text-slate-500">{totalInactive}</p>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                    <h3 className="font-bold text-slate-800">
                        Catálogo Publicado ({models.length})
                    </h3>
                    <p className="text-xs text-slate-400">
                        Solo los modelos <span className="font-bold text-emerald-600">Activos</span> son visibles en el comparador público
                    </p>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-slate-500 bg-slate-50 uppercase">
                            <tr>
                                <th className="px-6 py-4 font-bold">Modelo</th>
                                {isAdmin && <th className="px-6 py-4 font-bold">Empresa</th>}
                                <th className="px-6 py-4 font-bold">Categoría</th>
                                <th className="px-6 py-4 font-bold">Superficie</th>
                                <th className="px-6 py-4 font-bold">Precio Desde</th>
                                <th className="px-6 py-4 font-bold text-center">Visible</th>
                                <th className="px-6 py-4 font-bold text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {models.length === 0 ? (
                                <tr>
                                    <td colSpan={isAdmin ? 7 : 6} className="px-6 py-8 text-center text-slate-500 italic">
                                        No hay modelos publicados. ¡Añade el primero!
                                    </td>
                                </tr>
                            ) : models.map((model: any) => {
                                const active = model.is_active !== false; // undefined o true = activo
                                return (
                                    <tr
                                        key={model._id}
                                        className={`transition-colors ${active ? "hover:bg-slate-50" : "bg-slate-50/60 opacity-60 hover:opacity-80"}`}
                                    >
                                        {/* Imagen + Nombre */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                {model.imageUrl ? (
                                                    <div className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden shrink-0">
                                                        <img src={model.imageUrl} alt={model.model_name} className="w-full h-full object-cover" />
                                                    </div>
                                                ) : (
                                                    <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 text-slate-300 text-xs text-center">Sin<br />foto</div>
                                                )}
                                                <span className="font-bold text-slate-800 max-w-[180px] truncate">{model.model_name}</span>
                                            </div>
                                        </td>

                                        {isAdmin && (
                                            <td className="px-6 py-4 text-xs font-medium text-slate-600">{model.company_name}</td>
                                        )}

                                        <td className="px-6 py-4">
                                            <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#37FFDB] text-[#3200C1]">
                                                {model.category || "General"}
                                            </span>
                                        </td>

                                        <td className="px-6 py-4 font-medium text-slate-600">
                                            {model.surface_m2 ? `${model.surface_m2} m²` : "—"}
                                        </td>

                                        <td className="px-6 py-4 font-bold text-slate-800">
                                            ${model.price_from ? model.price_from.toLocaleString("es-CL") : "0"}
                                        </td>

                                        {/* Toggle Activo/Inactivo */}
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col items-center gap-1">
                                                <ToggleModelButton id={model._id} isActive={active} />
                                                <span className={`text-[10px] font-bold ${active ? "text-emerald-600" : "text-slate-400"}`}>
                                                    {active ? "Activo" : "Inactivo"}
                                                </span>
                                            </div>
                                        </td>

                                        {/* Acciones */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-1">
                                                <Link
                                                    href={`/?search=${model.model_name}`}
                                                    target="_blank"
                                                    className="p-2 text-slate-400 hover:text-[#3200C1] hover:bg-[#37FFDB]/20 rounded-lg transition-colors"
                                                    title="Ver en el portal"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </Link>
                                                <Link
                                                    href={`/dashboard/edit/${model._id}`}
                                                    className="p-2 text-slate-400 hover:text-amber-500 hover:bg-amber-50 rounded-lg transition-colors"
                                                    title="Editar Propiedad"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </Link>
                                                <DeleteButton id={model._id} name={model.model_name} />
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="bg-[#37FFDB]/10 border border-[#37FFDB]/20 rounded-2xl p-6 text-[#3200C1]">
                <h4 className="font-black text-lg mb-2">💡 Tips de Venta en la Plataforma</h4>
                <p className="text-sm opacity-90">Los modelos detallados con fotos reales, ficha técnica y precios transparentes tienen un <strong>73% más</strong> de intenciones de contacto verificadas por los visitantes de solocasaschile.com.</p>
            </div>
        </div>
    );
}
