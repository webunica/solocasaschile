"use client";

import { useTransition, useState, useEffect } from "react";
import { Save, Eye, EyeOff, ExternalLink, CheckCircle, AlertCircle, Mail, Globe } from "lucide-react";
import { saveSettingsAction } from "./settings-actions";

export default function SettingsForm({ settings }: { settings: any }) {
    const [isPending, startTransition] = useTransition();
    const [showApiKey, setShowApiKey] = useState(false);
    const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");
    const [errorMsg, setErrorMsg] = useState("");

    // Limpiar el estado de guardado tras 4 segundos
    useEffect(() => {
        if (saveStatus !== "idle") {
            const t = setTimeout(() => setSaveStatus("idle"), 4000);
            return () => clearTimeout(t);
        }
    }, [saveStatus]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        startTransition(async () => {
            const result = await saveSettingsAction(formData);
            if (result.error) {
                setErrorMsg(result.error);
                setSaveStatus("error");
            } else {
                setSaveStatus("success");
            }
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8 max-w-3xl">

            {/* ─── Sección Resend ─────────────────────────────────── */}
            <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-8 py-5 bg-[#3200C1] flex items-center justify-between">
                    <div>
                        <h3 className="text-white font-black text-lg">📧 Configuración de Email</h3>
                        <p className="text-white/70 text-sm mt-0.5">Powered by Resend — la plataforma de email para desarrolladores</p>
                    </div>
                    <a
                        href="https://resend.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-4 py-2 bg-[#37FFDB] text-[#3200C1] text-xs font-black rounded-xl hover:bg-white transition-colors"
                    >
                        <ExternalLink className="w-3.5 h-3.5" />
                        resend.com
                    </a>
                </div>

                <div className="px-8 py-6 space-y-6">
                    {/* Alerta de instrucciones */}
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-800 space-y-1.5">
                        <p className="font-black text-sm">📋 Cómo obtener tu API Key de Resend:</p>
                        <ol className="list-decimal list-inside space-y-1 text-amber-700">
                            <li>Entra a <a href="https://resend.com" className="underline font-bold" target="_blank">resend.com</a> y crea una cuenta gratuita</li>
                            <li>Ve a <strong>Domains</strong> y verifica tu dominio <strong>solocasaschile.com</strong></li>
                            <li>Ve a <strong>API Keys</strong> → <strong>Create API Key</strong></li>
                            <li>Copia la clave (empieza con <code className="bg-amber-100 px-1 rounded">re_</code>) y pégala aquí abajo</li>
                        </ol>
                        <p className="text-amber-600 font-medium">⚡ Plan gratuito: 3.000 emails/mes — suficiente para comenzar.</p>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                            Resend API Key <span className="text-red-400">*</span>
                        </label>
                        <div className="relative">
                            <input
                                name="resend_api_key"
                                type={showApiKey ? "text" : "password"}
                                defaultValue={settings?.resend_api_key || ""}
                                placeholder="re_xxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                                className="w-full pl-4 pr-12 py-3 border border-slate-200 rounded-xl focus:border-[#3200C1] focus:outline-none bg-slate-50 focus:bg-white font-mono text-sm"
                            />
                            <button
                                type="button"
                                onClick={() => setShowApiKey(!showApiKey)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#3200C1] transition-colors"
                            >
                                {showApiKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                                Email Remitente (FROM)
                            </label>
                            <div className="relative">
                                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    name="from_email"
                                    type="email"
                                    defaultValue={settings?.from_email || "no-reply@solocasaschile.com"}
                                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:border-[#3200C1] focus:outline-none bg-slate-50 focus:bg-white text-sm"
                                />
                            </div>
                            <p className="text-xs text-slate-400 mt-1.5">Debe pertenecer al dominio verificado en Resend</p>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                                Email Administrador (CC) <span className="text-red-400">*</span>
                            </label>
                            <div className="relative">
                                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    name="admin_email"
                                    type="email"
                                    required
                                    defaultValue={settings?.admin_email || "admin@solocasaschile.com"}
                                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:border-[#3200C1] focus:outline-none bg-slate-50 focus:bg-white text-sm"
                                />
                            </div>
                            <p className="text-xs text-slate-400 mt-1.5">Recibirá copia CC de todos los leads</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── Sección General del Portal ─────────────────────── */}
            <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-8 py-5 border-b border-slate-200">
                    <h3 className="text-slate-800 font-black text-lg">🏠 Información General del Portal</h3>
                </div>
                <div className="px-8 py-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Nombre del Sitio</label>
                            <input
                                name="site_name"
                                type="text"
                                defaultValue={settings?.site_name || "Solo Casas Chile"}
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-[#3200C1] focus:outline-none bg-slate-50 focus:bg-white text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">WhatsApp Fallback</label>
                            <div className="relative">
                                <Globe className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    name="whatsapp_fallback"
                                    type="text"
                                    defaultValue={settings?.whatsapp_fallback || ""}
                                    placeholder="56912345678"
                                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:border-[#3200C1] focus:outline-none bg-slate-50 focus:bg-white text-sm font-mono"
                                />
                            </div>
                            <p className="text-xs text-slate-400 mt-1.5">Se usa si la empresa no tiene teléfono configurado</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── Botón Guardar ───────────────────────────────────── */}
            <div className="flex items-center justify-between gap-4">
                {saveStatus === "success" && (
                    <span className="flex items-center gap-2 text-green-600 font-bold text-sm">
                        <CheckCircle className="w-4 h-4" /> ¡Ajustes guardados correctamente!
                    </span>
                )}
                {saveStatus === "error" && (
                    <span className="flex items-center gap-2 text-red-500 font-bold text-sm">
                        <AlertCircle className="w-4 h-4" /> {errorMsg}
                    </span>
                )}
                {saveStatus === "idle" && <span />}

                <button
                    disabled={isPending}
                    type="submit"
                    className={`ml-auto px-8 py-4 bg-[#3200C1] text-[#37FFDB] font-black rounded-xl flex items-center gap-2 shadow-md transition-all active:scale-95 ${isPending ? "opacity-50 cursor-not-allowed" : "hover:bg-[#3200C1]/90"}`}
                >
                    {isPending ? (
                        <><span className="w-4 h-4 border-2 border-[#37FFDB]/30 border-t-[#37FFDB] rounded-full animate-spin" /> Guardando...</>
                    ) : (
                        <><Save className="w-5 h-5" /> Guardar Ajustes</>
                    )}
                </button>
            </div>
        </form>
    );
}
