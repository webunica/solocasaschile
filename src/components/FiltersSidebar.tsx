"use client";

import { useState, useEffect } from "react";
import { useQueryStates, parseAsInteger, parseAsString } from "nuqs";
import { Search, Map, Bed, Bath, Hash, Banknote, SearchIcon } from "lucide-react";

interface FiltersSidebarProps {
    companies: { company_name: string }[];
    categories: { category: string }[];
}

export function FiltersSidebar({ companies, categories }: FiltersSidebarProps) {
    const [query, setQuery] = useQueryStates({
        company: parseAsString,
        category: parseAsString,
        minSurface: parseAsInteger,
        bedrooms: parseAsInteger,
        bathrooms: parseAsInteger,
        minPrice: parseAsInteger,
        maxPrice: parseAsInteger,
    });

    // Estado local para los campos antes de hacer click en Buscar
    const [local, setLocal] = useState({
        company: query.company || "",
        category: query.category || "",
        minSurface: query.minSurface || "",
        bedrooms: query.bedrooms || "",
        bathrooms: query.bathrooms || "",
        minPrice: query.minPrice || "",
        maxPrice: query.maxPrice || "",
    });

    // Sincronizar si cambia desde la URL o al resetear
    useEffect(() => {
        setLocal({
            company: query.company || "",
            category: query.category || "",
            minSurface: query.minSurface || "",
            bedrooms: query.bedrooms || "",
            bathrooms: query.bathrooms || "",
            minPrice: query.minPrice || "",
            maxPrice: query.maxPrice || "",
        });
    }, [query.company, query.category, query.minSurface, query.bedrooms, query.bathrooms, query.minPrice, query.maxPrice]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setQuery({
            company: local.company || null,
            category: local.category || null,
            minSurface: local.minSurface ? Number(local.minSurface) : null,
            bedrooms: local.bedrooms ? Number(local.bedrooms) : null,
            bathrooms: local.bathrooms ? Number(local.bathrooms) : null,
            minPrice: local.minPrice ? Number(local.minPrice) : null,
            maxPrice: local.maxPrice ? Number(local.maxPrice) : null,
        }, { shallow: false });
    };

    const resetFilters = () => {
        setLocal({ company: "", category: "", minSurface: "", bedrooms: "", bathrooms: "", minPrice: "", maxPrice: "" });
        setQuery({ company: null, category: null, minSurface: null, bedrooms: null, bathrooms: null, minPrice: null, maxPrice: null }, { shallow: false });
    };

    return (
        <aside className="bg-white border border-slate-100 p-6 rounded-[4px] flex flex-col gap-6 sticky top-6 max-h-[calc(100vh-3rem)] overflow-y-auto w-full md:w-80 shrink-0 shadow-sm">
            <div>
                <h2 className="text-xl font-extrabold tracking-tight text-[#3200C1] mb-1">Filtros</h2>
                <p className="text-sm font-bold text-slate-400">Encuentra tu casa ideal</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 flex flex-col flex-1">
                <div className="space-y-4 flex-1">
                    <div className="space-y-1.5">
                        <label htmlFor="company" className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                            <Hash className="w-3.5 h-3.5 text-[#37FFDB]" /> Fabricante
                        </label>
                        <select
                            id="company"
                            value={local.company}
                            onChange={(e) => setLocal({ ...local, company: e.target.value })}
                            className="brand-input"
                        >
                            <option value="">Cualquier Fabricante</option>
                            {companies.map((c) => (
                                <option key={c.company_name} value={c.company_name}>
                                    {c.company_name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-1.5">
                        <label htmlFor="category" className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                            <Search className="w-3.5 h-3.5 text-[#37FFDB]" /> Categoría / Material
                        </label>
                        <select
                            id="category"
                            value={local.category}
                            onChange={(e) => setLocal({ ...local, category: e.target.value })}
                            className="brand-input"
                        >
                            <option value="">Todas las categorías</option>
                            {categories.map((c) => (
                                <option key={c.category} value={c.category}>
                                    {c.category}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-1.5">
                        <label htmlFor="minSurface" className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                            <Map className="w-3.5 h-3.5 text-[#37FFDB]" /> Superficie Mín. (m²)
                        </label>
                        <input
                            type="number"
                            id="minSurface"
                            value={local.minSurface}
                            onChange={(e) => setLocal({ ...local, minSurface: e.target.value })}
                            placeholder="Ej. 60"
                            className="brand-input"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <label htmlFor="bedrooms" className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-1.5">
                                <Bed className="w-3.5 h-3.5 text-[#37FFDB]" /> Dormit.
                            </label>
                            <select
                                id="bedrooms"
                                value={local.bedrooms}
                                onChange={(e) => setLocal({ ...local, bedrooms: e.target.value })}
                                className="brand-input"
                            >
                                <option value="">Cualquiera</option>
                                {[1, 2, 3, 4, 5].map((n) => (
                                    <option key={n} value={n}>{n}+</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <label htmlFor="bathrooms" className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-1.5">
                                <Bath className="w-3.5 h-3.5 text-[#37FFDB]" /> Baños
                            </label>
                            <select
                                id="bathrooms"
                                value={local.bathrooms}
                                onChange={(e) => setLocal({ ...local, bathrooms: e.target.value })}
                                className="brand-input"
                            >
                                <option value="">Cualquiera</option>
                                {[1, 2, 3, 4].map((n) => (
                                    <option key={n} value={n}>{n}+</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="space-y-3 pt-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                            <Banknote className="w-3.5 h-3.5 text-[#37FFDB]" /> Presupuesto (CLP)
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            <input
                                type="number"
                                aria-label="Precio mínimo"
                                value={local.minPrice}
                                onChange={(e) => setLocal({ ...local, minPrice: e.target.value })}
                                placeholder="Min $..."
                                className="brand-input"
                            />
                            <input
                                type="number"
                                aria-label="Precio máximo"
                                value={local.maxPrice}
                                onChange={(e) => setLocal({ ...local, maxPrice: e.target.value })}
                                placeholder="Max $..."
                                className="brand-input"
                            />
                        </div>
                    </div>
                </div>

                <div className="pt-6 border-t border-slate-50 flex flex-col gap-3">
                    <button
                        type="submit"
                        className="brand-button-primary"
                    >
                        <SearchIcon className="w-4 h-4" /> Buscar
                    </button>
                    <button
                        type="button"
                        onClick={resetFilters}
                        className="brand-button-secondary"
                    >
                        Limpiar Filtros
                    </button>
                </div>
            </form>
        </aside>
    );
}
