"use client";

import { FileText } from "lucide-react";

export default function PrintPdfButton() {
    return (
        <button
            onClick={() => window.print()}
            className="w-full flex items-center justify-center gap-2 bg-white border-2 border-slate-200 text-slate-700 py-3 rounded-xl font-bold hover:bg-slate-50 transition-colors"
        >
            <FileText className="w-4 h-4" /> Guardar Ficha PDF
        </button>
    );
}

