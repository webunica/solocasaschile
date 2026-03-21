"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, LogIn, Building2 } from "lucide-react";
import SiteLogo from "@/components/SiteLogo";

const NAV_LINKS = [
    { href: "/", label: "Inicio" },
    { href: "/empresas-construccion", label: "Empresas" },
    { href: "/blog", label: "Publicaciones" },
    { href: "/registro", label: "Planes y Precios" },
];

export const Header = () => {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    // Cerrar menú al navegar
    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    // Evitar scroll del body cuando el menú está abierto
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => { document.body.style.overflow = ""; };
    }, [isOpen]);

    return (
        <>
            <header className="border-b border-slate-100 bg-white/90 backdrop-blur-md sticky top-0 z-50 w-full">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 grid grid-cols-3 items-center">

                    {/* Izquierda: Logo */}
                    <div className="flex items-center">
                        <SiteLogo />
                    </div>

                    {/* Centro: Nav (solo desktop) */}
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

                    {/* Derecha: Acceso + CTA */}
                    <div className="flex items-center justify-end gap-2 sm:gap-3">
                        {/* Link de acceso */}
                        <Link
                            href="/dashboard"
                            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-bold text-slate-600 hover:text-[#3200C1] hover:bg-slate-50 transition-all whitespace-nowrap"
                        >
                            <LogIn className="w-4 h-4" />
                            <span className="hidden lg:inline">Acceso</span>
                        </Link>

                        {/* CTA principal */}
                        <Link
                            href="/registro"
                            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#3200C1] text-[#37FFDB] text-sm font-black hover:brightness-110 transition-all whitespace-nowrap"
                        >
                            <Building2 className="w-4 h-4" />
                            <span className="hidden md:inline">Publicar empresa</span>
                            <span className="md:hidden">Publicar</span>
                        </Link>

                        {/* Botón hamburguesa (solo mobile) */}
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
                            aria-expanded={isOpen}
                            className="md:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
                        >
                            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </div>
            </header>

            {/* Overlay oscuro */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
                    onClick={() => setIsOpen(false)}
                    aria-hidden="true"
                />
            )}

            {/* Panel menú mobile */}
            <div
                className={`fixed top-0 right-0 h-full w-72 bg-white z-50 shadow-2xl transform transition-transform duration-300 ease-in-out md:hidden flex flex-col ${
                    isOpen ? "translate-x-0" : "translate-x-full"
                }`}
                role="dialog"
                aria-label="Menú de navegación"
            >
                {/* Cabecera del panel */}
                <div className="flex items-center justify-between px-6 h-16 border-b border-slate-100">
                    <SiteLogo />
                    <button
                        onClick={() => setIsOpen(false)}
                        aria-label="Cerrar menú"
                        className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Links de navegación */}
                <nav className="flex flex-col p-6 gap-1 flex-1" aria-label="Menú móvil">
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

                {/* Footer del panel: botones de acción */}
                <div className="p-6 border-t border-slate-100 flex flex-col gap-3">
                    <Link
                        href="/dashboard"
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
};
