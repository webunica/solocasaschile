"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, ArrowRight } from "lucide-react";

export default function LoginPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const formData = new FormData(e.currentTarget);
        const email = formData.get("email")?.toString();
        const password = formData.get("password")?.toString();

        const result = await signIn("credentials", {
            redirect: false,
            email,
            password,
        });

        if (result?.error) {
            setError(result.error);
            setLoading(false);
        } else {
            // Ir al panel de control de constructoras
            router.push("/dashboard");
            router.refresh(); // para forzar la actualización de sesión en layout
        }
    };

    return (
        <form className="space-y-6" onSubmit={handleLogin}>
            {error && (
                <div className="bg-red-50 text-red-600 text-sm p-4 rounded-xl font-medium border border-red-100 flex items-center justify-center">
                    {error}
                </div>
            )}

            <div>
                <label className="block text-sm font-bold text-slate-700"> Correo de la Empresa </label>
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

            <div>
                <label className="block text-sm font-bold text-slate-700"> Contraseña </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                        name="password"
                        type="password"
                        required
                        className="pl-10 block w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-[#3200C1] focus:border-[#3200C1] sm:text-sm bg-slate-50 focus:bg-white transition-colors"
                        placeholder="••••••••"
                    />
                </div>
                <div className="flex items-center justify-end mt-2">
                    <div className="text-sm">
                        <a href="#" className="font-bold text-[#3200C1] hover:text-[#37FFDB] hover:underline">
                            ¿Olvidaste tu contraseña?
                        </a>
                    </div>
                </div>
            </div>

            <div>
                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-sm text-sm font-extrabold text-[#37FFDB] bg-[#3200C1] hover:bg-[#3200C1]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3200C1] items-center gap-2 transition-all active:scale-[0.98] ${loading ? "opacity-75 cursor-wait" : ""}`}
                >
                    {loading ? "Accediendo..." : <>Entrar al Panel <ArrowRight className="w-4 h-4" /></>}
                </button>
            </div>
        </form>
    );
}
