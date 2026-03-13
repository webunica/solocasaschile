import { sanityClient } from "@/lib/sanity.client";
import { Plus, Edit2, Trash2 } from "lucide-react";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

// Forzar dinámico para que se refresque
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function DashboardBlogPage() {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "admin") {
        redirect("/dashboard");
    }

    const posts = await sanityClient.fetch(`*[_type == "blogPost"] | order(publishedAt desc){
        _id,
        title,
        "slug": slug.current,
        publishedAt,
        category,
        "coverImage": coverImage.asset->url
    }`);

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-[#3200C1]">Publicaciones (Blog)</h1>
                    <p className="text-slate-500 mt-2">Gestiona los artículos de la plataforma y su SEO.</p>
                </div>
                <Link
                    href="/dashboard/blog/create"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#3200C1] text-[#37FFDB] font-bold rounded-xl hover:brightness-110 transition-all shadow-md"
                >
                    <Plus className="w-5 h-5" />
                    Crear Publicación
                </Link>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="p-4 font-bold text-slate-500 text-sm">Imagen</th>
                                <th className="p-4 font-bold text-slate-500 text-sm">Título</th>
                                <th className="p-4 font-bold text-slate-500 text-sm">Categoría</th>
                                <th className="p-4 font-bold text-slate-500 text-sm">Fecha</th>
                                <th className="p-4 font-bold text-slate-500 text-sm text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {posts.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-slate-500">
                                        No hay publicaciones creadas.
                                    </td>
                                </tr>
                            ) : (
                                posts.map((post: any) => (
                                    <tr key={post._id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
                                        <td className="p-4">
                                            {post.coverImage ? (
                                                <img src={post.coverImage} className="w-16 h-12 object-cover rounded-lg" alt={post.title} />
                                            ) : (
                                                <div className="w-16 h-12 bg-slate-200 rounded-lg flex items-center justify-center text-xs text-slate-400">Sin img</div>
                                            )}
                                        </td>
                                        <td className="p-4">
                                            <p className="font-bold text-[#3200C1]">{post.title}</p>
                                            <p className="text-xs text-slate-400">/{post.slug}</p>
                                        </td>
                                        <td className="p-4 text-sm font-medium text-slate-600">
                                            {post.category || <span className="text-slate-400 italic">Ninguna</span>}
                                        </td>
                                        <td className="p-4 text-sm text-slate-500">
                                            {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString("es-CL") : "-"}
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={`/dashboard/blog/edit/${post._id}`}
                                                    className="p-2 text-slate-400 hover:text-[#3200C1] hover:bg-[#3200C1]/10 rounded-lg transition-colors"
                                                    title="Editar"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </Link>
                                                {/* <button
                                                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Eliminar"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button> */}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
