import { useState, useEffect } from "react";
import { useQueryStates, parseAsInteger, parseAsString } from "nuqs";
import { Search, Map, Bed, Bath, Hash, Banknote, SearchIcon, Filter, X } from "lucide-react";

interface FiltersSidebarProps {
    companies: { company_name: string }[];
    categories: { category: string }[];
}

export function FiltersSidebar({ companies, categories }: FiltersSidebarProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useQueryStates({
        company: parseAsString,
        category: parseAsString,
        minSurface: parseAsInteger,
        bedrooms: parseAsInteger,
        bathrooms: parseAsInteger,
        minPrice: parseAsInteger,
        maxPrice: parseAsInteger,
    });

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
        setIsOpen(false);
    };

    const resetFilters = () => {
        setLocal({ company: "", category: "", minSurface: "", bedrooms: "", bathrooms: "", minPrice: "", maxPrice: "" });
        setQuery({ company: null, category: null, minSurface: null, bedrooms: null, bathrooms: null, minPrice: null, maxPrice: null }, { shallow: false });
        setIsOpen(false);
    };

    const toggleSidebar = () => setIsOpen(!isOpen);

    return (
        <>
            {/* Mobile Toggle Button (Sticky at the bottom for accessibility) */}
            <div className="xl:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-[60]">
                <button
                    onClick={toggleSidebar}
                    className="flex items-center gap-2 bg-[#3200C1] text-white px-6 py-4 rounded-full shadow-2xl font-black text-sm active:scale-95 transition-transform"
                >
                    <Filter className="w-5 h-5" />
                    Filtrar Modelos
                </button>
            </div>

            {/* Backdrop for Mobile */}
            {isOpen && (
                <div
                    className="xl:hidden fixed inset-0 bg-[#3200C1]/40 backdrop-blur-sm z-[70] transition-opacity"
                    onClick={toggleSidebar}
                />
            )}

            {/* Sidebar / Drawer */}
            <aside className={`
                fixed inset-y-0 left-0 z-[80] w-[85%] max-w-sm bg-white p-8 overflow-y-auto transition-transform duration-500 transform
                ${isOpen ? "translate-x-0" : "-translate-x-full"}
                xl:relative xl:translate-x-0 xl:inset-auto xl:z-auto xl:w-80 xl:max-h-[calc(100vh-3rem)] xl:flex xl:flex-col xl:gap-8 xl:sticky xl:top-6 xl:rounded-2xl xl:border xl:border-slate-100 xl:shadow-lg
            `}>
                <div className="flex justify-between items-center mb-8 xl:mb-0">
                    <div>
                        <h2 className="text-2xl xl:text-xl font-black tracking-tight text-[#3200C1]">Filtros</h2>
                        <p className="text-sm font-bold text-slate-400">Encuentra tu casa ideal</p>
                    </div>
                    <button
                        onClick={toggleSidebar}
                        className="xl:hidden p-2 text-slate-400 hover:text-[#3200C1] transition-colors"
                    >
                        <X className="w-8 h-8" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 flex flex-col h-full mt-6 xl:mt-0">
                    <div className="space-y-6 flex-1">
                        <div className="space-y-2">
                            <label htmlFor="company" className="text-[10px] font-black uppercase tracking-widest text-[#3200C1]/60 flex items-center gap-2">
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

                        <div className="space-y-2">
                            <label htmlFor="category" className="text-[10px] font-black uppercase tracking-widest text-[#3200C1]/60 flex items-center gap-2">
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

                        <div className="space-y-2">
                            <label htmlFor="minSurface" className="text-[10px] font-black uppercase tracking-widest text-[#3200C1]/60 flex items-center gap-2">
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

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label htmlFor="bedrooms" className="text-[10px] font-black uppercase tracking-widest text-[#3200C1]/60 flex items-center gap-1.5">
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
                            <div className="space-y-2">
                                <label htmlFor="bathrooms" className="text-[10px] font-black uppercase tracking-widest text-[#3200C1]/60 flex items-center gap-1.5">
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

                        <div className="space-y-4 pt-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-[#3200C1]/60 flex items-center gap-2">
                                <Banknote className="w-3.5 h-3.5 text-[#37FFDB]" /> Presupuesto (CLP)
                            </label>
                            <div className="flex flex-col gap-3">
                                <input
                                    type="number"
                                    aria-label="Precio mínimo"
                                    value={local.minPrice}
                                    onChange={(e) => setLocal({ ...local, minPrice: e.target.value })}
                                    placeholder="Precio mínimo..."
                                    className="brand-input"
                                />
                                <input
                                    type="number"
                                    aria-label="Precio máximo"
                                    value={local.maxPrice}
                                    onChange={(e) => setLocal({ ...local, maxPrice: e.target.value })}
                                    placeholder="Precio máximo..."
                                    className="brand-input"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-slate-50 flex flex-col gap-3 pb-safe">
                        <button
                            type="submit"
                            className="w-full py-5 bg-[#3200C1] text-white rounded-2xl flex items-center justify-center gap-3 font-black shadow-xl shadow-[#3200C1]/20 hover:-translate-y-1 transition-all"
                        >
                            <SearchIcon className="w-5 h-5" /> Aplicar Filtros
                        </button>
                        <button
                            type="button"
                            onClick={resetFilters}
                            className="w-full py-4 bg-slate-50 text-slate-500 rounded-2xl flex items-center justify-center font-bold hover:bg-slate-100 transition-all border border-slate-100"
                        >
                            Limpiar
                        </button>
                    </div>
                </form>
            </aside>
        </>
    );
}
