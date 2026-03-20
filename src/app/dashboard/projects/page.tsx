import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { sanityClient, urlFor } from "@/lib/sanity.client";
import { MapPin, Plus, Image as ImageIcon, Calendar, Building2, ExternalLink } from "lucide-react";
import DeleteProjectButton from "./components/DeleteProjectButton";
import Link from "next/link";
import Image from "next/image";

export default async function ProjectsDashboardPage() {
    const session = await getServerSession(authOptions);
    if (!session) redirect("/login");

    const isAdmin = (session?.user as any)?.role === "admin";
    const companyName = session?.user?.name || "";

    // 1. Fetch Company ID if not admin
    let companyId = "";
    if (!isAdmin) {
        const company = await sanityClient.fetch(
            `*[_type == "companyUser" && company_name == $name][0]{ _id }`,
            { name: companyName }
        );
        companyId = company?._id;
    }

    // 2. Fetch Projects
    const query = isAdmin
        ? `*[_type == "project"] | order(_createdAt desc) { _id, title, location_name, images, completion_date, "companyName": company->company_name }`
        : `*[_type == "project" && company._ref == $companyId] | order(_createdAt desc) { _id, title, location_name, images, completion_date }`;

    const projects = await sanityClient.fetch(query, { companyId }, { cache: "no-store" });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Obras Realizadas</h1>
                    <p className="text-xs text-slate-400 mt-1">Gestiona las fotos y ubicaciones de tus proyectos entregados.</p>
                </div>
                <Link 
                    href="/dashboard/projects/create" 
                    className="px-6 py-3 bg-[#3200C1] text-white rounded-xl font-bold flex items-center gap-2 hover:bg-[#250091] transition-all shadow-lg shadow-[#3200C1]/20"
                >
                    <Plus className="w-4 h-4" /> Nuevo Proyecto
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.length === 0 ? (
                    <div className="col-span-full py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400">
                        <MapPin className="w-12 h-12 mb-4 opacity-20" />
                        <p className="font-bold text-slate-500 text-lg uppercase">Aún no tienes obras registradas</p>
                        <p className="text-sm mt-1 max-w-xs text-center leading-relaxed">
                            Agrega tus proyectos terminados para que aparezcan en tu perfil público y en el mapa de instalaciones.
                        </p>
                        <Link 
                            href="/dashboard/projects/create" 
                            className="mt-6 px-4 py-2 text-[#3200C1] font-black text-xs uppercase hover:underline"
                        >
                            Ir al Gestor de Proyectos
                        </Link>
                    </div>
                ) : (
                    projects.map((proj: any) => (
                        <div key={proj._id} className="group bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm transition-all hover:shadow-xl flex flex-col">
                            <div className="relative aspect-video bg-slate-100">
                                {proj.images?.[0] ? (
                                    <Image 
                                        src={urlFor(proj.images[0]).url()} 
                                        alt={proj.title}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center text-slate-300">
                                        <ImageIcon className="w-8 h-8 opacity-20" />
                                    </div>
                                )}
                                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] font-black text-[#3200C1] border border-white/50 shadow-sm uppercase tracking-tighter">
                                    {proj.location_name || "Ubicación N/A"}
                                </div>
                            </div>
                            
                            <div className="p-6 flex-1 flex flex-col">
                                {isAdmin && (
                                    <p className="text-[10px] font-black text-[#37FFDB] uppercase tracking-[0.2em] mb-1">{proj.companyName}</p>
                                )}
                                <h3 className="font-black text-slate-800 text-lg mb-4 line-clamp-1">{proj.title}</h3>
                                
                                <div className="mt-auto space-y-4 pt-4 border-t border-slate-100 italic text-[10px] text-slate-400 font-medium">
                                    {proj.completion_date && (
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-3.5 h-3.5" />
                                            Entregado el {new Date(proj.completion_date).toLocaleDateString("es-CL")}
                                        </div>
                                    )}
                                </div>

                                <div className="flex gap-2 pt-6">
                                    <DeleteProjectButton id={proj._id} />
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-3xl p-8 flex items-start gap-6">
                <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                    <ImageIcon className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                    <h4 className="font-black text-amber-900 uppercase text-sm tracking-tight">Consejo de Ventas</h4>
                    <p className="text-sm text-amber-800 mt-2 leading-relaxed opacity-80">
                        Las empresas que muestran **fotos reales** de sus instalaciones tienen un 40% más de tasa de contacto que las que solo muestran modelos digitales. Asegúrate de incluir la ubicación exacta para habilitar el **Mapa de Autoridad** en tu perfil.
                    </p>
                </div>
            </div>
        </div>
    );
}
