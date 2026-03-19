"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, CheckCircle2 } from "lucide-react";

export default function ForgotPasswordPage() {
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const email = (new FormData(e.currentTarget)).get("email")?.toString();

        const res = await fetch("/api/auth/forgot-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
        });

        const data = await res.json();
        if (!res.ok) {
            setError(data.error || "Error al enviar el correo.");
        } else {
            setSent(true);
        }
        setLoading(false);
    };

    if (sent) {
        return (
            <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-[#37FFDB]/20 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8 text-[#3200C1]" />
                </div>
                <h3 className="text-xl font-black text-slate-800">¡Correo enviado!</h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                    Si existe una cuenta con ese correo, recibirás un enlace para restablecer tu contraseña en los próximos minutos. Revisa también la carpeta de spam.
                </p>
                <Link
                    href="/login"
                    className="inline-flex items-center gap-2 text-sm font-bold text-[#3200C1] hover:underline mt-4"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Volver al inicio de sesión
                </Link>
            </div>
        );
    }

    return (
        <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="text-center mb-2">
                <p className="text-slate-500 text-sm">
                    Ingresa el correo de tu cuenta y te enviaremos un enlace para restablecer tu contraseña.
                </p>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 text-sm p-4 rounded-xl font-medium border border-red-100">
                    {error}
                </div>
            )}

            <div>
                <label className="block text-sm font-bold text-slate-700">Correo de la Empresa</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                        name="email"
                        type="email"
                        required
                        className="pl-10 block w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-[#3200C1] focus:border-[#3200C1] sm:text-sm bg-slate-50 focus:bg-white transition-colors"
                        placeholder="ejemplo@constructora.cl"
                    />
                </div>
            </div>

            <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-sm text-sm font-extrabold text-[#37FFDB] bg-[#3200C1] hover:bg-[#3200C1]/90 focus:outline-none items-center gap-2 transition-all active:scale-[0.98] ${loading ? "opacity-75 cursor-wait" : ""}`}
            >
                {loading ? "Enviando..." : "Enviar enlace de recuperación"}
            </button>

            <div className="text-center">
                <Link
                    href="/login"
                    className="inline-flex items-center gap-1.5 text-sm font-bold text-slate-500 hover:text-[#3200C1] transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Volver al inicio de sesión
                </Link>
            </div>
        </form>
    );
}
