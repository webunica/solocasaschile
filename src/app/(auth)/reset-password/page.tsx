"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, Eye, EyeOff, CheckCircle2, AlertTriangle } from "lucide-react";

function ResetPasswordForm() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get("token") ?? "";

    const [loading, setLoading] = useState(false);
    const [validating, setValidating] = useState(true);
    const [tokenValid, setTokenValid] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");
    const [showPass, setShowPass] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    useEffect(() => {
        if (!token) {
            setValidating(false);
            return;
        }
        fetch(`/api/auth/validate-reset-token?token=${encodeURIComponent(token)}`)
            .then(r => r.json())
            .then(data => {
                setTokenValid(data.valid === true);
                setValidating(false);
            })
            .catch(() => {
                setTokenValid(false);
                setValidating(false);
            });
    }, [token]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        const fd = new FormData(e.currentTarget);
        const password = fd.get("password")?.toString() ?? "";
        const confirm = fd.get("confirm")?.toString() ?? "";

        if (password.length < 8) {
            setError("La contraseña debe tener al menos 8 caracteres.");
            return;
        }
        if (password !== confirm) {
            setError("Las contraseñas no coinciden.");
            return;
        }

        setLoading(true);
        const res = await fetch("/api/auth/reset-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token, password }),
        });
        const data = await res.json();
        if (!res.ok) {
            setError(data.error || "Error al restablecer la contraseña.");
            setLoading(false);
        } else {
            setSuccess(true);
            setTimeout(() => router.push("/login"), 3000);
        }
    };

    if (validating) {
        return (
            <div className="text-center py-8">
                <div className="w-8 h-8 border-4 border-[#3200C1] border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-slate-500 text-sm mt-4">Verificando enlace...</p>
            </div>
        );
    }

    if (!token || !tokenValid) {
        return (
            <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                    <AlertTriangle className="w-8 h-8 text-red-500" />
                </div>
                <h3 className="text-xl font-black text-slate-800">Enlace inválido o expirado</h3>
                <p className="text-slate-500 text-sm">
                    Este enlace de recuperación no es válido o ya expiró (válido por 1 hora). Solicita uno nuevo.
                </p>
                <Link
                    href="/forgot-password"
                    className="inline-block mt-2 px-6 py-3 bg-[#3200C1] text-[#37FFDB] text-sm font-bold rounded-xl hover:bg-[#3200C1]/90 transition-colors"
                >
                    Solicitar nuevo enlace
                </Link>
            </div>
        );
    }

    if (success) {
        return (
            <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-[#37FFDB]/20 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8 text-[#3200C1]" />
                </div>
                <h3 className="text-xl font-black text-slate-800">¡Contraseña restablecida!</h3>
                <p className="text-slate-500 text-sm">
                    Tu contraseña fue actualizada correctamente. Redirigiendo al inicio de sesión...
                </p>
            </div>
        );
    }

    return (
        <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="text-center mb-2">
                <p className="text-slate-500 text-sm">Elige una nueva contraseña segura para tu cuenta.</p>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 text-sm p-4 rounded-xl font-medium border border-red-100 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    {error}
                </div>
            )}

            <div>
                <label className="block text-sm font-bold text-slate-700">Nueva contraseña</label>
                <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                        name="password"
                        type={showPass ? "text" : "password"}
                        required
                        minLength={8}
                        className="pl-10 pr-10 block w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-[#3200C1] focus:border-[#3200C1] sm:text-sm bg-slate-50 focus:bg-white transition-colors"
                        placeholder="Mínimo 8 caracteres"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPass(v => !v)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                    >
                        {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                </div>
            </div>

            <div>
                <label className="block text-sm font-bold text-slate-700">Confirmar contraseña</label>
                <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                        name="confirm"
                        type={showConfirm ? "text" : "password"}
                        required
                        className="pl-10 pr-10 block w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-[#3200C1] focus:border-[#3200C1] sm:text-sm bg-slate-50 focus:bg-white transition-colors"
                        placeholder="Repite tu nueva contraseña"
                    />
                    <button
                        type="button"
                        onClick={() => setShowConfirm(v => !v)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                    >
                        {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                </div>
            </div>

            <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center py-4 px-4 rounded-xl shadow-sm text-sm font-extrabold text-[#37FFDB] bg-[#3200C1] hover:bg-[#3200C1]/90 items-center gap-2 transition-all active:scale-[0.98] ${loading ? "opacity-75 cursor-wait" : ""}`}
            >
                {loading ? "Guardando..." : "Restablecer contraseña"}
            </button>
        </form>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<div className="text-center py-8 text-slate-500">Cargando...</div>}>
            <ResetPasswordForm />
        </Suspense>
    );
}
