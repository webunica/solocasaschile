"use client";

import { useState, useTransition } from "react";
import { bulkCreateCompaniesAction } from "./bulk-create-action";
import { Zap, CheckCircle, Copy, X } from "lucide-react";

export default function BulkCreateButton({ pendingCount }: { pendingCount: number }) {
    const [isPending, startTransition] = useTransition();
    const [result, setResult] = useState<any>(null);
    const [copied, setCopied] = useState(false);

    const handleBulkCreate = () => {
        startTransition(async () => {
            const res = await bulkCreateCompaniesAction();
            setResult(res);
        });
    };

    const copyCredentials = () => {
        if (!result?.created) return;
        const lines = result.created.map((c: any) => `${c.company_name}\n  Email: ${c.email}\n  Clave: ${result.defaultPassword}`).join("\n\n");
        navigator.clipboard.writeText(lines);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (pendingCount === 0) return null;

    return (
        <div className="space-y-4">
            {/* Botón principal */}
            {!result && (
                <button
                    onClick={handleBulkCreate}
                    disabled={isPending}
                    className={`flex items-center gap-2 px-5 py-3 rounded-xl font-black text-sm transition-all shadow-md ${isPending
                            ? "bg-slate-200 text-slate-400 cursor-wait"
                            : "bg-[#3200C1] text-[#37FFDB] hover:bg-[#3200C1]/90 active:scale-95"
                        }`}
                >
                    <Zap className="w-4 h-4" />
                    {isPending ? `Creando ${pendingCount} cuentas…` : `Crear ${pendingCount} cuentas B2B automáticamente`}
                </button>
            )}

            {/* Resultado */}
            {result && (
                <div className={`rounded-2xl border p-5 ${result.error ? "bg-red-50 border-red-200" : "bg-emerald-50 border-emerald-200"}`}>
                    {result.error ? (
                        <p className="text-red-700 font-bold text-sm">⚠️ {result.error}</p>
                    ) : (
                        <div className="space-y-4">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                                    <p className="text-emerald-800 font-black text-sm">{result.message}</p>
                                </div>
                                <button onClick={() => setResult(null)} className="text-slate-400 hover:text-slate-600">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            {result.created?.length > 0 && (
                                <>
                                    <div className="bg-white rounded-xl border border-emerald-200 overflow-hidden">
                                        <div className="px-4 py-2.5 bg-emerald-100 border-b border-emerald-200 flex items-center justify-between">
                                            <div>
                                                <span className="text-xs font-black text-emerald-800 uppercase tracking-wide">Credenciales generadas</span>
                                                <span className="ml-2 text-xs text-emerald-600 font-medium">Contraseña por defecto: <strong>{result.defaultPassword}</strong></span>
                                            </div>
                                            <button
                                                onClick={copyCredentials}
                                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors"
                                            >
                                                <Copy className="w-3 h-3" />
                                                {copied ? "¡Copiado!" : "Copiar todo"}
                                            </button>
                                        </div>
                                        <div className="max-h-64 overflow-y-auto divide-y divide-slate-100">
                                            {result.created.map((c: any) => (
                                                <div key={c.email} className="px-4 py-2.5 flex items-center justify-between gap-4 hover:bg-slate-50">
                                                    <span className="text-xs font-bold text-slate-700 truncate">{c.company_name}</span>
                                                    <span className="text-xs text-slate-500 font-mono shrink-0">{c.email}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <p className="text-xs text-emerald-700">
                                        💡 Comparte estas credenciales con cada empresa. Podrán cambiar su contraseña desde el perfil.
                                    </p>
                                </>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
