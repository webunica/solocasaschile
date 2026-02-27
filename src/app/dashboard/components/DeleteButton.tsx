"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { deleteModelAction } from "../actions";

export function DeleteButton({ id, name }: { id: string; name: string }) {
    const [isPending, startTransition] = useTransition();

    const handleDelete = () => {
        if (confirm(`¿Estás seguro de que deseas eliminar permanentemente el modelo "${name}"? Esta acción no se puede deshacer.`)) {
            startTransition(async () => {
                const result = await deleteModelAction(id);
                if (result.error) {
                    alert("Ocurrió un error al eliminar: " + result.error);
                }
            });
        }
    };

    return (
        <button
            onClick={handleDelete}
            disabled={isPending}
            className={`p-2 rounded-lg transition-colors ${isPending
                    ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                    : "text-red-500 hover:bg-red-50"
                }`}
            title="Eliminar Propiedad"
        >
            <Trash2 className="w-4 h-4" />
        </button>
    );
}
