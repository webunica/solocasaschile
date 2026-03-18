"use client";

import { useState } from "react";
import Link from "next/link";
import { Hash, CheckCircle, AlertCircle, ArrowLeft, Building2, Shield, Zap, Users } from "lucide-react";

const PLAN_FEATURES = {
    starter: {
        name: "Plan Starter",
        price: "Gratis",
        color: "border-slate-200 bg-white",
        accentColor: "text-[#3200C1]",
        badge: "bg-slate-100 text-slate-600",
        features: [
            "1 propiedad publicada",
            "Ficha de modelo básica",
            "Formulario de contacto",
            "Visible en el comparador",
        ],
        disabled: false,
        cta: "Comenzar Gratis",
    },
};

export default function RegistroPage() {
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [errorMsg, setErrorMsg] = useState("");
    const [formData, setFormData] = useState({
        company_name: "",
        email: "",
        contact_phone: "",
        password: "",
        confirm_password: "",
    });
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [faviconFile, setFaviconFile] = useState<File | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setLogoFile(e.target.files[0]);
        }
    };

    const handleFaviconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFaviconFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg("");

        if (formData.password !== formData.confirm_password) {
            setErrorMsg("Las contraseñas no coinciden.");
            return;
        }
        if (formData.password.length < 8) {
            setErrorMsg("La contraseña debe tener al menos 8 caracteres.");
            return;
        }

        setStatus("loading");

        try {
            const formPayload = new FormData();
            formPayload.append("company_name", formData.company_name);
            formPayload.append("email", formData.email);
            formPayload.append("contact_phone", formData.contact_phone);
            formPayload.append("password", formData.password);
            if (logoFile) formPayload.append("logo", logoFile);
            if (faviconFile) formPayload.append("favicon", faviconFile);

            const res = await fetch("/api/register-company", {
                method: "POST",
                body: formPayload,
            });

            const data = await res.json();

            if (!res.ok || data.error) {
                throw new Error(data.error || "Error al registrar la empresa.");
            }

            setStatus("success");
        } catch (err: any) {
            setErrorMsg(err.message || "Hubo un problema. Intenta nuevamente.");
            setStatus("error");
        }
    };

    if (status === "success") {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#3200C1] via-[#3200C1]/90 to-[#37FFDB]/30 flex items-center justify-center px-4">
                <div className="bg-white rounded-3xl p-10 max-w-md w-full text-center shadow-2xl">
                    <div className="w-20 h-20 bg-[#37FFDB] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                        <CheckCircle className="w-10 h-10 text-[#3200C1]" />
                    </div>
                    <h2 className="text-2xl font-black text-[#3200C1] mb-3">¡Registro Exitoso!</h2>
                    <p className="text-slate-500 leading-relaxed mb-6">
                        Tu cuenta ha sido creada. Ahora puedes acceder al dashboard y publicar tu primera propiedad de forma gratuita.
                    </p>
                    <Link
                        href="/login"
                        className="w-full inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#3200C1] text-[#37FFDB] font-black rounded-xl hover:brightness-110 transition-all"
                    >
                        Ir al Panel de Control
                    </Link>
                    <p className="text-xs text-slate-400 mt-4">
                        ¿Necesitas más propiedades?{" "}
                        <Link href="/dashboard/settings" className="text-[#3200C1] font-bold hover:underline">
                            Mejora tu plan
                        </Link>
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#3200C1] via-[#3200C1]/90 to-[#37FFDB]/20">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-white/10 backdrop-blur-md border-b border-white/10">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#37FFDB] flex items-center justify-center shadow-sm">
                            <Hash className="w-5 h-5 text-[#3200C1]" />
                        </div>
                        <span className="text-lg font-black text-white">solocasaschile.com</span>
                    </Link>
                    <Link href="/" className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm font-bold transition-colors">
                        <ArrowLeft className="w-4 h-4" /> Volver al inicio
                    </Link>
                </div>
            </header>

            <div className="max-w-6xl mx-auto px-4 py-12">
                {/* Hero Text */}
                <div className="text-center mb-12">
                    <span className="inline-block px-4 py-1.5 rounded-full bg-[#37FFDB]/20 text-[#37FFDB] text-xs font-black uppercase tracking-widest mb-4 border border-[#37FFDB]/30">
                        🎁 Promoción Especial: 6 Meses Gratis
                    </span>
                    <h1 className="text-3xl md:text-5xl font-black text-white mb-4 [text-wrap:balance]">
                        Sube hasta 3 modelos<br />
                        <span className="text-[#37FFDB]">completamente gratis</span>
                    </h1>
                    <p className="text-white/70 max-w-xl mx-auto leading-relaxed">
                        Regístrate como constructora y empieza a mostrar tus proyectos al comparador más completo de casas prefabricadas en Chile.
                    </p>
                </div>

                <div className="grid lg:grid-cols-[1fr_420px] gap-8 items-start">
                    {/* Benefits Column */}
                    <div className="space-y-6">
                        {/* Benefits list */}
                        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/10">
                            <h2 className="text-lg font-black text-white mb-6">¿Por qué publicar en SolocasasChile?</h2>
                            <div className="space-y-5">
                                {[
                                    {
                                        icon: <Users className="w-5 h-5" />,
                                        title: "Miles de compradores potenciales",
                                        desc: "Clientes activos que buscan casas prefabricadas en Chile llegan a nuestro comparador todos los días.",
                                    },
                                    {
                                        icon: <Zap className="w-5 h-5" />,
                                        title: "Tu catálogo inicial, sin costo",
                                        desc: "Te regalamos 6 meses de plan Gratuito para publicar hasta 3 modelos con imágenes y detalles.",
                                    },
                                    {
                                        icon: <Shield className="w-5 h-5" />,
                                        title: "Ficha técnica completa",
                                        desc: "Muestra superficie, dorms, baños, precio, categoría, imágenes y formulario de contacto directo.",
                                    },
                                    {
                                        icon: <Building2 className="w-5 h-5" />,
                                        title: "Panel de control exclusivo",
                                        desc: "Edita tus propiedades, revisa métricas de clics e impresiones desde tu dashboard personalizado.",
                                    },
                                ].map(({ icon, title, desc }) => (
                                    <div key={title} className="flex gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-[#37FFDB]/20 flex items-center justify-center text-[#37FFDB] shrink-0 mt-0.5">
                                            {icon}
                                        </div>
                                        <div>
                                            <p className="font-black text-white text-sm">{title}</p>
                                            <p className="text-white/60 text-sm mt-0.5 leading-relaxed">{desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Plan Card */}
                        <div className="bg-white rounded-3xl p-8 border-2 border-[#37FFDB] shadow-xl shadow-[#37FFDB]/10">
                            <div className="flex items-center justify-between mb-5">
                                <div>
                                    <span className="text-xs font-black uppercase tracking-widest text-slate-400">Promoción de Registro</span>
                                    <h3 className="text-xl font-black text-[#3200C1]">Plan Inicial — Gratis</h3>
                                </div>
                                <span className="px-3 py-1.5 rounded-full bg-[#37FFDB] text-[#3200C1] text-xs font-black">
                                    Por 6 Meses
                                </span>
                            </div>
                            <ul className="space-y-3">
                                {[
                                    "✅ Hasta 3 modelos publicados",
                                    "✅ Hasta 5 fotos por modelo",
                                    "✅ Ficha de modelo y detalles",
                                    "✅ Formulario de cotización integrado",
                                    "✅ Panel de control constructor",
                                ].map((f) => (
                                    <li key={f} className="text-sm text-slate-700 font-medium">{f}</li>
                                ))}
                            </ul>
                            <div className="mt-6 pt-5 border-t border-slate-100">
                                <p className="text-xs text-slate-400">
                                    ¿Tu catálogo tiene más de 3 modelos o quieres destacar?{" "}
                                    <span className="text-[#3200C1] font-black">
                                        Consulta nuestros Planes Pro y Elite dentro del dashboard.
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Registration Form */}
                    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden sticky top-24">
                        <div className="bg-gradient-to-r from-[#3200C1] to-[#3200C1]/80 p-6">
                            <h2 className="text-xl font-black text-white">Crear Cuenta de Constructora</h2>
                            <p className="text-white/70 text-sm mt-1">Completa el formulario — tarda menos de 2 minutos</p>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-1.5">
                                    Nombre de la Empresa *
                                </label>
                                <input
                                    required
                                    name="company_name"
                                    type="text"
                                    placeholder="Ej: Casas Prefabricadas Chile SpA"
                                    value={formData.company_name}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#3200C1] focus:outline-none transition-colors text-sm"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">
                                        Logotipo Principal
                                    </label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleLogoChange}
                                        className="w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-[#3200C1]/10 file:text-[#3200C1] hover:file:bg-[#3200C1]/20 cursor-pointer"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">
                                        Favicon / Icono (Redes)
                                    </label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFaviconChange}
                                        className="w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-[#37FFDB]/20 file:text-[#3200C1] hover:file:bg-[#37FFDB]/40 cursor-pointer"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-1.5">
                                    Correo Electrónico *
                                </label>
                                <input
                                    required
                                    name="email"
                                    type="email"
                                    placeholder="contacto@tuempresa.cl"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#3200C1] focus:outline-none transition-colors text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-1.5">
                                    Teléfono Comercial
                                </label>
                                <input
                                    name="contact_phone"
                                    type="tel"
                                    placeholder="+56 9 XXXXXXXX"
                                    value={formData.contact_phone}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#3200C1] focus:outline-none transition-colors text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-1.5">
                                    Contraseña *
                                </label>
                                <input
                                    required
                                    name="password"
                                    type="password"
                                    placeholder="Mínimo 8 caracteres"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#3200C1] focus:outline-none transition-colors text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-1.5">
                                    Confirmar Contraseña *
                                </label>
                                <input
                                    required
                                    name="confirm_password"
                                    type="password"
                                    placeholder="Repite tu contraseña"
                                    value={formData.confirm_password}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#3200C1] focus:outline-none transition-colors text-sm"
                                />
                            </div>

                            {(status === "error" || errorMsg) && (
                                <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-xs font-semibold">
                                    <AlertCircle className="w-4 h-4 shrink-0" />
                                    {errorMsg}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={status === "loading"}
                                className={`w-full py-4 font-black rounded-xl transition-all text-sm flex items-center justify-center gap-2 ${status === "loading"
                                    ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                                    : "bg-[#3200C1] text-[#37FFDB] hover:brightness-110 active:scale-[0.98] shadow-md"
                                    }`}
                            >
                                {status === "loading" ? (
                                    <>
                                        <span className="w-4 h-4 border-2 border-slate-300 border-t-slate-500 rounded-full animate-spin" />
                                        Creando cuenta...
                                    </>
                                ) : (
                                    "Crear Cuenta Gratis"
                                )}
                            </button>

                            <p className="text-[11px] text-center text-slate-400 leading-tight">
                                Al registrarte aceptas nuestros{" "}
                                <Link href="/terminos" className="underline hover:text-[#3200C1]">
                                    Términos y Condiciones
                                </Link>
                                . Tu información es privada y segura.
                            </p>

                            <div className="pt-2 text-center border-t border-slate-100">
                                <p className="text-sm text-slate-500">
                                    ¿Ya tienes una cuenta?{" "}
                                    <Link href="/login" className="font-black text-[#3200C1] hover:underline">
                                        Iniciar sesión
                                    </Link>
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
