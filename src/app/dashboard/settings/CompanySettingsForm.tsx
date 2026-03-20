"use client";

import { useState } from "react";
import { Save, Upload, Loader2, Info, CheckCircle2, Copy, Check, ExternalLink } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { updateCompanyProfileAction } from "./actions";

interface Props {
    company: any;
}

export default function CompanySettingsForm({ company }: Props) {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const router = useRouter();

    const [formData, setFormData] = useState({
        description: company.description || "",
        whatsapp_number: company.whatsapp_number || "",
        meeting_url: company.meeting_url || "",
        years_experience: company.years_experience || 0,
        projects_completed_count: company.projects_completed_count || 0,
        badges: company.badges || [],
    });

    const [copied, setCopied] = useState(false);

    const publicUrl = `https://www.solocasaschile.com/profesional/${company.slug?.current || ""}`;

    const copyUrl = () => {
        navigator.clipboard.writeText(publicUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const isElite = company.plan === 'elite';
    const isPro = company.plan === 'pro' || isElite;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            const result = await updateCompanyProfileAction(company._id, formData);
            if (result.success) {
                setMessage({ type: 'success', text: "Perfil actualizado correctamente." });
                router.refresh();
            } else {
                setMessage({ type: 'error', text: result.error || "Error al actualizar." });
            }
        } catch (err: any) {
            setMessage({ type: 'error', text: err.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-8 space-y-6">
                    {/* INFO PLAN */}
                    <div className="flex items-center justify-between p-4 bg-[#3200C1]/5 rounded-2xl border border-[#3200C1]/10">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-[#3200C1] flex items-center justify-center text-white font-black">
                                {company.plan === 'elite' ? '👑' : company.plan === 'pro' ? '🚀' : '🌟'}
                            </div>
                            <div>
                                <p className="text-xs font-black uppercase text-[#3200C1]">Tu Plan Actual</p>
                                <p className="font-bold text-slate-800">
                                    {company.plan === 'elite' ? 'Plan Elite' : company.plan === 'pro' ? 'Plan Pro' : 'Plan Inicial'}
                                </p>
                            </div>
                        </div>
                        <div className="text-right">
                             <p className="text-[10px] text-slate-400 font-bold uppercase">Estado</p>
                             <p className="text-sm font-black text-emerald-600 flex items-center gap-1 justify-end">
                                <CheckCircle2 className="w-4 h-4" /> Activo
                             </p>
                        </div>
                    </div>

                    {/* PUBLIC LINK */}
                    <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Link Público de tu Perfil</label>
                        <div className="flex gap-2">
                            <input 
                                type="text" 
                                readOnly 
                                value={publicUrl}
                                className="flex-1 bg-white px-4 py-2 rounded-lg border border-slate-200 text-xs font-medium text-slate-500" 
                            />
                            <button 
                                type="button"
                                onClick={copyUrl}
                                className="px-4 py-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2 text-xs font-bold"
                            >
                                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                                {copied ? "Copiado" : "Copiar"}
                            </button>
                            <Link 
                                href={publicUrl} 
                                target="_blank"
                                className="px-4 py-2 bg-[#3200C1] text-white rounded-lg hover:bg-[#250091] transition-colors flex items-center gap-2 text-xs font-bold"
                            >
                                <ExternalLink className="w-3.5 h-3.5" />
                                Ver Perfil
                            </Link>
                        </div>
                        <p className="text-[10px] text-slate-400">Comparte este link en tus redes sociales para mostrar todo tu catálogo de casas.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Descripción */}
                        <div className="col-span-1 md:col-span-2 space-y-2">
                            <label className="text-sm font-black text-slate-700 uppercase flex items-center gap-2">
                                Descripción de la Empresa
                                {isPro ? (
                                    <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">Pro Feature</span>
                                ) : (
                                    <span className="text-[10px] bg-slate-100 text-slate-400 px-2 py-0.5 rounded-full">Limitado</span>
                                )}
                            </label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Cuéntanos sobre tu constructora, años de experiencia, zonas de cobertura..."
                                rows={4}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#3200C1] transition-all text-sm"
                            />
                            <p className="text-[10px] text-slate-400">Máximo 500 caracteres. Aparecerá en tu perfil público.</p>
                        </div>

                        {/* Stats - Experience */}
                        <div className="space-y-2">
                            <label className="text-sm font-black text-slate-700 uppercase">Años de Experiencia</label>
                            <input
                                type="number"
                                value={formData.years_experience}
                                onChange={(e) => setFormData({ ...formData, years_experience: parseInt(e.target.value) || 0 })}
                                placeholder="Ej: 15"
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#3200C1] transition-all text-sm"
                            />
                        </div>

                        {/* Stats - Projects */}
                        <div className="space-y-2">
                            <label className="text-sm font-black text-slate-700 uppercase">Casas/Proyectos Realizados</label>
                            <input
                                type="number"
                                value={formData.projects_completed_count}
                                onChange={(e) => setFormData({ ...formData, projects_completed_count: parseInt(e.target.value) || 0 })}
                                placeholder="Ej: 80"
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#3200C1] transition-all text-sm"
                            />
                        </div>

                        {/* WhatsApp */}
                        <div className="space-y-2">
                            <label className="text-sm font-black text-slate-700 uppercase">WhatsApp de Contacto</label>
                            <input
                                type="text"
                                value={formData.whatsapp_number}
                                onChange={(e) => setFormData({ ...formData, whatsapp_number: e.target.value })}
                                placeholder="Ej: 56912345678"
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#3200C1] transition-all text-sm"
                            />
                        </div>

                        {/* Meeting URL */}
                        <div className="space-y-2">
                            <label className="text-sm font-black text-slate-700 uppercase flex items-center gap-2">
                                Enlace de Reuniones (Calendly)
                                <span className={`text-[10px] px-2 py-0.5 rounded-full ${isPro ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-400'}`}>
                                    Pro/Elite
                                </span>
                            </label>
                            <input
                                type="url"
                                disabled={!isPro}
                                value={formData.meeting_url}
                                onChange={(e) => setFormData({ ...formData, meeting_url: e.target.value })}
                                placeholder="https://calendly.com/tu-empresa"
                                className={`w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#3200C1] transition-all text-sm ${!isPro && 'bg-slate-50 opacity-60 cursor-not-allowed'}`}
                            />
                        </div>

                        {/* Badges - Pro Only */}
                        <div className="col-span-1 md:col-span-2 space-y-4 pt-4 border-t border-slate-100">
                             <label className="text-sm font-black text-slate-700 uppercase flex items-center gap-2">
                                Insignias de Calidad y Confianza
                                <span className={`text-[10px] px-2 py-0.5 rounded-full ${isPro ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-400'}`}>
                                    Pro/Elite
                                </span>
                            </label>
                            <p className="text-xs text-slate-400">Selecciona hasta 3 insignias para mostrar en tu cabecera de perfil.</p>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                                {[
                                    { id: 'iso_9001', label: 'ISO 9001' },
                                    { id: 'quality_cert', label: 'Calidad Certificada' },
                                    { id: 'sustainable', label: 'Sustentable' },
                                    { id: 'featured_company', label: 'Empresa Destacada' },
                                    { id: 'extended_warranty', label: 'Garantía Extendida' }
                                ].map((badge) => (
                                    <label 
                                        key={badge.id}
                                        className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                                            formData.badges?.includes(badge.id)
                                            ? 'bg-[#3200C1]/5 border-[#3200C1] text-[#3200C1]'
                                            : 'bg-white border-slate-100 text-slate-600 hover:border-slate-200'
                                        } ${!isPro && 'opacity-50 cursor-not-allowed'}`}
                                    >
                                        <input 
                                            type="checkbox"
                                            disabled={!isPro}
                                            checked={formData.badges?.includes(badge.id)}
                                            onChange={(e) => {
                                                const current = formData.badges || [];
                                                if (e.target.checked) {
                                                    setFormData({ ...formData, badges: [...current, badge.id] });
                                                } else {
                                                    setFormData({ ...formData, badges: current.filter((b: string) => b !== badge.id) });
                                                }
                                            }}
                                            className="hidden"
                                        />
                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formData.badges?.includes(badge.id) ? 'bg-[#3200C1] border-[#3200C1]' : 'border-slate-300'}`}>
                                            {formData.badges?.includes(badge.id) && <Check className="w-3 h-3 text-white" />}
                                        </div>
                                        <span className="text-xs font-bold">{badge.label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="px-8 py-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                    {message && (
                        <div className={`px-4 py-2 rounded-lg text-xs font-bold ${message.type === 'success' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                            {message.text}
                        </div>
                    )}
                    <button
                        type="submit"
                        disabled={loading}
                        className="ml-auto px-6 py-3 bg-[#3200C1] text-white rounded-xl font-bold flex items-center gap-2 hover:bg-[#250091] transition-all disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        Guardar Cambios
                    </button>
                </div>
            </div>

            {/* UPGRADE TIP */}
            {company.plan !== 'elite' && (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                        <Info className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                        <h4 className="font-black text-amber-900 text-sm">¿Quieres destacar más?</h4>
                        <p className="text-xs text-amber-700 mt-1 leading-relaxed">
                            {company.plan === 'free' 
                                ? "Sube al plan PRO para habilitar el botón de reuniones, videos en tus modelos y el sello de empresa verificada." 
                                : "Sube al plan ELITE para tener tu propia LANDING PREMIUM y aparecer en la página principal."}
                        </p>
                        <button className="mt-3 text-[#3200C1] font-black text-[10px] uppercase hover:underline">Contactar Ejecutivo para Upgrade</button>
                    </div>
                </div>
            )}
        </form>
    );
}
