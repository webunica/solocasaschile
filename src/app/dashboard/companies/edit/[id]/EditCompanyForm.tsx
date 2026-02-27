"use client";

import { useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Building2, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { editCompanyAction } from "../../edit-company-actions";

export default function EditCompanyForm({ companyUser }: { companyUser: any }) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        startTransition(async () => {
            const result = await editCompanyAction(companyUser._id, formData);
            if (result.error) {
                alert(result.error);
            } else {
                router.push("/dashboard/companies");
            }
        });
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/dashboard/companies" className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-[#3200C1] hover:bg-slate-50 transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div className="flex-1">
                    <h2 className="text-2xl font-black text-slate-800">Editando Empresa:</h2>
                    <p className="text-[#3200C1] font-bold">{companyUser.company_name}</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-white border text-sm border-slate-200 rounded-2xl shadow-sm p-8 space-y-8">

                <section>
                    <h3 className="text-lg font-bold text-[#3200C1] mb-6">Credenciales de Acceso</h3>
                    <div className="space-y-6">
                        <div>
                            <label className="block text-slate-700 font-bold mb-2">Nombre Oficial Constructora</label>
                            <input required defaultValue={companyUser.company_name} name="company_name" type="text" className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-[#3200C1] focus:outline-none bg-slate-50 focus:bg-white" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-slate-700 font-bold mb-2">Correo de Ingreso (Email)</label>
                                <input required defaultValue={companyUser.email} name="email" type="email" className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-[#3200C1] focus:outline-none bg-slate-50 focus:bg-white" />
                            </div>
                            <div>
                                <label className="block text-slate-700 font-bold mb-2">Rol dentro de la Plataforma</label>
                                <select defaultValue={companyUser.role || "company"} name="role" className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-[#3200C1] focus:outline-none bg-slate-50 focus:bg-white">
                                    <option value="company">Constructora (Normal)</option>
                                    <option value="admin">Administrador Maestro</option>
                                </select>
                            </div>
                        </div>

                        <div className="p-6 bg-amber-50 rounded-xl border border-amber-200">
                            <label className="block text-amber-900 font-bold mb-2">Forzar Nueva Contraseña</label>
                            <p className="text-xs text-amber-700 mb-4">Si el usuario olvidó su contraseña, escribe una nueva aquí. Si la dejas en blanco, la contraseña original **se mantendrá intacta**.</p>

                            <div className="relative">
                                <input minLength={6} name="new_password" type={showPassword ? "text" : "password"} placeholder="Nueva contraseña secreta..." className="w-full pl-4 pr-12 py-3 border border-amber-200 rounded-xl focus:border-amber-500 focus:outline-none bg-white" />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-amber-600">
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                <hr className="border-slate-100" />

                {/* ─── Sección Plan ─────────────────────────────────── */}
                <section>
                    <h3 className="text-lg font-bold text-[#3200C1] mb-1">Plan de Suscripción</h3>
                    <p className="text-xs text-slate-400 mb-5">El plan define los límites y beneficios de la empresa en el portal.</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {[
                            { value: "starter", emoji: "🟢", label: "Plan Starter", uf: "3 UF", clp: "$119.340/mes", desc: "Hasta 5 modelos, visibilidad estándar." },
                            { value: "builder", emoji: "🔵", label: "Plan Crecer", uf: "6 UF", clp: "$238.680/mes", desc: "Catálogo ilimitado + prioridad + leads calificados." },
                            { value: "constructor", emoji: "🟣", label: "Plan Destacado", uf: "14 UF", clp: "$556.920/mes", desc: "Todo Crecer + banners + Blog exclusivo." },
                        ].map((plan) => (
                            <label key={plan.value} className="relative cursor-pointer">
                                <input
                                    type="radio"
                                    name="plan"
                                    value={plan.value}
                                    defaultChecked={(companyUser.plan || "starter") === plan.value}
                                    className="sr-only peer"
                                />
                                <div className="p-4 border-2 border-slate-200 rounded-xl peer-checked:border-[#3200C1] peer-checked:bg-[#3200C1]/5 transition-all hover:border-slate-300 h-full">
                                    <p className="font-black text-slate-800 mb-1">{plan.emoji} {plan.label}</p>
                                    <p className="text-lg font-black text-[#3200C1]">{plan.uf}</p>
                                    <p className="text-xs text-slate-400 font-medium">{plan.clp}</p>
                                    <p className="text-xs text-slate-500 mt-2 leading-relaxed">{plan.desc}</p>
                                </div>
                            </label>
                        ))}
                    </div>
                </section>

                <hr className="border-slate-100" />


                <section>
                    <h3 className="text-lg font-bold text-[#3200C1] mb-6">Identidad Visual</h3>
                    <div className="flex items-center gap-6">
                        <div className="w-24 h-24 rounded-2xl bg-slate-100 flex items-center justify-center shadow-sm border border-slate-200 overflow-hidden shrink-0">
                            {companyUser.logo_url ? (
                                <div className="w-full h-full">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={companyUser.logo_url} alt="Logo" className="w-full h-full object-cover" />
                                </div>
                            ) : (
                                <Building2 className="w-8 h-8 text-slate-300" />
                            )}
                        </div>
                        <div className="flex-1">
                            <label className="block text-slate-700 font-bold mb-2">Reemplazar Logotipo</label>
                            <input name="logo" type="file" accept="image/*" className="w-full text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#3200C1] file:text-white hover:file:bg-[#3200C1]/90 cursor-pointer" />
                            <p className="text-xs text-slate-400 mt-2">Formatos aceptados: JPG, PNG, WEBP. Se mostrará en sus modelos.</p>
                        </div>
                    </div>
                </section>

                <div className="pt-6 border-t border-slate-100 flex justify-end gap-4">
                    <button disabled={isPending} type="submit" className={`px-8 py-4 bg-[#3200C1] text-[#37FFDB] font-black rounded-xl flex items-center gap-2 hover:bg-[#3200C1]/90 transition-all shadow-md active:scale-95 ${isPending ? 'opacity-50 cursor-not-allowed' : ''}`}>
                        {isPending ? 'Actualizando B2B...' : <><Save className="w-5 h-5" /> Guardar Cambios</>}
                    </button>
                </div>
            </form>
        </div>
    );
}
