import React from "react";
import Link from "next/link";
import SiteLogo from "@/components/SiteLogo";

export const Header = () => {
    return (
        <header className="border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                <div className="flex items-center gap-8">
                    <div className="flex items-center gap-3">
                        <SiteLogo />
                    </div>

                    <nav className="hidden md:flex items-center gap-6" aria-label="Navegación principal">
                        <Link href="/" className="text-sm font-bold text-[#3200C1] hover:text-[#37FFDB] transition-colors">
                            Inicio
                        </Link>
                        <Link href="/blog" className="text-sm font-bold text-[#3200C1] hover:text-[#37FFDB] transition-colors">
                            Publicaciones
                        </Link>
                        <Link href="/registro" className="text-sm font-bold text-[#3200C1] hover:text-[#37FFDB] transition-colors">
                            Planes y Precios
                        </Link>
                    </nav>
                </div>

                <Link
                    href="/registro"
                    className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-[4px] bg-[#3200C1] text-[#37FFDB] text-sm font-black hover:brightness-110 transition-all whitespace-nowrap"
                >
                    Publicar Propiedad
                </Link>
            </div>
        </header>
    );
};
