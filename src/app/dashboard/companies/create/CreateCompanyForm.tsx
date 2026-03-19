"use client";

import { useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Eye, EyeOff, Building2, CheckCircle } from "lucide-react";
import Link from "next/link";
import { createCompanyAction } from "./create-company-action";

export default function CreateCompanyForm({ initialName }: { initialName?: string }) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [showPass, setShowPass] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        const formData = new FormData(e.currentTarget);

        startTransition(async () => {
            const result = await createCompanyAction(formData);
            if (result.error) {
                setError(result.error);
            } else {
                setSuccess(true);
                setTimeout(() => router.push("/dashboard/companies"), 1800);
            }
        });
    };

    if (success) {
        return (
            <div className="max-w-2xl mx-auto">
                <div className="bg-white border border-emerald-200 rounded-2xl shadow-sm p-12 flex flex-col items-center gap-4 text-center">
                    <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
                        <CheckCircle className="w-8 h-8 text-emerald-500" />
                    </div>
                    <h3 className="text-2xl font-black text-slate-800">¡Cuenta creada!</h3>
                    <p className="text-slate-500">Redirigiendo a la lista de empresas…</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/dashboard/companies" className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-[#3200C1] hover:bg-slate-50 transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                    <h2 className="text-2xl font-black text-slate-800">Nueva Cuenta B2B</h2>
                    <p className="text-[#3200C1] font-bold text-sm">Crear acceso al portal para una constructora</p>
                </div>
            </div>

            {/* Error */}
            {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm font-semibold">
                    ⚠️ {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="bg-white border text-sm border-slate-200 rounded-2xl shadow-sm p-8 space-y-8">

                {/* Datos de la empresa */}
                <section>
                    <h3 className="text-lg font-bold text-[#3200C1] mb-6 flex items-center gap-2">
                        <Building2 className="w-5 h-5" /> Datos de la Constructora
                    </h3>
                    <div className="space-y-5">
                        <div>
                            <label className="block text-slate-700 font-bold mb-2">Nombre Oficial de la Empresa</label>
                            <input
                                required
                                name="company_name"
                                type="text"
                                defaultValue={initialName || ""}
                                placeholder="Ej: Casas Chile SpA"
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-[#3200C1] focus:outline-none bg-slate-50 focus:bg-white transition-colors"
                            />
                            <p className="text-xs text-slate-400 mt-1">Debe coincidir exactamente con el nombre en los modelos.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-slate-700 font-bold mb-2">Correo de Acceso</label>
                                <input
                                    required
                                    name="email"
                                    type="email"
                                    placeholder="empresa@dominio.com"
                                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-[#3200C1] focus:outline-none bg-slate-50 focus:bg-white transition-colors"
                                />
                            </div>
                            <div>
                                <label className="block text-slate-700 font-bold mb-2">Rol en la Plataforma</label>
                                <select name="role" defaultValue="company" className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-[#3200C1] focus:outline-none bg-slate-50 focus:bg-white">
                                    <option value="company">Constructora (Normal)</option>
                                    <option value="admin">Administrador Maestro</option>
                                </select>
                            </div>
                        </div>

                        {/* Contraseña */}
                        <div>
                            <label className="block text-slate-700 font-bold mb-2">Contraseña de Acceso</label>
                            <div className="relative">
                                <input
                                    required
                                    minLength={6}
                                    name="password"
                                    type={showPass ? "text" : "password"}
                                    placeholder="Mínimo 6 caracteres"
                                    className="w-full pl-4 pr-12 py-3 border border-slate-200 rounded-xl focus:border-[#3200C1] focus:outline-none bg-slate-50 focus:bg-white transition-colors"
                                />
                                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#3200C1]">
                                    {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                <hr className="border-slate-100" />

                <section>
                    <h3 className="text-lg font-bold text-[#3200C1] mb-6">Identidad Visual</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-slate-700 font-bold mb-2">Logotipo Principal</label>
                            <input name="logo" type="file" accept="image/*" className="w-full text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#3200C1]/10 file:text-[#3200C1] hover:file:bg-[#3200C1]/20 cursor-pointer" />
                            <p className="text-xs text-slate-400 mt-2">Se mostrará en los modelos publicados.</p>
                        </div>
                        <div>
                            <label className="block text-slate-700 font-bold mb-2">Favicon / Icono (Redes)</label>
                            <input name="favicon" type="file" accept="image/*" className="w-full text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#37FFDB]/20 file:text-[#3200C1] hover:file:bg-[#37FFDB]/40 cursor-pointer" />
                            <p className="text-xs text-slate-400 mt-2">Opcional. Se mostrará como icono corto.</p>
                        </div>
                    </div>
                </section>

                <hr className="border-slate-100" />

                {/* Plan */}
                <section>
                    <h3 className="text-lg font-bold text-[#3200C1] mb-1">Plan de Suscripción</h3>
                    <p className="text-xs text-slate-400 mb-5">Define los límites y beneficios de la empresa en el portal.</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {[
                            { value: "free", emoji: "🟢", label: "Plan Inicial", uf: "Gratis (4m)", desc: "Hasta 3 modelos, botón WhatsApp, link perfil." },
                            { value: "pro", emoji: "🔵", label: "Plan Pro", uf: "Pro", desc: "20 modelos max, leads WhatsApp, verificado." },
                            { value: "elite", emoji: "🟣", label: "Plan Elite", uf: "Elite", desc: "Ilimitados, comparador, destacados, landing." },
                        ].map((plan) => (
                            <label key={plan.value} className="relative cursor-pointer">
                                <input type="radio" name="plan" value={plan.value} defaultChecked={plan.value === "free"} className="sr-only peer" />
                                <div className="p-4 border-2 border-slate-200 rounded-xl peer-checked:border-[#3200C1] peer-checked:bg-[#3200C1]/5 transition-all hover:border-slate-300 h-full">
                                    <p className="font-black text-slate-800 mb-1">{plan.emoji} {plan.label}</p>
                                    <p className="text-lg font-black text-[#3200C1]">{plan.uf}{plan.value !== 'free' && <span className="text-xs font-bold text-slate-400">/mes</span>}</p>
                                    <p className="text-xs text-slate-500 mt-2 leading-relaxed">{plan.desc}</p>
                                </div>
                            </label>
                        ))}
                    </div>
                </section>

                {/* Submit */}
                <div className="pt-4 border-t border-slate-100 flex justify-end gap-4">
                    <Link href="/dashboard/companies" className="px-6 py-4 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-all">
                        Cancelar
                    </Link>
                    <button
                        disabled={isPending}
                        type="submit"
                        className={`px-8 py-4 bg-[#3200C1] text-[#37FFDB] font-black rounded-xl flex items-center gap-2 hover:bg-[#3200C1]/90 transition-all shadow-md active:scale-95 ${isPending ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                        {isPending ? "Creando cuenta…" : <><Save className="w-5 h-5" /> Crear Cuenta B2B</>}
                    </button>
                </div>
            </form>
        </div>
    );
}
