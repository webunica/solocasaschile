"use client";

import { FileText } from "lucide-react";
import { useParams } from "next/navigation";

export default function PrintPdfButton() {
    const params = useParams();
    const slug = params.slug;

    return (
        <button
            onClick={() => window.open(`/modelo/${slug}/pdf`, '_blank')}
            className="w-full flex items-center justify-center gap-2 bg-white border-2 border-slate-200 text-slate-700 py-3 rounded-xl font-bold hover:bg-slate-100 transition-colors"
        >
            <FileText className="w-4 h-4" /> Generar Ficha PDF
        </button>
    );
}

