import { sanityClient } from "@/lib/sanity.client";
import { Edit, Eye } from "lucide-react";
import Link from "next/link";
import { DeleteButton } from "./components/DeleteButton";

import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";

export default async function DashboardPage() {
    const session = await getServerSession(authOptions);
    const CURRENT_COMPANY = session?.user?.name || "";
    const isAdmin = (session?.user as any)?.role === "admin";

    // Si es super-admin ve todas las casas, si no solo ve las de su empresa
    const groqQuery = isAdmin
        ? `*[_type == "houseModel"] | order(_updatedAt desc) {
            _id,
            company_name,
            model_name,
            category,
            surface_m2,
            price_from,
            "imageUrl": coalesce(images[0].asset->url, image_urls[0]),
            _updatedAt
        }`
        : `*[_type == "houseModel" && company_name == $company] | order(_updatedAt desc) {
            _id,
            model_name,
            category,
            surface_m2,
            price_from,
            "imageUrl": coalesce(images[0].asset->url, image_urls[0]),
            _updatedAt
        }`;

    // Forzar lectura dinámica o revalida frecuente considerando que es dashboard de usuario administrador local
    const models = await sanityClient.fetch(groqQuery, { company: CURRENT_COMPANY }, {
        cache: "no-store",
    });

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                    <h3 className="font-bold text-slate-800">Catálogo Publicado ({models.length})</h3>
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
                                <th className="px-6 py-4 font-bold text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {models.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500 italic">
                                        Ni tú ni tu empresa tienen modelos publicados actualmente en solocasaschile.com.
                                        ¡Añade tu primero!
                                    </td>
                                </tr>
                            ) : models.map((model: any) => (
                                <tr key={model._id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 flex items-center gap-4">
                                        {model.imageUrl ? (
                                            <div className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden shrink-0">
                                                <img src={model.imageUrl} alt={model.model_name} className="w-full h-full object-cover" />
                                            </div>
                                        ) : (
                                            <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                                                <span className="text-xs text-slate-400 text-center">Sin<br />foto</span>
                                            </div>
                                        )}
                                        <div className="font-bold text-slate-800 max-w-[200px] truncate">{model.model_name}</div>
                                    </td>
                                    {isAdmin && (
                                        <td className="px-6 py-4 font-medium text-slate-600 text-xs">
                                            {model.company_name}
                                        </td>
                                    )}
                                    <td className="px-6 py-4">
                                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#37FFDB] text-[#3200C1]">
                                            {model.category || "General"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 font-medium text-slate-600">
                                        {model.surface_m2 ? `${model.surface_m2} m²` : "-"}
                                    </td>
                                    <td className="px-6 py-4 font-bold text-slate-800">
                                        ${model.price_from ? model.price_from.toLocaleString('es-CL') : "0"}
                                    </td>
                                    <td className="px-6 py-4 flex items-center justify-end gap-2">
                                        <Link href={`/?search=${model.model_name}`} target="_blank" className="p-2 text-slate-400 hover:text-[#3200C1] hover:bg-[#37FFDB]/20 rounded-lg transition-colors" title="Ver en el portal (Filtro Búsqueda)">
                                            <Eye className="w-4 h-4" />
                                        </Link>
                                        <Link href={`/dashboard/edit/${model._id}`} className="p-2 text-slate-400 hover:text-amber-500 hover:bg-amber-50 rounded-lg transition-colors" title="Editar Propiedad">
                                            <Edit className="w-4 h-4" />
                                        </Link>
                                        <DeleteButton id={model._id} name={model.model_name} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="bg-[#37FFDB]/10 border border-[#37FFDB]/20 rounded-2xl p-6 text-[#3200C1]">
                <h4 className="font-black text-lg mb-2">💡 Tips de Venta en la Plataforma</h4>
                <p className="text-sm opacity-90">Los modelos detallados con fotos reales, ficha técnica y precios transparentes tienen un **73% más de intenciones de contacto verificadas** por los visitantes de solocasaschile.com.</p>
            </div>
        </div>
    );
}
