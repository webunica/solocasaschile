"use client";

import { useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, UploadCloud, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { editModelAction } from "../../edit-actions";

const MAX_PHOTO_MB = 3;
const MAX_PHOTO_BYTES = MAX_PHOTO_MB * 1024 * 1024;

export default function EditModelForm({ model }: { model: any }) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [photoError, setPhotoError] = useState<string | null>(null);

    const oldImages = model.images || [];

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

        startTransition(async () => {
            const result = await editModelAction(model._id, formData);
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
                    <h2 className="text-2xl font-black text-slate-800">Editando: {model.model_name}</h2>
                    <p className="text-slate-500 text-sm">Actualiza los detalles y campos de este modelo pre-existente.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-white border text-sm border-slate-200 rounded-2xl shadow-sm p-8 space-y-8">

                <section>
                    <h3 className="text-lg font-bold text-[#3200C1] mb-6">Detalles Básicos</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-slate-700 font-bold mb-2">Nombre del Modelo</label>
                            <input required defaultValue={model.model_name} name="model_name" type="text" className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-[#3200C1] focus:outline-none" />
                        </div>
                        <div>
                            <label className="block text-slate-700 font-bold mb-2">Categoría Principal</label>
                            <select defaultValue={model.category} name="category" className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-[#3200C1] focus:outline-none bg-white">
                                <option value="Casas Modulares">Casas Modulares</option>
                                <option value="Casas SIP">Casas SIP</option>
                                <option value="Cabañas de Madera">Cabañas de Madera</option>
                                <option value="Tiny Houses">Tiny Houses</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-slate-700 font-bold mb-2">Superficie (m²)</label>
                            <input required defaultValue={model.surface_m2} name="surface_m2" type="number" step="0.1" className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-[#3200C1] focus:outline-none" />
                        </div>
                        <div>
                            <label className="block text-slate-700 font-bold mb-2">Precio &quot;Desde&quot; (CLP)</label>
                            <input required defaultValue={model.price_from} name="price_from" type="number" className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-[#3200C1] focus:outline-none" />
                        </div>
                        <div>
                            <label className="block text-slate-700 font-bold mb-2">Dormitorios</label>
                            <input defaultValue={model.bedrooms} name="bedrooms" type="number" className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-[#3200C1] focus:outline-none" />
                        </div>
                        <div>
                            <label className="block text-slate-700 font-bold mb-2">Baños</label>
                            <input defaultValue={model.bathrooms} name="bathrooms" type="number" className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-[#3200C1] focus:outline-none" />
                        </div>
                        <div>
                            <label className="block text-slate-700 font-bold mb-2">Pisos / Niveles</label>
                            <input defaultValue={model.floors} name="floors" type="number" className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-[#3200C1] focus:outline-none" />
                        </div>
                        <div>
                            <label className="block text-slate-700 font-bold mb-2">Material Estructural</label>
                            <input defaultValue={model.structure_material} name="structure_material" type="text" className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-[#3200C1] focus:outline-none" />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-slate-700 font-bold mb-2">Modos de Entrega</label>
                            <input defaultValue={model.delivery_modes?.join(", ")} name="delivery_modes" type="text" className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-[#3200C1] focus:outline-none" />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-slate-700 font-bold mb-2">Descripción Larga del Proyecto</label>
                            <textarea defaultValue={model.description} name="description" rows={4} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-[#3200C1] focus:outline-none resize-none"></textarea>
                        </div>
                    </div>
                </section>

                <hr className="border-slate-100" />

                <section>
                    <h3 className="text-lg font-bold text-[#3200C1] mb-6">Añadir más Fotografías</h3>
                    {oldImages.length > 0 && (
                        <div className="mb-6">
                            <p className="text-slate-500 mb-2">Imágenes actuales ({oldImages.length}):</p>
                            <div className="flex flex-wrap gap-2">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                {oldImages.map((img: any, i: number) => (
                                    img.url && <img key={i} src={img.url} className="w-16 h-16 rounded object-cover shadow-sm border" alt="Asset" />
                                ))}
                            </div>
                        </div>
                    )}
                    <div className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-colors ${
                        photoError
                            ? 'border-red-400 bg-red-50'
                            : 'border-[#37FFDB] bg-[#37FFDB]/5 hover:bg-[#37FFDB]/10'
                    }`}>
                        <UploadCloud className="w-10 h-10 text-[#3200C1] mx-auto mb-4" />
                        <h4 className="font-bold text-[#3200C1] mb-2">Subir fotos nuevas</h4>
                        <p className="text-slate-500 mb-1">Se agregarán a la galería existente.</p>
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
                    <h3 className="text-lg font-bold text-amber-600 mb-6">Optimización para Buscadores (SEO)</h3>
                    <div className="space-y-6">
                        <div>
                            <label className="block text-slate-700 font-bold mb-2">Título SEO</label>
                            <input defaultValue={model.seo_title} name="seo_title" type="text" maxLength={60} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-amber-500 focus:outline-none" />
                        </div>
                        <div>
                            <label className="block text-slate-700 font-bold mb-2">Descripción SEO</label>
                            <textarea defaultValue={model.seo_description} name="seo_description" maxLength={160} rows={3} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-amber-500 focus:outline-none resize-none"></textarea>
                        </div>
                        <div>
                            <label className="block text-slate-700 font-bold mb-2">Palabras Clave (SEO Keywords)</label>
                            <input defaultValue={model.seo_keywords} name="seo_keywords" type="text" className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-amber-500 focus:outline-none" />
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
                        {isPending ? 'Guardando Cambios...' : <><Save className="w-5 h-5" /> Guardar Modelo</>}
                    </button>
                </div>
            </form>
        </div>
    );
}
