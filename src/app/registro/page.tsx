import type { Metadata } from "next";
import { sanityServerClient } from "@/lib/sanity.server";
import { RegistroForm, RegistrationBenefits } from "./RegistroComponents";
import { CheckCircle, ArrowLeft, Building2, Zap, MessageCircle, MapPin } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Registra tu Constructora | SolocasasChile",
    description: "Únete a la plataforma líder de casas prefabricadas en Chile. Publica tus modelos y recibe cotizaciones reales.",
};

async function getCompanies() {
    return await sanityServerClient.fetch(`*[_type == "companyUser" && is_active == true] | order(region asc, company_name asc) {
    company_name,
    region,
    "slug": slug.current
  }`);
}

export default async function RegistroPage() {
    const companies = await getCompanies();

    // Group companies by region
    const groupedCompanies = companies.reduce((acc: any, company: any) => {
        const region = company.region || "Otras Regiones";
        if (!acc[region]) acc[region] = [];
        acc[region].push(company);
        return acc;
    }, {});

    const regions = Object.keys(groupedCompanies).sort();

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#3200C1] via-[#3200C1]/90 to-[#37FFDB]/20">
            <div className="max-w-7xl mx-auto px-4 py-12">
                {/* Hero Text */}
                <div className="text-center mb-16">
                    <span className="inline-block px-4 py-1.5 rounded-full bg-[#37FFDB]/20 text-[#37FFDB] text-xs font-black uppercase tracking-widest mb-4 border border-[#37FFDB]/30">
                        🎁 Promoción Especial: 4 Meses Gratis
                    </span>
                    <h1 className="text-4xl md:text-6xl font-black text-white mb-4 [text-wrap:balance]">
                        La Red de Constructoras más grande de <span className="text-[#37FFDB]">Chile</span>
                    </h1>
                    <p className="text-white/70 max-w-2xl mx-auto leading-relaxed text-lg">
                        Ya somos {companies.length} empresas registradas. Sube tus modelos y empieza a recibir prospectos calificados hoy mismo.
                    </p>
                </div>

                <div className="grid lg:grid-cols-[1fr_420px] gap-12 items-start">
                    <div className="space-y-12">
                        <RegistrationBenefits />

                        {/* Companies List By Region */}
                        <div className="bg-white/5 backdrop-blur-md rounded-[2.5rem] p-8 md:p-12 border border-white/10 shadow-2xl">
                            <h2 className="text-2xl md:text-3xl font-black text-white mb-8 flex items-center gap-3">
                                <MapPin className="w-8 h-8 text-[#37FFDB]" />
                                Constructoras por Región
                            </h2>
                            
                            <div className="grid md:grid-cols-2 gap-x-12 gap-y-10">
                                {regions.map((region) => (
                                    <div key={region} className="space-y-4">
                                        <h3 className="text-[#37FFDB] font-black uppercase tracking-wider text-xs border-b border-white/10 pb-2">
                                            {region}
                                        </h3>
                                        <ul className="space-y-2">
                                            {groupedCompanies[region].map((company: any) => (
                                                <li key={company.slug} className="text-white/80 text-sm font-medium hover:text-[#37FFDB] transition-colors flex items-center gap-2">
                                                    <div className="w-1 h-1 rounded-full bg-[#37FFDB]/40" />
                                                    {company.company_name}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Plans Section */}
                        <div className="grid md:grid-cols-2 gap-8">
                                {/* Plan Pro */}
                                <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col">
                                    <div className="flex items-center justify-between mb-5">
                                        <div>
                                            <span className="text-xs font-black uppercase tracking-widest text-[#3200C1]">Ideal para crecer</span>
                                            <h3 className="text-xl font-black text-slate-800">Plan Pro</h3>
                                        </div>
                                    </div>
                                    <ul className="space-y-3 mb-8">
                                        {[
                                            "✨ Hasta 20 modelos publicados",
                                            "✨ Hasta 10 fotos por modelo",
                                            "✨ 1 Video por modelo",
                                            "✨ Leads directos a WhatsApp",
                                            "✨ Empresa verificada",
                                            "✨ PDF automático por modelo",
                                        ].map((f) => (
                                            <li key={f} className="text-sm text-slate-600 font-medium">✅ {f}</li>
                                        ))}
                                    </ul>
                                    <a
                                        href="https://wa.me/56964130601?text=Hola,%20me%20interesa%20el%20Plan%20Pro"
                                        target="_blank"
                                        className="w-full mt-auto py-4 bg-[#25D366] text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:brightness-110 transition-all"
                                    >
                                        <MessageCircle className="w-5 h-5" />
                                        Me interesa el Pro
                                    </a>
                                </div>

                                {/* Plan Elite */}
                                <div className="bg-slate-900 rounded-3xl p-8 border border-slate-800 shadow-xl relative overflow-hidden flex flex-col">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#37FFDB]/10 rounded-full blur-3xl" />
                                    <div className="relative z-10 flex flex-col h-full">
                                        <div className="flex items-center justify-between mb-5">
                                            <div>
                                                <span className="text-xs font-black uppercase tracking-widest text-[#37FFDB]">Máxima Visibilidad</span>
                                                <h3 className="text-xl font-black text-white">Plan Elite</h3>
                                            </div>
                                        </div>
                                        <ul className="space-y-3 mb-8">
                                            {[
                                                "🌟 Todo lo de Pro",
                                                "🌟 Modelos ilimitados",
                                                "🌟 Exhibición rotativa Home",
                                                "🌟 Comparador activo",
                                                "🌟 Landing premium propia",
                                            ].map((f) => (
                                                <li key={f} className="text-sm text-white/80 font-medium">{f}</li>
                                            ))}
                                        </ul>
                                        <a
                                            href="https://wa.me/56964130601?text=Hola,%20me%20interesa%20el%20Plan%20Elite"
                                            target="_blank"
                                            className="w-full mt-auto py-4 bg-[#37FFDB] text-[#3200C1] rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:brightness-110 transition-all"
                                        >
                                            <MessageCircle className="w-5 h-5" />
                                            Me interesa el Elite
                                        </a>
                                    </div>
                                </div>
                        </div>
                    </div>

                    {/* Registration Form Sticky */}
                    <RegistroForm />
                </div>

                {/* FAQ Section */}
                <div className="mt-32">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-black text-white mb-4">Preguntas Frecuentes</h2>
                        <p className="text-white/60 text-lg">Resolvemos tus dudas antes de comenzar</p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
                        {[
                            {
                                q: "¿Puedo comenzar gratis?",
                                a: "¡Sí! Ofrecemos un plan inicial completamente gratuito por 4 meses que te permite subir hasta 3 modelos para probar la plataforma."
                            },
                            {
                                q: "¿Qué pasa después de 4 meses?",
                                a: "Podrás elegir entre mantener un plan básico o escalar a Pro/Elite para seguir recibiendo leads y beneficios avanzados."
                            },
                            {
                                q: "¿Los leads llegan directo a WhatsApp?",
                                a: "Sí, en los planes Pro y Elite, los interesados pueden contactarte directamente a tu WhatsApp comercial."
                            },
                            {
                                q: "¿Ustedes suben mis modelos?",
                                a: "Nuestro sistema es auto-gestionable. Tendrás un panel intuitivo para subir fotos, precios y descripciones en minutos."
                            }
                        ].map((item, idx) => (
                            <div key={idx} className="bg-white/5 border border-white/10 p-8 rounded-3xl hover:bg-white/[0.08] transition-colors">
                                <h4 className="font-black text-white mb-3 text-lg">{item.q}</h4>
                                <p className="text-white/50 text-sm leading-relaxed">{item.a}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Final CTA */}
                <div className="mt-32 mb-20 text-center">
                    <h2 className="text-4xl md:text-6xl font-black text-white mb-8 [text-wrap:balance]">
                        Únete a las mejores constructoras de Chile
                    </h2>
                    <p className="text-white/60 mb-12 text-lg">Tu próximo gran proyecto empieza aquí.</p>
                </div>
            </div>
        </div>
    );
}
