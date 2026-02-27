"use client";

import { useTransition } from "react";
import { toggleCompanyStatusAction } from "./company-actions";

type Props = {
    id: string;
    isActive: boolean;
};

export default function ToggleStatusButton({ id, isActive }: Props) {
    const [isPending, startTransition] = useTransition();

    const handleToggle = () => {
        startTransition(async () => {
            const result = await toggleCompanyStatusAction(id, isActive);
            if (result.error) {
                alert(result.error);
            }
        });
    };

    return (
        <button
            onClick={handleToggle}
            disabled={isPending}
            title={isActive ? "Desactivar cuenta" : "Activar cuenta"}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none ${isPending ? "opacity-50 cursor-wait" : "cursor-pointer"
                } ${isActive ? "bg-[#37FFDB]" : "bg-slate-200"}`}
        >
            <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-300 ${isActive ? "translate-x-6" : "translate-x-1"
                    }`}
            />
        </button>
    );
}
