"use client";

import { useTransition } from "react";
import { toggleModelStatusAction } from "../model-actions";

interface Props {
    id: string;
    isActive: boolean;
}

export function ToggleModelButton({ id, isActive }: Props) {
    const [isPending, startTransition] = useTransition();

    const handleToggle = () => {
        startTransition(() => toggleModelStatusAction(id, isActive));
    };

    return (
        <button
            onClick={handleToggle}
            disabled={isPending}
            title={isActive ? "Desactivar propiedad" : "Activar propiedad"}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${isActive ? "bg-emerald-500" : "bg-slate-300"
                } ${isPending ? "opacity-50 cursor-wait" : ""}`}
        >
            <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition-transform duration-200 ${isActive ? "translate-x-5" : "translate-x-0"
                    }`}
            />
        </button>
    );
}
