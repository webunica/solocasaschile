"use client";

import { useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, UploadCloud, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { createModelAction } from "../actions";
import { useSession } from "next-auth/react";

const MAX_PHOTO_MB = 3;
const MAX_PHOTO_BYTES = MAX_PHOTO_MB * 1024 * 1024;

export default function AddModelPage() {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [photoError, setPhotoError] = useState<string | null>(null);

    const { data: session } = useSession();

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        const oversized = files.filter(f => f.size > MAX_PHOTO_BYTES);
        if (oversized.length > 0) {
            setPhotoError(
                `${oversized.length} foto${oversized.length > 1 ? 's' : ''} supera${oversized.length === 1 ? '' : 'n'} los ${MAX_PHOTO_MB}MB permitidos: ${oversized.map(f => f.name).join(", ")}`
            );
        } else {
            setPhotoError(null);
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (photoError) return;
        const formData = new FormData(e.currentTarget);

        const companyName = session?.user?.name || "Desconocido";
        formData.append("company_name", companyName);

        startTransition(async () => {
            const result = await createModelAction(formData);
            if (result.error) {
                alert(result.error);
            } else {
                router.push("/dashboard");
            }
        });
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/dashboard" className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-[#3200C1] hover:bg-slate-50 transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div className="flex-1">
                    <h2 className="text-2xl font-black text-slate-800">Añadir Nuevo Modelo</h2>
                    <p className="text-slate-500 text-sm">Completa los campos para publicar tu nueva casa en el comparador.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-white border text-sm border-slate-200 rounded-2xl shadow-sm p-8 space-y-8">

                <section>
                    <h3 className="text-lg font-bold text-[#3200C1] mb-6">Detalles Básicos</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-slate-700 font-bold mb-2">Nombre del Modelo</label>
                            <input required name="model_name" type="text" placeholder="Ej. Casa Roble 50m2" className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-[#3200C1] focus:outline-none" />
                        </div>
                        <div>
                            <label className="block text-slate-700 font-bold mb-2">Categoría Principal</label>
                            <select name="category" className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-[#3200C1] focus:outline-none bg-white">
                                <option value="Casas Modulares">Casas Modulares</option>
                                <option value="Casas SIP">Casas SIP</option>
                                <option value="Cabañas de Madera">Cabañas de Madera</option>
                                <option value="Tiny Houses">Tiny Houses</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-slate-700 font-bold mb-2">Superficie (m²)</label>
                            <input required name="surface_m2" type="number" step="0.1" placeholder="Ej. 120" className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-[#3200C1] focus:outline-none" />
                        </div>
                        <div>
                            <label className="block text-slate-700 font-bold mb-2">Precio &quot;Desde&quot; (CLP)</label>
                            <input required name="price_from" type="number" placeholder="Ej. 15000000" className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-[#3200C1] focus:outline-none" />
                        </div>
                        <div>
                            <label className="block text-slate-700 font-bold mb-2">Dormitorios</label>
                            <input name="bedrooms" type="number" placeholder="Ej. 3" className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-[#3200C1] focus:outline-none" />
                        </div>
                        <div>
                            <label className="block text-slate-700 font-bold mb-2">Baños</label>
                            <input name="bathrooms" type="number" placeholder="Ej. 2" className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-[#3200C1] focus:outline-none" />
                        </div>
                        <div>
                            <label className="block text-slate-700 font-bold mb-2">Pisos / Niveles</label>
                            <input name="floors" type="number" placeholder="Ej. 1" className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-[#3200C1] focus:outline-none" />
                        </div>
                        <div>
                            <label className="block text-slate-700 font-bold mb-2">Material Estructural</label>
                            <input name="structure_material" type="text" placeholder="Ej. Paneles SIP, Metalcon..." className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-[#3200C1] focus:outline-none" />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-slate-700 font-bold mb-2">Modos de Entrega</label>
                            <input name="delivery_modes" type="text" placeholder="Ej. Llave en mano, Obra gruesa (Separados por coma)" className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-[#3200C1] focus:outline-none" />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-slate-700 font-bold mb-2">Descripción Larga del Proyecto</label>
                            <textarea name="description" rows={4} placeholder="Cuenta los detalles de este modelo, materialidades y ventajas..." className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-[#3200C1] focus:outline-none resize-none"></textarea>
                        </div>
                    </div>
                </section>

                <hr className="border-slate-100" />

                <section>
                    <h3 className="text-lg font-bold text-[#3200C1] mb-6">Fotografías del Proyecto</h3>
                    <div className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-colors ${
                        photoError
                            ? 'border-red-400 bg-red-50'
                            : 'border-[#37FFDB] bg-[#37FFDB]/5 hover:bg-[#37FFDB]/10'
                    }`}>
                        <UploadCloud className="w-10 h-10 text-[#3200C1] mx-auto mb-4" />
                        <h4 className="font-bold text-[#3200C1] mb-2">Adjuntar Fotografías</h4>
                        <p className="text-slate-500 mb-1">Puedes seleccionar varios archivos JPG o PNG a la vez.</p>
                        <p className="text-xs font-bold text-slate-400 mb-6">Máximo <span className="text-[#3200C1]">3 MB</span> por foto.</p>
                        <input
                            name="photos"
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handlePhotoChange}
                            className="w-full text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#3200C1] file:text-white hover:file:bg-[#3200C1]/90 cursor-pointer"
                        />
                    </div>
                    {photoError && (
                        <div className="mt-3 flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                            <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                            <p className="text-sm font-semibold text-red-600">{photoError}. Por favor elige fotos más pequeñas o comprímilas antes de subir.</p>
                        </div>
                    )}
                </section>

                <hr className="border-slate-100" />

                <section>
                    <h3 className="text-lg font-bold text-[#3200C1] mb-6">Contenido Multimedia Especial</h3>
                    <div>
                        <label className="block text-slate-700 font-bold mb-2">Video de Recorrido (YouTube/Vimeo)</label>
                        <input name="video_url" type="url" placeholder="Ej. https://www.youtube.com/watch?v=..." className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-[#3200C1] focus:outline-none bg-slate-50 focus:bg-white" />
                        <p className="text-xs text-slate-400 mt-2 font-medium">Nota: Esta función requiere contar con un Plan Pro o Plan Elite.</p>
                    </div>
                </section>

                <hr className="border-slate-100" />

                <section>
                    <h3 className="text-lg font-bold text-amber-600 mb-6">Optimización para Buscadores (SEO)</h3>
                    <p className="text-slate-500 mb-6 -mt-4">Estos datos son los que leerá Google para posicionar tu propiedad frente a otras opciones del mercado.</p>
                    <div className="space-y-6">
                        <div>
                            <label className="block text-slate-700 font-bold mb-2">Título SEO</label>
                            <input name="seo_title" type="text" maxLength={60} placeholder="Ej. Casa Prefabricada Roble 50m2 | Tu Casa Fácil" className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-amber-500 focus:outline-none" />
                            <span className="text-xs text-slate-400 mt-1 block">Idealmente menor a 60 caracteres.</span>
                        </div>
                        <div>
                            <label className="block text-slate-700 font-bold mb-2">Descripción SEO (Metadescription)</label>
                            <textarea name="seo_description" maxLength={160} rows={3} placeholder="Ej. Conoce nuestra casa modular modelo Roble. Construcción rápida, alta aislación térmica con diseño nórdico. Cotiza tu proyecto en Chile." className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-amber-500 focus:outline-none resize-none"></textarea>
                            <span className="text-xs text-slate-400 mt-1 block">Resumen atractivo de tu casa, idealmente de 160 caracteres.</span>
                        </div>
                        <div>
                            <label className="block text-slate-700 font-bold mb-2">Palabras Clave (SEO Keywords)</label>
                            <input name="seo_keywords" type="text" placeholder="Ej. casa prefabricada, modelo roble, santiago de chile, paneles sip..." className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-amber-500 focus:outline-none" />
                        </div>
                    </div>
                </section>

                <div className="pt-6 border-t border-slate-100 flex justify-end gap-4">
                    <Link href="/dashboard" className="px-6 py-3 font-bold text-slate-500 hover:bg-slate-50 rounded-xl transition-colors">
                        Cancelar
                    </Link>
                    <button
                        disabled={isPending || !!photoError}
                        type="submit"
                        className={`px-6 py-3 bg-[#3200C1] text-white font-bold rounded-xl flex items-center gap-2 hover:bg-[#3200C1]/90 transition-colors ${(isPending || photoError) ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {isPending ? 'Publicando...' : <><Save className="w-5 h-5" /> Publicar Modelo</>}
                    </button>
                </div>
            </form>
        </div>
    );
}
