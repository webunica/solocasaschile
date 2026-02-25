"use client";

import { useQueryState } from "nuqs";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

export function Pagination({ totalCount, limit = 20 }: { totalCount: number, limit?: number }) {
    const [pageParam, setPageParam] = useQueryState("page", { defaultValue: "1", shallow: false });
    const currentPage = parseInt(pageParam) || 1;
    const totalPages = Math.ceil(totalCount / limit);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient || totalPages <= 1) return null;

    return (
        <div className="flex items-center justify-center gap-2 mt-12 mb-8">
            <button
                onClick={() => setPageParam(String(Math.max(1, currentPage - 1)))}
                disabled={currentPage <= 1}
                className="p-2 md:p-2.5 rounded-[4px] bg-white border border-slate-100 text-[#3200C1] hover:bg-slate-50 hover:border-[#37FFDB] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm active:scale-95"
                title="Página Anterior"
            >
                <ChevronLeft className="w-5 h-5 text-[#37FFDB]" />
            </button>

            <div className="flex items-center px-4 rounded-[4px] bg-white border border-slate-100 h-[40px] md:h-[42px] shadow-sm text-sm">
                <span className="font-extrabold text-[#3200C1]">
                    Página {currentPage} de {totalPages}
                </span>
            </div>

            <button
                onClick={() => setPageParam(String(Math.min(totalPages, currentPage + 1)))}
                disabled={currentPage >= totalPages}
                className="p-2 md:p-2.5 rounded-[4px] bg-white border border-slate-100 text-[#3200C1] hover:bg-slate-50 hover:border-[#37FFDB] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm active:scale-95"
                title="Siguiente Página"
            >
                <ChevronRight className="w-5 h-5 text-[#37FFDB]" />
            </button>
        </div>
    );
}
