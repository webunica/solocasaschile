"use client";

import { useState } from "react";
import { Mail, Building2, User, MessageSquare, Send, CheckCircle2, Loader2, RefreshCw, AlertCircle, Phone, ChevronDown } from "lucide-react";

export default function ConsultationForm() {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const formData = new FormData(e.currentTarget);
        const data = {
            company: formData.get("company"),
            contact: formData.get("contact"),
            email: formData.get("email"),
            phone: formData.get("phone"),
            subject: formData.get("subject"),
            message: formData.get("message"),
        };

        try {
            const response = await fetch("/api/consultation", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const resData = await response.json();
                throw new Error(resData.error || "Error al enviar la consulta");
            }

            setIsSubmitted(true);
        } catch (err: any) {
            console.error("Error sending consultation:", err);
            setError(err.message || "No se pudo enviar el mensaje por favor reintente.");
        } finally {
            setIsLoading(false);
        }
    };

    if (isSubmitted) {
        return (
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden flex flex-col items-center justify-center text-center space-y-6 animate-in zoom-in duration-500 min-h-[550px]">
                <div className="w-20 h-20 bg-[#37FFDB]/10 rounded-full flex items-center justify-center border border-[#37FFDB]/20 shadow-lg shadow-[#37FFDB]/10">
                    <CheckCircle2 className="w-10 h-10 text-[#37FFDB]" />
                </div>
                <div className="space-y-3">
                    <h3 className="text-2xl font-black text-white uppercase tracking-tight">¡Mensaje Enviado!</h3>
                    <p className="text-slate-400 font-medium leading-relaxed max-w-[280px]">
                        Tu consulta ha sido recibida con éxito. <br />
                        <span className="text-white">Lo contactaremos a la brevedad.</span>
                    </p>
                </div>
                <button 
                    onClick={() => setIsSubmitted(false)}
                    className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#37FFDB]/60 hover:text-[#37FFDB] transition-colors pt-4"
                >
                    <RefreshCw className="w-3 h-3" /> Enviar otra consulta
                </button>
            </div>
        );
    }

    return (
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 md:p-10 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#3200C1] via-[#37FFDB] to-[#3200C1]"></div>
            
            <div className="mb-8 space-y-2">
                <h3 className="text-2xl font-black tracking-tight text-white uppercase">Obtener Datos</h3>
                <p className="text-slate-400 text-sm font-medium leading-relaxed">
                    Si eres una constructora o buscas información detallada, completa el formulario.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Constructora</label>
                        <div className="relative">
                            <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#37FFDB]/50" />
                            <input 
                                required
                                name="company"
                                type="text" 
                                placeholder="Empresa"
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-[#37FFDB]/50 focus:bg-white/10 transition-all placeholder:text-slate-600 text-white"
                            />
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Contacto</label>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#37FFDB]/50" />
                            <input 
                                required
                                name="contact"
                                type="text" 
                                placeholder="Nombre completo"
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-[#37FFDB]/50 focus:bg-white/10 transition-all placeholder:text-slate-600 text-white"
                            />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Email Corporativo</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#37FFDB]/50" />
                            <input 
                                required
                                name="email"
                                type="email" 
                                placeholder="correo@empresa.cl"
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-[#37FFDB]/50 focus:bg-white/10 transition-all placeholder:text-slate-600 text-white"
                            />
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Teléfono</label>
                        <div className="relative">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#37FFDB]/50" />
                            <input 
                                required
                                name="phone"
                                type="tel" 
                                placeholder="+56 9 ..."
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-[#37FFDB]/50 focus:bg-white/10 transition-all placeholder:text-slate-600 text-white"
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Asunto de Consulta</label>
                    <div className="relative">
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                        <select 
                            required
                            name="subject"
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-4 pr-10 text-sm focus:outline-none focus:border-[#37FFDB]/50 focus:bg-white/10 transition-all appearance-none text-white overflow-hidden"
                            style={{ colorScheme: 'dark' }}
                        >
                            <option value="" className="bg-[#020110]">Selecciona una opción</option>
                            <option value="constructora" className="bg-[#020110]">Soy una Constructora (Quiero unirme)</option>
                            <option value="cliente" className="bg-[#020110]">Busco una casa (Más información)</option>
                            <option value="alianza" className="bg-[#020110]">Alianzas Comerciales</option>
                            <option value="soporte" className="bg-[#020110]">Soporte / Otros</option>
                        </select>
                    </div>
                </div>

                <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Mensaje</label>
                    <div className="relative">
                        <MessageSquare className="absolute left-4 top-3 w-4 h-4 text-[#37FFDB]/50" />
                        <textarea 
                            required
                            name="message"
                            placeholder="¿En qué podemos ayudarte?"
                            rows={2}
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-[#37FFDB]/50 focus:bg-white/10 transition-all placeholder:text-slate-600 resize-none text-white"
                        ></textarea>
                    </div>
                </div>

                {error && (
                    <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3 text-red-400 text-xs animate-in slide-in-from-top-2 duration-300">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                <button 
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-[#3200C1] to-[#37FFDB] hover:from-[#37FFDB] hover:to-[#3200C1] text-white font-black uppercase tracking-[0.2em] text-xs py-4 rounded-xl shadow-xl shadow-[#3200C1]/20 transition-all active:scale-95 flex items-center justify-center gap-2 mt-2 disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                    {isLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    )}
                    {isLoading ? "Enviando..." : "Enviar Consulta"}
                </button>
            </form>
        </div>
    );
}
