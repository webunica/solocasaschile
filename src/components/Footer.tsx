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
    Twitter,
    ArrowRight
} from "lucide-react";

export const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-[#3200C1] text-white pt-16 pb-8">
            <div className="max-w-[1600px] mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand & Info */}
                    <div className="flex flex-col gap-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-[#37FFDB] flex items-center justify-center shadow-lg shadow-[#37FFDB]/20">
                                <Hash className="w-6 h-6 text-[#3200C1]" />
                            </div>
                            <h2 className="text-2xl font-black tracking-tight">
                                solocasas<br /><span className="text-[#37FFDB]">chile.com</span>
                            </h2>
                        </div>
                        <p className="text-white/70 text-lg leading-relaxed max-w-xs">
                            La plataforma líder en comparación de modelos de casas y proyectos inmobiliarios en Chile. Encuentra tu hogar ideal con transparencia y datos reales.
                        </p>
                        <div className="flex items-center gap-4">
                            <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#37FFDB] hover:text-[#3200C1] transition-all duration-300">
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#37FFDB] hover:text-[#3200C1] transition-all duration-300">
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#37FFDB] hover:text-[#3200C1] transition-all duration-300">
                                <Linkedin className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                            Explorar
                            <span className="w-8 h-px bg-[#37FFDB]"></span>
                        </h3>
                        <ul className="flex flex-col gap-4">
                            {[
                                { name: "Inicio", href: "/" },
                                { name: "Modelos", href: "/#results" },
                                { name: "Blog", href: "/blog" },
                                { name: "Empresas", href: "#" },
                                { name: "Categorías", href: "#" }
                            ].map((item) => (
                                <li key={item.name}>
                                    <Link href={item.href} className="text-white/70 hover:text-[#37FFDB] flex items-center gap-2 group transition-colors">
                                        <ArrowRight className="w-4 h-4 opacity-0 -ml-6 group-hover:opacity-100 group-hover:ml-0 transition-all" />
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
                            <span className="w-8 h-px bg-[#37FFDB]"></span>
                        </h3>
                        <ul className="flex flex-col gap-6">
                            <li className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                                    <Mail className="w-5 h-5 text-[#37FFDB]" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs font-bold uppercase tracking-wider text-white/40">Email</span>
                                    <a href="mailto:contacto@solocasaschile.com" className="text-white/80 hover:text-[#37FFDB] transition-colors">
                                        contacto@solocasaschile.com
                                    </a>
                                </div>
                            </li>
                            <li className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                                    <Phone className="w-5 h-5 text-[#37FFDB]" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs font-bold uppercase tracking-wider text-white/40">Teléfono</span>
                                    <a href="tel:+56912345678" className="text-white/80 hover:text-[#37FFDB] transition-colors">
                                        +56 9 1234 5678
                                    </a>
                                </div>
                            </li>
                            <li className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                                    <MapPin className="w-5 h-5 text-[#37FFDB]" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs font-bold uppercase tracking-wider text-white/40">Ubicación</span>
                                    <span className="text-white/80">
                                        Santiago, Chile
                                    </span>
                                </div>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter / CTA */}
                    <div>
                        <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                            Suscríbete
                            <span className="w-8 h-px bg-[#37FFDB]"></span>
                        </h3>
                        <p className="text-white/70 mb-6">
                            Recibe las mejores ofertas y nuevos modelos directamente en tu correo.
                        </p>
                        <form className="relative group">
                            <input
                                type="email"
                                placeholder="tu@email.com"
                                className="w-full bg-white/5 border border-white/10 rounded-lg py-4 px-5 pr-14 text-white focus:outline-none focus:border-[#37FFDB] focus:bg-white/10 transition-all"
                            />
                            <button className="absolute right-2 top-2 bottom-2 aspect-square bg-[#37FFDB] text-[#3200C1] rounded-md flex items-center justify-center hover:scale-105 active:scale-95 transition-all">
                                <ArrowRight className="w-5 h-5" />
                            </button>
                        </form>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-white/40 text-sm">
                        © {currentYear} solocasaschile.com. Todos los derechos reservados.
                    </p>
                    <div className="flex items-center gap-2 text-white/60 text-sm">
                        <span>Desarrollado por</span>
                        <a
                            href="https://webunica.cl"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-black text-[#37FFDB] hover:underline"
                        >
                            webunica.cl
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};
