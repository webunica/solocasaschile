import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { sanityClient } from "@/lib/sanity.client";
import { Mail, Phone, Calendar, Building2, Home } from "lucide-react";

const STATUS_STYLES: Record<string, string> = {
    new: "bg-yellow-100 text-yellow-700 border-yellow-200",
    contacted: "bg-blue-100 text-blue-700 border-blue-200",
    closed: "bg-green-100 text-green-700 border-green-200",
    discarded: "bg-slate-100 text-slate-500 border-slate-200",
};
const STATUS_LABELS: Record<string, string> = {
    new: "🟡 Nuevo",
    contacted: "🔵 En Contacto",
    closed: "✅ Cerrado",
    discarded: "❌ Descartado",
};

export default async function LeadsDashboardPage() {
    const session = await getServerSession(authOptions);
    const isAdmin = (session?.user as any)?.role === "admin";
    const companyName = session?.user?.name || "";

    // Admin ve TODOS los leads. Empresa solo ve los suyos.
    const query = isAdmin
        ? `*[_type == "lead"] | order(_createdAt desc) { _id, name, email, phone, message, model_name, company_name, status, _createdAt }`
        : `*[_type == "lead" && company_name == $company] | order(_createdAt desc) { _id, name, email, phone, message, model_name, company_name, status, _createdAt }`;

    const leads = await sanityClient.fetch(query, { company: companyName }, { cache: "no-store" });

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between">
                    <div>
                        <h3 className="font-bold text-slate-800">Mensajes de Contacto Recibidos</h3>
                        <p className="text-xs text-slate-400 mt-0.5">{leads.length} solicitudes registradas</p>
                    </div>
                    <span className="text-xs font-bold px-3 py-1.5 bg-[#37FFDB]/20 text-[#3200C1] rounded-full">
                        {isAdmin ? "Vista Global" : companyName}
                    </span>
                </div>

                {leads.length === 0 ? (
                    <div className="py-16 text-center text-slate-400">
                        <Mail className="w-10 h-10 mx-auto mb-3 opacity-30" />
                        <p className="font-medium">Aún no hay mensajes de contacto recibidos.</p>
                        <p className="text-xs mt-1">Aquí aparecerán los leads cuando los visitantes contacten tu propiedad.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-100">
                        {leads.map((lead: any) => (
                            <div key={lead._id} className="px-6 py-5 hover:bg-slate-50 transition-colors">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1 space-y-2">
                                        {/* Cabecera del Lead */}
                                        <div className="flex items-center gap-3 flex-wrap">
                                            <span className="font-black text-slate-800 text-base">{lead.name}</span>
                                            <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${STATUS_STYLES[lead.status] || STATUS_STYLES.new}`}>
                                                {STATUS_LABELS[lead.status] || "🟡 Nuevo"}
                                            </span>
                                        </div>

                                        {/* Contacto */}
                                        <div className="flex items-center gap-4 text-xs text-slate-500 flex-wrap">
                                            <a href={`mailto:${lead.email}`} className="flex items-center gap-1.5 hover:text-[#3200C1] transition-colors font-medium">
                                                <Mail className="w-3.5 h-3.5" />
                                                {lead.email}
                                            </a>
                                            {lead.phone && (
                                                <span className="flex items-center gap-1.5 font-medium">
                                                    <Phone className="w-3.5 h-3.5" />
                                                    {lead.phone}
                                                </span>
                                            )}
                                            <span className="flex items-center gap-1.5">
                                                <Calendar className="w-3.5 h-3.5" />
                                                {new Date(lead._createdAt).toLocaleDateString("es-CL", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                                            </span>
                                        </div>

                                        {/* Modelo y Empresa */}
                                        <div className="flex items-center gap-3 text-xs text-slate-400 flex-wrap">
                                            <span className="flex items-center gap-1.5">
                                                <Home className="w-3.5 h-3.5 text-[#37FFDB]" />
                                                <strong className="text-slate-600">{lead.model_name || "—"}</strong>
                                            </span>
                                            {isAdmin && lead.company_name && (
                                                <span className="flex items-center gap-1.5">
                                                    <Building2 className="w-3.5 h-3.5 text-[#37FFDB]" />
                                                    <strong className="text-slate-600">{lead.company_name}</strong>
                                                </span>
                                            )}
                                        </div>

                                        {/* Mensaje */}
                                        {lead.message && (
                                            <blockquote className="mt-2 pl-3 border-l-2 border-[#37FFDB] text-sm text-slate-500 italic leading-relaxed">
                                                {lead.message}
                                            </blockquote>
                                        )}
                                    </div>

                                    {/* Acción rápida: Responder por email */}
                                    <a
                                        href={`mailto:${lead.email}?subject=Re: Tu consulta por ${lead.model_name} en solocasaschile.com`}
                                        className="shrink-0 px-4 py-2 border border-[#3200C1] text-[#3200C1] font-bold text-xs rounded-xl hover:bg-[#3200C1] hover:text-white transition-all"
                                    >
                                        Responder
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <p className="text-xs text-slate-400 text-center">
                Para cambiar el estado de un lead (Nuevo → En Contacto → Cerrado), edítalo directamente en{" "}
                <a href="/studio" className="text-[#3200C1] font-bold hover:underline" target="_blank">Sanity Studio</a>.
            </p>
        </div>
    );
}
