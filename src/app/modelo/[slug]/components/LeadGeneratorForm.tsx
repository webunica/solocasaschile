"use client";

import { useState } from "react";
import { Send, CheckCircle, AlertCircle } from "lucide-react";

type Props = {
    companyName: string;
    modelName: string;
    modelId: string;
    contactPhone?: string;
    companyEmail?: string;
};

export default function LeadGeneratorForm({ companyName, modelName, modelId, companyEmail }: Props) {
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [errorMsg, setErrorMsg] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setStatus("loading");
        setErrorMsg("");

        const formData = new FormData(e.currentTarget);
        const payload = {
            name: formData.get("name"),
            email: formData.get("email"),
            phone: formData.get("phone"),
            message: formData.get("message"),
            modelName,
            modelId,
            companyName,
            companyEmail: companyEmail || "",
        };

        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (!res.ok || data.error) {
                throw new Error(data.error || "Error desconocido");
            }

            setStatus("success");

        } catch (err: any) {
            setErrorMsg(err.message || "No pudimos enviar tu mensaje. Intenta de nuevo.");
            setStatus("error");
        }
    };

    // Vista de Éxito
    if (status === "success") {
        return (
            <div className="p-8 flex flex-col items-center justify-center text-center gap-4 min-h-[360px]">
                <div className="w-20 h-20 bg-[#37FFDB] rounded-full flex items-center justify-center shadow-lg">
                    <CheckCircle className="w-10 h-10 text-[#3200C1]" />
                </div>
                <h4 className="font-black text-xl text-[#3200C1]">¡Mensaje Enviado!</h4>
                <p className="text-sm text-slate-500 max-w-xs leading-relaxed">
                    Un ejecutivo de <span className="font-bold text-slate-700">{companyName}</span> recibirá tu solicitud y se pondrá en contacto contigo a la brevedad.
                </p>
                <p className="text-xs text-slate-400 italic">Revisa tu bandeja de entrada — también te enviamos un resumen.</p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="p-6 space-y-4">

            <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Nombre Completo *</label>
                <input required name="name" type="text" placeholder="Ej. Juan Pérez" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#3200C1] focus:outline-none transition-colors text-sm" />
            </div>

            <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Correo Electrónico *</label>
                <input required name="email" type="email" placeholder="tu@correo.com" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#3200C1] focus:outline-none transition-colors text-sm" />
            </div>

            <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Teléfono <span className="text-slate-400 font-normal">(Opcional)</span></label>
                <input name="phone" type="tel" placeholder="+56 9 XXXXXXXX" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#3200C1] focus:outline-none transition-colors text-sm" />
            </div>

            <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Mensaje <span className="text-slate-400 font-normal">(Opcional)</span></label>
                <textarea name="message" rows={3} placeholder={`Hola, me gustaría cotizar el modelo ${modelName}...`} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#3200C1] focus:outline-none transition-colors resize-none text-sm"></textarea>
            </div>

            {status === "error" && (
                <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-xs font-semibold">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    {errorMsg}
                </div>
            )}

            <button
                disabled={status === "loading"}
                type="submit"
                className={`w-full py-4 mt-1 font-black rounded-xl shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2 text-sm ${status === "loading"
                    ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                    : "bg-[#3200C1] text-[#37FFDB] hover:bg-[#3200C1]/90"
                    }`}
            >
                {status === "loading" ? (
                    <>
                        <span className="w-4 h-4 border-2 border-slate-300 border-t-slate-500 rounded-full animate-spin" />
                        Enviando solicitud...
                    </>
                ) : (
                    <>
                        <Send className="w-4 h-4" />
                        Solicitar Asesoría Gratuita
                    </>
                )}
            </button>

            <p className="text-[11px] text-center text-slate-400 leading-tight">
                Tu solicitud será enviada directamente a un experto que te contactará a la brevedad.<br />
                Recibirás una copia en tu correo.
            </p>
        </form>
    );
}
