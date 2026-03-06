"use client";

import { SearchIcon } from "lucide-react";
import { useQueryState } from "nuqs";
import { useState, useEffect } from "react";

export function BlogSearch() {
    const [search, setSearch] = useQueryState("search", {
        shallow: false,
    });
    const [localValue, setLocalValue] = useState(search || "");

    useEffect(() => {
        setLocalValue(search || "");
    }, [search]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setSearch(localValue || null);
    };

    return (
        <div className="p-8 bg-slate-50 rounded-2xl border border-slate-100">
            <h3 className="text-xl font-black text-[#3200C1] mb-6">Buscar artículos</h3>
            <form onSubmit={handleSearch} className="relative">
                <input
                    type="text"
                    value={localValue}
                    onChange={(e) => setLocalValue(e.target.value)}
                    placeholder="Ej: Casas SIP..."
                    className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-[#37FFDB] outline-none transition-all"
                />
                <button
                    type="submit"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#3200C1]"
                >
                    <SearchIcon className="w-5 h-5" />
                </button>
            </form>
        </div>
    );
}
