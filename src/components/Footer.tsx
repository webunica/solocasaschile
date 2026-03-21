"use client";

import React from "react";
import Link from "next/link";
import {
    Hash,
    Mail,
    Phone,
    MapPin,
    Instagram,
    Facebook,
    Linkedin,
    ArrowRight
} from "lucide-react";

interface FooterProps {
    contactPhones?: string[];
}

export const Footer = ({ contactPhones = ["+56 9 1234 5678"] }: FooterProps) => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-[#3200C1] text-white pt-16 pb-8">
            <div className="max-w-[1600px] mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand & Info */}
                    <div className="flex flex-col gap-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-[#37FFDB] flex items-center justify-center shadow-lg shadow-[#37FFDB]/20">
                                <Hash className="w-6 h-6 text-[#3200C1]" aria-hidden="true" />
                            </div>
                            <h2 className="text-2xl font-black tracking-tight">
                                solocasas<br /><span className="text-[#37FFDB]">chile.com</span>
                            </h2>
                        </div>
                        <p className="text-white/70 text-lg leading-relaxed max-w-xs">
                            La plataforma líder en comparación de modelos de casas y proyectos inmobiliarios en Chile. Encuentra tu hogar ideal con transparencia y datos reales.
                        </p>
                        <div className="flex items-center gap-4" role="list" aria-label="Redes sociales">
                            <a
                                href="https://www.instagram.com/solocasaschile"
                                target="_blank"
                                rel="noopener noreferrer"
                                role="listitem"
                                aria-label="Síguenos en Instagram"
                                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#37FFDB] hover:text-[#3200C1] transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-[#37FFDB] focus-visible:outline-none"
                            >
                                <Instagram className="w-5 h-5" aria-hidden="true" />
                            </a>
                            <a
                                href="https://www.facebook.com/solocasaschile"
                                target="_blank"
                                rel="noopener noreferrer"
                                role="listitem"
                                aria-label="Síguenos en Facebook"
                                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#37FFDB] hover:text-[#3200C1] transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-[#37FFDB] focus-visible:outline-none"
                            >
                                <Facebook className="w-5 h-5" aria-hidden="true" />
                            </a>
                            <a
                                href="https://www.linkedin.com/company/solocasaschile"
                                target="_blank"
                                rel="noopener noreferrer"
                                role="listitem"
                                aria-label="Síguenos en LinkedIn"
                                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#37FFDB] hover:text-[#3200C1] transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-[#37FFDB] focus-visible:outline-none"
                            >
                                <Linkedin className="w-5 h-5" aria-hidden="true" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                            Explorar
                            <span className="w-8 h-px bg-[#37FFDB]" aria-hidden="true"></span>
                        </h3>
                        <ul className="flex flex-col gap-4">
                            {[
                                { name: "Inicio", href: "/" },
                                { name: "Modelos", href: "/#results" },
                                { name: "Empresas", href: "/profesionales" },
                                { name: "Planes y Precios", href: "/registro" },
                                { name: "Blog", href: "/blog" },
                                { name: "Términos y Condiciones", href: "/terminos" }
                            ].map((item) => (
                                <li key={item.name}>
                                    <Link href={item.href} className="text-white/70 hover:text-[#37FFDB] flex items-center gap-2 group transition-colors focus-visible:ring-2 focus-visible:ring-[#37FFDB] focus-visible:outline-none rounded-sm">
                                        <ArrowRight className="w-4 h-4 opacity-0 -ml-6 group-hover:opacity-100 group-hover:ml-0 transition-all motion-reduce:transition-none" aria-hidden="true" />
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Data */}
                    <div>
                        <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                            Contacto
                            <span className="w-8 h-px bg-[#37FFDB]" aria-hidden="true"></span>
                        </h3>
                        <ul className="flex flex-col gap-6">
                            <li className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center shrink-0" aria-hidden="true">
                                    <Mail className="w-5 h-5 text-[#37FFDB]" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs font-bold uppercase tracking-wider text-white/40">Email</span>
                                    <a href="mailto:contacto@solocasaschile.com" className="text-white/80 hover:text-[#37FFDB] transition-colors focus-visible:ring-2 focus-visible:ring-[#37FFDB] focus-visible:outline-none rounded-sm">
                                        contacto@solocasaschile.com
                                    </a>
                                </div>
                            </li>
                            <li className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center shrink-0" aria-hidden="true">
                                    <Phone className="w-5 h-5 text-[#37FFDB]" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs font-bold uppercase tracking-wider text-white/40">Teléfono{contactPhones.length > 1 ? 's' : ''}</span>
                                    {contactPhones.map((phone, idx) => (
                                        <a key={idx} href={`tel:${phone.replace(/\s+/g, '')}`} className="text-white/80 hover:text-[#37FFDB] transition-colors focus-visible:ring-2 focus-visible:ring-[#37FFDB] focus-visible:outline-none rounded-sm">
                                            {phone}
                                        </a>
                                    ))}
                                </div>
                            </li>
                            <li className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center shrink-0" aria-hidden="true">
                                    <MapPin className="w-5 h-5 text-[#37FFDB]" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs font-bold uppercase tracking-wider text-white/40">Ubicación</span>
                                    <span className="text-white/80">Santiago, Chile</span>
                                </div>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                            Suscríbete
                            <span className="w-8 h-px bg-[#37FFDB]" aria-hidden="true"></span>
                        </h3>
                        <p className="text-white/70 mb-6" id="newsletter-desc">
                            Recibe las mejores ofertas y nuevos modelos directamente en tu correo.
                        </p>
                        <form
                            aria-describedby="newsletter-desc"
                            onSubmit={(e) => {
                                e.preventDefault();
                                // TODO: conectar con servicio de newsletter
                            }}
                            className="relative group"
                        >
                            <label htmlFor="newsletter-email" className="sr-only">
                                Tu correo electrónico
                            </label>
                            <input
                                id="newsletter-email"
                                type="email"
                                name="email"
                                autoComplete="email"
                                placeholder="tu@email.com…"
                                required
                                spellCheck={false}
                                className="w-full bg-white/5 border border-white/10 rounded-lg py-4 px-5 pr-14 text-white focus-visible:outline-none focus-visible:border-[#37FFDB] focus-visible:bg-white/10 transition-colors"
                            />
                            <button
                                type="submit"
                                aria-label="Suscribirse al newsletter"
                                className="absolute right-2 top-2 bottom-2 aspect-square bg-[#37FFDB] text-[#3200C1] rounded-md flex items-center justify-center hover:scale-105 active:scale-95 transition-transform motion-reduce:transition-none focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
                            >
                                <ArrowRight className="w-5 h-5" aria-hidden="true" />
                            </button>
                        </form>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-white/40 text-sm">
                        © {currentYear} solocasaschile.com. Todos los derechos reservados.
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
                        <Link
                            href="/terminos"
                            className="text-white/50 hover:text-[#37FFDB] transition-colors focus-visible:ring-2 focus-visible:ring-[#37FFDB] focus-visible:outline-none rounded-sm"
                        >
                            Términos y Condiciones
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};
