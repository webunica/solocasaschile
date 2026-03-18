"use client";

import { useState } from "react";
import Link from "next/link";
import { Hash, CheckCircle, AlertCircle, ArrowLeft, Building2, Shield, Zap, Users, MessageCircle } from "lucide-react";

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

                        {/* Plan Pro */}
                        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between mb-5">
                                <div>
                                    <span className="text-xs font-black uppercase tracking-widest text-[#3200C1]">Ideal para Empresas</span>
                                    <h3 className="text-xl font-black text-slate-800">Plan Pro</h3>
                                </div>
                                <span className="px-3 py-1.5 rounded-full bg-[#3200C1]/10 text-[#3200C1] text-xs font-black">
                                    Upgrade
                                </span>
                            </div>
                            <ul className="space-y-3 mb-6">
                                {[
                                    "✨ Modelos ilimitados publicados",
                                    "✨ Hasta 15 fotos por modelo",
                                    "✨ 1 Video (YouTube/Vimeo) por modelo",
                                    "✨ Leads directos a tu WhatsApp",
                                    "✨ Panel de estadísticas",
                                ].map((f) => (
                                    <li key={f} className="text-sm text-slate-600 font-medium">{f}</li>
                                ))}
                            </ul>
                            <a
                                href="https://wa.me/56964130601?text=Hola,%20me%20interesa%20el%20Plan%20Pro%20en%20solocasaschile.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full mt-auto py-3 bg-[#25D366] text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-[#20bd5a] transition-colors"
                            >
                                <MessageCircle className="w-5 h-5" />
                                Contactar por WhatsApp
                            </a>
                        </div>

                        {/* Plan Elite */}
                        <div className="bg-gradient-to-br from-slate-900 to-[#3200C1] rounded-3xl p-8 border border-slate-800 shadow-xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#37FFDB]/10 rounded-full blur-3xl" />
                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-5">
                                    <div>
                                        <span className="text-xs font-black uppercase tracking-widest text-[#37FFDB]">Máxima Visibilidad</span>
                                        <h3 className="text-xl font-black text-white">Plan Elite</h3>
                                    </div>
                                    <span className="px-3 py-1.5 rounded-full bg-[#37FFDB] text-[#3200C1] text-xs font-black">
                                        Destacado
                                    </span>
                                </div>
                                <ul className="space-y-3 mb-6">
                                    {[
                                        "🌟 Todo lo del plan Pro incluido",
                                        "🌟 Hasta 30 fotos por modelo",
                                        "🌟 Videos incrustados ilimitados",
                                        "🌟 Insignia 'Destacado' en buscador",
                                        "🌟 Exhibición rotativa en el Home",
                                    ].map((f) => (
                                        <li key={f} className="text-sm text-white/80 font-medium">{f}</li>
                                    ))}
                                </ul>
                                <a
                                    href="https://wa.me/56964130601?text=Hola,%20me%20interesa%20el%20Plan%20Elite%20en%20solocasaschile.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full mt-auto py-3 bg-[#25D366] text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-[#20bd5a] transition-colors"
                                >
                                    <MessageCircle className="w-5 h-5" />
                                    Contactar por WhatsApp
                                </a>
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

                {/* Pricing Table Section */}
                <div className="mt-24 bg-white/5 backdrop-blur-sm rounded-[40px] p-8 md:p-16 border border-white/10">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Planes y Formas de Pago</h2>
                        <p className="text-white/60 max-w-2xl mx-auto">
                            Elige la modalidad que mejor se adapte a tu empresa. Precios transparentes para potenciar tu visibilidad.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-12">
                        {/* payment forms */}
                        <div className="space-y-6">
                            <h3 className="text-xl font-black text-[#37FFDB] flex items-center gap-3">
                                <Zap className="w-6 h-6" />
                                Formas de Pago
                            </h3>
                            <div className="grid gap-4">
                                {[
                                    { title: "Mensual", desc: "Pago estándar mes a mes", discount: null },
                                    { title: "Trimestral", desc: "Pago cada 3 meses", discount: "10% OFF" },
                                    { title: "Semestral", desc: "Pago cada 6 meses", discount: "15% OFF" },
                                ].map((item) => (
                                    <div key={item.title} className="bg-white/10 p-5 rounded-2xl flex items-center justify-between border border-white/5 hover:border-[#37FFDB]/30 transition-colors">
                                        <div>
                                            <p className="font-black text-white">{item.title}</p>
                                            <p className="text-white/50 text-sm">{item.desc}</p>
                                        </div>
                                        {item.discount && (
                                            <span className="bg-[#37FFDB] text-[#3200C1] px-3 py-1 rounded-full text-xs font-black">
                                                {item.discount}
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Referential Values */}
                        <div className="space-y-6">
                            <h3 className="text-xl font-black text-[#37FFDB] flex items-center gap-3">
                                <Building2 className="w-6 h-6" />
                                Valores Referenciales (+ IVA)
                            </h3>
                            <div className="overflow-hidden rounded-2xl border border-white/10">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-white/10 text-[#37FFDB] font-black uppercase text-[10px] tracking-widest">
                                        <tr>
                                            <th className="px-6 py-4">Suscripción</th>
                                            <th className="px-6 py-4 text-right">Mensual</th>
                                            <th className="px-6 py-4 text-right">Trimestral</th>
                                            <th className="px-6 py-4 text-right">Semestral</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-white/80 divide-y divide-white/5 bg-white/5">
                                        <tr>
                                            <td className="px-6 py-4 font-bold text-white">Plan Pro</td>
                                            <td className="px-6 py-4 text-right">$34.900</td>
                                            <td className="px-6 py-4 text-right">$94.230</td>
                                            <td className="px-6 py-4 text-right">$177.990</td>
                                        </tr>
                                        <tr>
                                            <td className="px-6 py-4 font-bold text-white">Plan Elite</td>
                                            <td className="px-6 py-4 text-right">$79.900</td>
                                            <td className="px-6 py-4 text-right">$215.730</td>
                                            <td className="px-6 py-4 text-right">$407.490</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <p className="text-[10px] text-white/40 italic">
                                * Valores sujetos a cambios. El descuento ya se encuentra aplicado en los montos trimestrales y semestrales.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Commercial Conditions */}
                <div className="mt-24 grid md:grid-cols-2 gap-16 items-center">
                    <div>
                        <h2 className="text-3xl font-black text-white mb-6">Condiciones Comerciales</h2>
                        <div className="space-y-6">
                            {[
                                "Activación en 24 a 48 horas hábiles tras validación",
                                "Cada empresa administra sus publicaciones desde su panel",
                                "Los leads llegan directo al WhatsApp o formulario del constructor",
                                "La plataforma puede validar publicaciones antes de ser visibles",
                                "El soporte es sobre uso de plataforma, no incluye gestión comercial externa",
                            ].map((condition, idx) => (
                                <div key={idx} className="flex gap-4">
                                    <div className="w-6 h-6 rounded-full bg-[#37FFDB]/20 flex items-center justify-center text-[#37FFDB] shrink-0">
                                        <CheckCircle className="w-4 h-4" />
                                    </div>
                                    <p className="text-white/70 text-sm leading-relaxed">{condition}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-[#37FFDB]/20 to-transparent p-12 rounded-[40px] border border-[#37FFDB]/20 relative">
                        <div className="absolute -top-6 -right-6 w-24 h-24 bg-[#37FFDB] rounded-full blur-[80px] opacity-20" />
                        <h3 className="text-xl font-black text-[#37FFDB] mb-4">¿Todo Claro?</h3>
                        <p className="text-white/60 text-sm leading-relaxed mb-8">
                            Nuestro objetivo es simplificar la conexión entre constructoras y clientes. Al unirte, accedes a una plataforma optimizada para la conversión.
                        </p>
                        <a 
                            href="https://wa.me/56964130601" 
                            target="_blank" 
                            className="inline-flex items-center gap-2 text-sm font-black text-[#37FFDB] hover:underline"
                        >
                            Hablar con un ejecutivo <ArrowLeft className="w-4 h-4 rotate-180" />
                        </a>
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="mt-32">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Preguntas Frecuentes</h2>
                        <p className="text-white/60">Resolvemos tus dudas antes de comenzar</p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
                        {[
                            {
                                q: "¿Puedo comenzar gratis?",
                                a: "¡Sí! Ofrecemos un plan inicial completamente gratuito por 6 meses que te permite subir hasta 3 modelos para probar la plataforma."
                            },
                            {
                                q: "¿Qué pasa después de los 6 meses del plan inicial?",
                                a: "Podrás elegir entre mantenerte en una versión básica o actualizar a uno de nuestros planes Pro o Elite para seguir disfrutando de todos los beneficios."
                            },
                            {
                                q: "¿Puedo cambiar de plan después?",
                                a: "Por supuesto. Puedes subir o bajar de nivel tu suscripción en cualquier momento desde tu panel de administración."
                            },
                            {
                                q: "¿Los leads llegan directo a mi WhatsApp?",
                                a: "En los planes Pro y Elite, los botones de contacto pueden dirigir al cliente directamente a tu WhatsApp comercial."
                            },
                            {
                                q: "¿Ustedes suben mis modelos o lo hago yo?",
                                a: "Tendrás un panel de control intuitivo para gestionar tus propios modelos, fotos y descripciones de forma inmediata."
                            },
                            {
                                q: "¿Cuánto demora la activación?",
                                a: "Una vez completado el registro y validada la información, tu cuenta estará activa en un plazo de 24 a 48 horas hábiles."
                            }
                        ].map((item, idx) => (
                            <div key={idx} className="bg-white/5 border border-white/10 p-8 rounded-3xl hover:bg-white/[0.07] transition-colors">
                                <h4 className="font-black text-white mb-3 text-lg">{item.q}</h4>
                                <p className="text-white/50 text-sm leading-relaxed">{item.a}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Final CTA */}
                <div className="mt-32 mb-20">
                    <div className="relative overflow-hidden bg-gradient-to-r from-[#3200C1] to-[#37FFDB]/40 rounded-[40px] p-12 md:p-24 text-center border border-white/20">
                        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none" />
                        <h2 className="text-4xl md:text-6xl font-black text-white mb-8 relative z-10 [text-wrap:balance]">
                            Comienza hoy y muestra tus modelos de forma profesional
                        </h2>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
                            <button 
                                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                                className="w-full sm:w-auto px-10 py-5 bg-white text-[#3200C1] font-black rounded-2xl hover:scale-105 transition-transform shadow-xl"
                            >
                                Crear cuenta gratis
                            </button>
                            <a 
                                href="https://wa.me/56964130601"
                                target="_blank"
                                className="w-full sm:w-auto px-10 py-5 bg-transparent border-2 border-white/30 text-white font-black rounded-2xl hover:bg-white/10 transition-colors"
                            >
                                Solicitar información
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
