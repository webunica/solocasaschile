"use client";

import { useTransition } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { deleteProjectAction } from "../actions";

export default function DeleteProjectButton({ id }: { id: string }) {
    const [isPending, startTransition] = useTransition();

    const handleDelete = () => {
        if (confirm("¿Estás seguro de que quieres eliminar esta obra? Esta acción no se puede deshacer.")) {
            startTransition(async () => {
                const result = await deleteProjectAction(id);
                if (result.error) {
                    alert(result.error);
                }
            });
        }
    };

    return (
        <button 
            onClick={handleDelete}
            disabled={isPending}
            className="p-2.5 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 transition-all disabled:opacity-50"
        >
            {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
        </button>
    );
}
