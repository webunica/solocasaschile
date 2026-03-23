"use client";

import { useState } from "react";
import { Building2, KeyRound, PlusCircle, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ToggleStatusButton from "./ToggleStatusButton";

const PLAN_CONFIG: Record<string, { label: string; uf: string; clp: string; color: string }> = {
    free: { label: "Plan Inicial", uf: "0 UF", clp: "$0", color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
    pro: { label: "Plan Pro", uf: "-", clp: "$34.900", color: "bg-blue-100 text-blue-700 border-blue-200" },
    elite: { label: "Plan Elite", uf: "-", clp: "$79.900", color: "bg-purple-100 text-purple-700 border-purple-200" },
};

interface CompaniesTableProps {
    allNames: string[];
    b2bMap: Record<string, any>;
    modelCounts: Record<string, number>;
}

export default function CompaniesTable({ allNames, b2bMap, modelCounts }: CompaniesTableProps) {
    const router = useRouter();
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [isDeleting, setIsDeleting] = useState(false);

    // Only allow selecting companies that actually have a B2B record (since those are the ones in Sanity as documents)
    const selectableCompanies = allNames.filter(name => b2bMap[name]?._id && b2bMap[name]?.role !== "admin");

    const toggleSelect = (id: string) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const toggleSelectAll = () => {
        if (selectedIds.length === selectableCompanies.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(selectableCompanies.map(name => b2bMap[name]._id));
        }
    };

    const handleBulkDelete = async () => {
        if (selectedIds.length === 0) return;
        if (!confirm(`¿Estás seguro de que deseas eliminar ${selectedIds.length} empresas? Esta acción no se puede deshacer.`)) return;

        setIsDeleting(true);
        try {
            const res = await fetch("/api/companies/delete", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ids: selectedIds }),
            });

            if (res.ok) {
                alert(`${selectedIds.length} empresas eliminadas correctamente.`);
                setSelectedIds([]);
                router.refresh();
            } else {
                const err = await res.json();
                alert(`Error: ${err.error || "No se pudo eliminar"}`);
            }
        } catch (error) {
            console.error("Delete error:", error);
            alert("Ocurrió un error al intentar eliminar.");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <h3 className="font-bold text-slate-800">Todas las Empresas ({allNames.length})</h3>
                    {selectedIds.length > 0 && (
                        <button
                            onClick={handleBulkDelete}
                            disabled={isDeleting}
                            className="flex items-center gap-2 px-3 py-1.5 bg-red-50 text-red-600 border border-red-100 rounded-lg text-xs font-bold hover:bg-red-500 hover:text-white transition-all disabled:opacity-50"
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                            Eliminar seleccionadas ({selectedIds.length})
                        </button>
                    )}
                </div>
                <span className="text-xs text-slate-400">Directorio unificado de empresas</span>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-slate-500 bg-slate-50 uppercase">
                        <tr>
                            <th className="px-6 py-4 w-10">
                                <input
                                    type="checkbox"
                                    className="rounded border-slate-300 text-[#3200C1] focus:ring-[#3200C1]"
                                    checked={selectedIds.length > 0 && selectedIds.length === selectableCompanies.length}
                                    onChange={toggleSelectAll}
                                />
                            </th>
                            <th className="px-6 py-4 font-bold">Empresa</th>
                            <th className="px-6 py-4 font-bold">Correo / Plan</th>
                            <th className="px-6 py-4 font-bold text-center">Modelos</th>
                            <th className="px-6 py-4 font-bold text-center">Estado</th>
                            <th className="px-6 py-4 font-bold text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {allNames.map((companyName) => {
                            const b2b = b2bMap[companyName];
                            const hasB2B = !!b2b;
                            const isActive = hasB2B ? b2b.is_active !== false : null;
                            const isAdminRole = hasB2B && b2b.role === "admin";
                            const plan = b2b ? (PLAN_CONFIG[b2b.plan] || PLAN_CONFIG.free) : null;
                            const count = modelCounts[companyName] || b2b?.model_count || 0;

                            return (
                                <tr key={companyName} className={`hover:bg-slate-50 transition-colors ${hasB2B && !isActive ? "opacity-30" : ""}`}>
                                    <td className="px-6 py-4">
                                        {hasB2B && !isAdminRole && (
                                            <input
                                                type="checkbox"
                                                className="rounded border-slate-300 text-[#3200C1] focus:ring-[#3200C1]"
                                                checked={selectedIds.includes(b2b._id)}
                                                onChange={() => toggleSelect(b2b._id)}
                                            />
                                        )}
                                    </td>
                                    {/* Empresa */}
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200 overflow-hidden text-[#3200C1]">
                                                {b2b?.logo_url
                                                    ? <img src={b2b.logo_url} alt="" className="w-full h-full object-cover" />
                                                    : <Building2 className="w-4 h-4" />
                                                }
                                            </div>
                                            <div>
                                                <span className="font-bold text-slate-800 block leading-tight">{companyName}</span>
                                                {isAdminRole && (
                                                    <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Superadmin</span>
                                                )}
                                                {!hasB2B && (
                                                    <span className="text-[10px] font-bold text-slate-400">Sin cuenta B2B</span>
                                                )}
                                            </div>
                                        </div>
                                    </td>

                                    {/* Correo / Plan */}
                                    <td className="px-6 py-4">
                                        {hasB2B ? (
                                            <div>
                                                <p className="text-xs text-slate-500 font-medium mb-1">{b2b.email}</p>
                                                {isAdminRole ? (
                                                    <span className="px-2.5 py-1 text-xs font-black rounded-full border bg-amber-100 text-amber-700 border-amber-200">Superadmin</span>
                                                ) : plan ? (
                                                    <span className={`px-2.5 py-1 text-xs font-black rounded-full border ${plan.color}`}>
                                                        {plan.label}
                                                    </span>
                                                ) : null}
                                            </div>
                                        ) : (
                                            <span className="text-xs text-slate-400 italic font-medium">—</span>
                                        )}
                                    </td>

                                    {/* Modelos */}
                                    <td className="px-6 py-4 text-center">
                                        <span className="font-black text-lg text-slate-700">{count}</span>
                                    </td>

                                    {/* Estado */}
                                    <td className="px-6 py-4">
                                        {hasB2B && !isAdminRole ? (
                                            <div className="flex flex-col items-center gap-1">
                                                <ToggleStatusButton id={b2b._id} isActive={isActive!} />
                                            </div>
                                        ) : !hasB2B ? (
                                            <div className="flex justify-center">
                                                <span className="px-2 py-1 text-[8px] font-black uppercase rounded-lg bg-slate-100 text-slate-500 border border-slate-200">Sin cuenta</span>
                                            </div>
                                        ) : (
                                            <div className="flex justify-center font-bold text-slate-300">—</div>
                                        )}
                                    </td>

                                    {/* Acciones */}
                                    <td className="px-6 py-4 text-right">
                                        {hasB2B ? (
                                            <Link
                                                href={`/dashboard/companies/edit/${b2b._id}`}
                                                className="p-2 hover:text-amber-500 hover:bg-amber-50 rounded-lg transition-colors inline-flex"
                                                title="Editar empresa"
                                            >
                                                <KeyRound className="w-4 h-4" />
                                            </Link>
                                        ) : (
                                            <Link
                                                href={`/dashboard/companies/create?name=${encodeURIComponent(companyName)}`}
                                                className="p-2 hover:text-[#3200C1] hover:bg-[#3200C1]/5 rounded-lg transition-colors inline-flex"
                                                title="Crear cuenta B2B para esta empresa"
                                            >
                                                <PlusCircle className="w-4 h-4" />
                                            </Link>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
