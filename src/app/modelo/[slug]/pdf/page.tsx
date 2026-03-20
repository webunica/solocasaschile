import { sanityClient } from "@/lib/sanity.client";
import { notFound } from "next/navigation";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import { Bed, Bath, Scale, Hash, MapPin, CheckCircle2 } from "lucide-react";

type Props = {
    params: Promise<{ slug: string }>
}

export default async function ModelPdfPage({ params }: Props) {
    const { slug } = await params;

    const house = await sanityClient.fetch(
        `*[_type == "houseModel" && slug.current == $slug][0]{
            ...,
            "company": *[_type == "companyUser" && company_name == ^.company_name][0]{
                company_name, logo, plan, is_verified, whatsapp_number
            }
        }`,
        { slug },
        { cache: "no-store" }
    );

    if (!house) return notFound();

    const plan = house.company?.plan || 'free';
    const isPro = plan === 'pro' || plan === 'elite';

    if (!isPro) {
        return (
            <div className="p-20 text-center">
                <h1 className="text-2xl font-bold text-red-600">Ficha PDF no disponible</h1>
                <p className="mt-4">Esta función solo está disponible para planes Pro y Elite.</p>
            </div>
        );
    }

    return (
        <div className="bg-white min-h-screen p-10 max-w-[800px] mx-auto text-slate-900 printable-area">
            {/* Header / Logo */}
            <div className="flex justify-between items-start border-b-2 border-slate-900 pb-8 mb-8">
                <div className="space-y-2">
                    <h1 className="text-4xl font-black uppercase tracking-tighter">{house.model_name}</h1>
                    <div className="flex items-center gap-2 text-slate-500 font-bold">
                        <MapPin className="w-4 h-4" />
                        <span>{house.company_name}</span>
                        {house.company?.is_verified && <CheckCircle2 className="w-4 h-4 text-slate-900" />}
                    </div>
                </div>
                <div className="relative w-32 h-32 bg-slate-50 rounded-xl overflow-hidden shadow-inner flex items-center justify-center p-4">
                    {house.company?.logo ? (
                        <Image 
                            src={(sanityClient as any).imageUrlFor(house.company.logo).url()} 
                            alt={house.company_name}
                            fill
                            className="object-contain p-2"
                        />
                    ) : (
                        <span className="text-2xl font-black text-slate-300">LOGO</span>
                    )}
                </div>
            </div>

            {/* Hero Image */}
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden mb-10 bg-slate-100 border border-slate-200">
                {house.images?.[0] ? (
                    <Image 
                        src={(sanityClient as any).imageUrlFor(house.images[0]).url()} 
                        alt={house.model_name}
                        fill
                        className="object-cover"
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-slate-300">Imagen de referencia</div>
                )}
            </div>

            {/* Price & Primary Specs */}
            <div className="grid grid-cols-2 gap-8 mb-12">
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex flex-col justify-center">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Precio desde</p>
                    <p className="text-4xl font-black text-slate-900">{formatPrice(house.price_from, house.currency || 'CLP')}</p>
                    <p className="text-xs text-slate-400 font-medium mt-1">* Sujeto a variaciones según zona y empresa.</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-white border border-slate-100 rounded-2xl flex flex-col items-center justify-center shadow-sm">
                        <Scale className="w-5 h-5 text-slate-400 mb-2" />
                        <span className="text-sm font-black">{house.surface_m2} m²</span>
                        <span className="text-[10px] uppercase font-bold text-slate-400">Superficie</span>
                    </div>
                    <div className="p-4 bg-white border border-slate-100 rounded-2xl flex flex-col items-center justify-center shadow-sm">
                        <Bed className="w-5 h-5 text-slate-400 mb-2" />
                        <span className="text-sm font-black">{house.bedrooms}</span>
                        <span className="text-[10px] uppercase font-bold text-slate-400">Dormitorios</span>
                    </div>
                </div>
            </div>

            {/* Description */}
            <div className="mb-12">
                <h2 className="text-lg font-black text-slate-800 uppercase tracking-tight mb-4 border-l-4 border-slate-900 pl-4">Descripción del Modelo</h2>
                <p className="text-slate-600 leading-relaxed text-sm whitespace-pre-wrap italic">
                    {house.description || "No hay una descripción disponible para este modelo, pero puedes contactar directamente a la constructora para más detalles."}
                </p>
            </div>

            {/* Specs Table */}
            <div className="mb-12">
                <h2 className="text-lg font-black text-slate-800 uppercase tracking-tight mb-4 border-l-4 border-slate-900 pl-4">Ficha Técnica</h2>
                <div className="grid grid-cols-2 border-y border-slate-100 text-sm">
                    <div className="py-3 pr-4 border-r border-slate-100 flex justify-between font-bold text-slate-500 uppercase text-[10px]">Material Estructural <span>{house.structure_material || 'Madera'}</span></div>
                    <div className="py-3 pl-4 flex justify-between font-bold text-slate-500 uppercase text-[10px]">Baños <span>{house.bathrooms}</span></div>
                    <div className="py-3 pr-4 border-t border-r border-slate-100 flex justify-between font-bold text-slate-500 uppercase text-[10px]">Formatos <span>{house.delivery_modes?.join(', ') || 'Kit'}</span></div>
                    <div className="py-3 pl-4 border-t flex justify-between font-bold text-slate-500 uppercase text-[10px]">Categoría <span>{house.category}</span></div>
                </div>
            </div>

            {/* Footer / QR / Contact */}
            <div className="mt-auto pt-10 border-t-2 border-slate-100 flex justify-between items-end">
                <div>
                   <p className="text-xs font-black text-slate-400 uppercase tracking-tight">Cortesía de</p>
                   <p className="text-xl font-black text-slate-900">SoloCasasChile.com</p>
                </div>
                <div className="text-right">
                    <p className="text-sm font-bold">Contacta a la constructora:</p>
                    <p className="text-lg font-black">{house.company?.whatsapp_number ? `+${house.company.whatsapp_number}` : 'Vía SoloCasasChile.com'}</p>
                </div>
            </div>

            {/* Hidden Print Script */}
            <script dangerouslySetInnerHTML={{ __html: `window.onload = () => { setTimeout(() => window.print(), 500); }` }} />
            
            <style dangerouslySetInnerHTML={{ __html: `
                @media print {
                    body { background: white; margin: 0; padding: 0; }
                    .printable-area { box-shadow: none !important; border: none !important; width: 100% !important; max-width: 100% !important; }
                    @page { margin: 1cm; }
                }
            ` }} />
        </div>
    );
}
