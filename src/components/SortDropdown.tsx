"use client";

import { useQueryState } from "nuqs";
import { ArrowDownAZ, ArrowUpZA, ArrowDown10, ArrowUp01 } from "lucide-react";

export function SortDropdown() {
    const [sort, setSort] = useQueryState("sort", { defaultValue: "price_asc", shallow: false });

    return (
        <div className="flex items-center gap-2">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ordenar:</span>
            <div className="relative">
                <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    className="appearance-none bg-white border border-slate-100 text-[#3200C1] rounded-[4px] py-2 pl-3 pr-8 text-xs font-black hover:border-[#37FFDB] focus:border-[#37FFDB] outline-none transition-all cursor-pointer shadow-sm"
                >
                    <option value="price_asc">Menor Precio</option>
                    <option value="price_desc">Mayor Precio</option>
                    <option value="surface_desc">Mayor m²</option>
                    <option value="surface_asc">Menor m²</option>
                </select>
                <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-[#37FFDB] flex items-center justify-center">
                    {sort === "price_asc" && <ArrowUp01 className="w-3.5 h-3.5" />}
                    {sort === "price_desc" && <ArrowDown10 className="w-4 h-4" />}
                    {sort === "surface_desc" && <ArrowDownAZ className="w-4 h-4" />}
                    {sort === "surface_asc" && <ArrowUpZA className="w-4 h-4" />}
                </div>
            </div>
        </div>
    );
}
