"use client";

import { useState, useEffect } from "react";
import { Scale, X, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function CompareBar() {
    const [list, setList] = useState<string[]>([]);
    const [visible, setVisible] = useState(false);

    const updateList = () => {
        const saved = localStorage.getItem("compare_list");
        if (saved) {
            const parsed = JSON.parse(saved);
            setList(parsed);
            setVisible(parsed.length > 0);
        } else {
            setVisible(false);
        }
    };

    useEffect(() => {
        updateList();
        window.addEventListener("storage_compare", updateList);
        return () => window.removeEventListener("storage_compare", updateList);
    }, []);

    const clear = () => {
        localStorage.removeItem("compare_list");
        setList([]);
        setVisible(false);
        window.dispatchEvent(new Event("storage_compare"));
    };

    if (!visible) return null;

    return (
        <div className="fixed bottom-8 left-0 right-0 z-[100] px-6 animate-in slide-in-from-bottom-10 fade-in duration-500">
            <div className="max-w-2xl mx-auto bg-[#3200C1] text-white rounded-[32px] shadow-2xl p-4 md:p-6 flex items-center justify-between border border-white/20">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-[#3200C1] shadow-lg">
                        <Scale className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="font-black text-lg leading-tight">{list.length} {list.length === 1 ? 'modelo' : 'modelos'} listos</p>
                        <button onClick={clear} className="text-[10px] uppercase font-black text-[#37FFDB] hover:underline">Limpiar selección</button>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Link 
                        href={`/comparador?ids=${list.join(',')}`}
                        className={`px-8 py-3 rounded-xl font-black text-sm flex items-center gap-2 transition-all ${
                            list.length >= 2 
                            ? "bg-[#37FFDB] text-[#3200C1] shadow-lg shadow-[#37FFDB]/20 hover:scale-105 active:scale-95" 
                            : "bg-white/10 text-white cursor-pointer opacity-50"
                        }`}
                        title={list.length < 2 ? "Selecciona al menos 2 modelos" : "Ver comparativa"}
                    >
                        {list.length < 2 ? "Añadir otro" : "Comparar Ahora"}
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                    <button 
                        onClick={() => setVisible(false)}
                        className="p-3 bg-white/10 rounded-xl hover:bg-white/20 border border-white/10"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
