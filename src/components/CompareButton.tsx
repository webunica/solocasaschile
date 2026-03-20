"use client";

import { useState, useEffect } from "react";
import { Scale, Check, X } from "lucide-react";
import Link from "next/link";

interface Props {
    modelId: string;
}

export default function CompareButton({ modelId }: Props) {
    const [selected, setSelected] = useState(false);
    const [compareList, setCompareList] = useState<string[]>([]);

    useEffect(() => {
        const saved = localStorage.getItem("compare_list");
        if (saved) {
            const list = JSON.parse(saved);
            setCompareList(list);
            setSelected(list.includes(modelId));
        }
    }, [modelId]);

    const toggle = () => {
        const saved = localStorage.getItem("compare_list");
        let list = saved ? JSON.parse(saved) : [];
        
        if (selected) {
            list = list.filter((id: string) => id !== modelId);
        } else {
            if (list.length >= 3) {
                alert("Solo puedes comparar hasta 3 modelos simultáneamente.");
                return;
            }
            list.push(modelId);
        }
        
        localStorage.setItem("compare_list", JSON.stringify(list));
        setCompareList(list);
        setSelected(!selected);
        
        // Disparar evento para que la barra flotante se entere
        window.dispatchEvent(new Event("storage_compare"));
    };

    return (
        <button
            onClick={toggle}
            className={`p-2.5 rounded-xl border-2 transition-all flex items-center justify-center gap-2 font-black text-xs ${
                selected 
                ? "bg-[#3200C1] border-[#3200C1] text-white" 
                : "border-slate-200 text-slate-400 hover:border-[#3200C1] hover:text-[#3200C1]"
            }`}
            title="Añadir al comparador"
        >
            {selected ? <Check className="w-3.5 h-3.5" /> : <Scale className="w-3.5 h-3.5" />}
            {selected ? "Seleccionado" : "Comparar"}
        </button>
    );
}
