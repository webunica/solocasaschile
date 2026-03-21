"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, LogIn, Building2, Hash } from "lucide-react";

const NAV_LINKS = [
    { href: "/", label: "Inicio" },
    { href: "/empresas-construccion", label: "Empresas" },
    { href: "/blog", label: "Publicaciones" },
    { href: "/registro", label: "Planes y Precios" },
];

interface Props {
    siteName: string;
    logoUrl: string | null;
}

function Logo({ siteName, logoUrl }: Props) {
    if (logoUrl) {
        return (
            <Link href="/" aria-label={`${siteName} - Inicio`}>
                {/* h-11 = ~44px, 25% más grande que h-9 */}
                <img
                    src={logoUrl}
                    alt={siteName}
                    className="h-11 w-auto object-contain"
                />
            </Link>
        );
    }
    return (
        <Link href="/" className="flex items-center gap-3" aria-label={`${siteName} - Inicio`}>
            {/* Icono 25% más grande: w-10 h-10 */}
            <div className="w-10 h-10 rounded-lg bg-[#37FFDB] flex items-center justify-center shadow-sm shrink-0">
                <Hash className="w-6 h-6 text-[#3200C1]" aria-hidden="true" />
            </div>
            <span className="text-xl font-bold text-[#3200C1] whitespace-nowrap">
                {siteName.toLowerCase()}
            </span>
        </Link>
    );
}

export default function HeaderClient({ siteName, logoUrl }: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    // Cerrar menú al cambiar de ruta
    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    // Bloquear scroll del body cuando el menú está abierto
    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [isOpen]);

    return (
        <>
            <header className="border-b border-slate-100 bg-white/90 backdrop-blur-md sticky top-0 z-50 w-full">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 grid grid-cols-3 items-center">

                    {/* Columna 1: Logo */}
                    <div className="flex items-center">
                        <Logo siteName={siteName} logoUrl={logoUrl} />
                    </div>

                    {/* Columna 2: Nav centrado (solo desktop) */}
                    <nav
                        className="hidden md:flex items-center justify-center gap-6"
                        aria-label="Navegación principal"
                    >
                        {NAV_LINKS.map((link) => {
                            const isActive = pathname === link.href;
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`text-sm font-bold transition-colors whitespace-nowrap relative group ${
                                        isActive
                                            ? "text-[#3200C1]"
                                            : "text-slate-600 hover:text-[#3200C1]"
                                    }`}
                                >
                                    {link.label}
                                    <span
                                        className={`absolute -bottom-1 left-0 h-0.5 bg-[#37FFDB] transition-all duration-300 ${
                                            isActive ? "w-full" : "w-0 group-hover:w-full"
                                        }`}
                                    />
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Columna 3: Acceso + CTA + Hamburguesa */}
                    <div className="flex items-center justify-end gap-2 sm:gap-3">

                        {/* Botón Acceso (desktop) */}
                        <Link
                            href="/login"
                            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-bold text-slate-600 hover:text-[#3200C1] hover:bg-slate-50 transition-all whitespace-nowrap"
                        >
                            <LogIn className="w-4 h-4" />
                            <span className="hidden lg:inline">Acceso</span>
                        </Link>

                        {/* CTA "Publicar empresa" (desktop) */}
                        <Link
                            href="/registro"
                            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#3200C1] text-[#37FFDB] text-sm font-black hover:brightness-110 transition-all whitespace-nowrap"
                        >
                            <Building2 className="w-4 h-4" />
                            <span className="hidden lg:inline">Publicar empresa</span>
                            <span className="lg:hidden">Publicar</span>
                        </Link>

                        {/* Botón hamburguesa — 25% más grande: w-10 h-10 */}
                        <button
                            type="button"
                            onClick={() => setIsOpen((prev) => !prev)}
                            aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
                            aria-expanded={isOpen}
                            aria-controls="mobile-menu"
                            className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
                        >
                            {isOpen
                                ? <X className="w-6 h-6" />
                                : <Menu className="w-6 h-6" />
                            }
                        </button>
                    </div>
                </div>
            </header>

            {/* Overlay oscuro */}
            <div
                aria-hidden="true"
                onClick={() => setIsOpen(false)}
                className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 md:hidden ${
                    isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                }`}
            />

            {/* Panel slide-in mobile */}
            <div
                id="mobile-menu"
                role="dialog"
                aria-label="Menú de navegación"
                aria-modal="true"
                className={`fixed top-0 right-0 h-full w-72 bg-white z-50 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out md:hidden ${
                    isOpen ? "translate-x-0" : "translate-x-full"
                }`}
            >
                {/* Cabecera del panel */}
                <div className="flex items-center justify-between px-5 h-16 border-b border-slate-100 shrink-0">
                    <Logo siteName={siteName} logoUrl={logoUrl} />
                    <button
                        type="button"
                        onClick={() => setIsOpen(false)}
                        aria-label="Cerrar menú"
                        className="flex items-center justify-center w-10 h-10 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Links de navegación */}
                <nav className="flex flex-col p-5 gap-1 flex-1 overflow-y-auto" aria-label="Menú móvil">
                    {NAV_LINKS.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`px-4 py-3 rounded-xl font-bold text-sm transition-all ${
                                    isActive
                                        ? "bg-[#3200C1] text-white"
                                        : "text-slate-700 hover:bg-slate-50 hover:text-[#3200C1]"
                                }`}
                            >
                                {link.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* Botones de acción al pie */}
                <div className="p-5 border-t border-slate-100 flex flex-col gap-3 shrink-0">
                    <Link
                        href="/login"
                        className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-[#3200C1] text-[#3200C1] font-black text-sm hover:bg-[#3200C1]/5 transition-all"
                    >
                        <LogIn className="w-4 h-4" />
                        Acceso Empresa
                    </Link>
                    <Link
                        href="/registro"
                        className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#3200C1] text-[#37FFDB] font-black text-sm hover:brightness-110 transition-all"
                    >
                        <Building2 className="w-4 h-4" />
                        Publicar mi empresa
                    </Link>
                </div>
            </div>
        </>
    );
}
