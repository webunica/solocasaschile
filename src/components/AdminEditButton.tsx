import { Pencil } from "lucide-react";
import Link from "next/link";

export default function AdminEditButton({ documentId, documentType }: { documentId: string; documentType: string }) {
    // URL format for Sanity Studio V3: /studio/intent/edit/id=${documentId};type=${documentType}
    const editUrl = `/studio/intent/edit/id=${documentId};type=${documentType}`;

    return (
        <Link
            href={editUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-24 right-6 z-[100] bg-black text-[#37FFDB] w-14 h-14 rounded-full flex flex-col items-center justify-center shadow-[0_0_20px_rgba(0,0,0,0.3)] hover:scale-110 active:scale-95 transition-transform"
            title="Hacer ajustes en Sanity"
            aria-label="Editar documento en Sanity"
        >
            <Pencil className="w-5 h-5 mb-0.5" />
            <span className="text-[8px] font-black uppercase">Editar</span>
        </Link>
    );
}
