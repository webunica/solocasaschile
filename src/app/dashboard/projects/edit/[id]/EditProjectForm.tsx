"use client";

import { useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, UploadCloud, MapPin, ImageIcon } from "lucide-react";
import Link from "next/link";
import { updateProjectAction } from "../../actions";
import { urlFor } from "@/lib/sanity.client";
import Image from "next/image";

const MAX_PHOTO_MB = 3;
const MAX_PHOTO_BYTES = MAX_PHOTO_MB * 1024 * 1024;

interface Props {
    project: any;
}

export default function EditProjectForm({ project }: Props) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [photoError, setPhotoError] = useState<string | null>(null);

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        const oversized = files.filter(f => f.size > MAX_PHOTO_BYTES);
        if (oversized.length > 0) {
            setPhotoError(`${oversized.length} foto(s) superan los ${MAX_PHOTO_MB}MB.`);
        } else {
            setPhotoError(null);
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        startTransition(async () => {
            const result = await updateProjectAction(project._id, formData);
            if (result.error) {
                alert(result.error);
            } else {
                router.push("/dashboard/projects");
            }
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/dashboard/projects" className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-[#3200C1] hover:bg-slate-50 transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div className="flex-1">
                    <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Editar Proyecto</h2>
                    <p className="text-slate-500 text-sm">Modifica los detalles de tu obra realizada.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-white border text-sm border-slate-200 rounded-2xl shadow-sm p-8 space-y-8">
                <section>
                    <h3 className="text-lg font-bold text-[#3200C1] mb-6">Detalles del Proyecto</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-slate-700 font-bold mb-2 uppercase text-[10px]">Nombre del Proyecto (Título)</label>
                            <input 
                                required 
                                name="title" 
                                type="text" 
                                defaultValue={project.title}
                                placeholder="Ej. Casa Mediterránea en Parcelación El Sauce" 
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-[#3200C1] focus:outline-none" 
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-slate-700 font-bold mb-2 uppercase text-[10px]">Descripción (Opcional)</label>
                            <textarea 
                                name="description" 
                                rows={3} 
                                defaultValue={project.description}
                                placeholder="Breve testimonio o detalles del cliente..." 
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-[#3200C1] focus:outline-none resize-none"
                            />
                        </div>
                        <div>
                            <label className="block text-slate-700 font-bold mb-2 uppercase text-[10px]">Ubicación (Ciudad/Condominio)</label>
                            <input 
                                required 
                                name="location_name" 
                                type="text" 
                                defaultValue={project.location_name}
                                placeholder="Ej. Curacaví, RM" 
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-[#3200C1] focus:outline-none" 
                            />
                        </div>
                        <div>
                            <label className="block text-slate-700 font-bold mb-2 uppercase text-[10px]">Fecha de Entrega</label>
                            <input 
                                name="completion_date" 
                                type="date" 
                                defaultValue={project.completion_date}
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-[#3200C1] focus:outline-none" 
                            />
                        </div>
                    </div>
                </section>

                <hr className="border-slate-100" />

                <section>
                    <h3 className="text-lg font-bold text-[#3200C1] mb-6 flex items-center gap-2">
                        <MapPin className="w-5 h-5" /> Ubicación Exacta para el Mapa
                    </h3>
                    <p className="text-xs text-slate-400 mb-6 italic">Ingresa las coordenadas GPS para que tu obra se vea en el mapa interactivo de tu perfil.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-slate-700 font-bold mb-2 uppercase text-[10px]">Latitud</label>
                            <input 
                                name="lat" 
                                type="number" 
                                step="0.000001" 
                                defaultValue={project.location?.lat}
                                placeholder="Ej. -33.456" 
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-[#3200C1] focus:outline-none bg-slate-50" 
                            />
                        </div>
                        <div>
                            <label className="block text-slate-700 font-bold mb-2 uppercase text-[10px]">Longitud</label>
                            <input 
                                name="lng" 
                                type="number" 
                                step="0.000001" 
                                defaultValue={project.location?.lng}
                                placeholder="Ej. -70.789" 
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-[#3200C1] focus:outline-none bg-slate-50" 
                            />
                        </div>
                    </div>
                </section>

                <hr className="border-slate-100" />

                <section>
                    <h3 className="text-lg font-bold text-[#3200C1] mb-6">Fotos Actuales</h3>
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-4 mb-8">
                        {project.images?.map((img: any, idx: number) => (
                            <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-slate-200 shadow-sm bg-slate-50">
                                <Image 
                                    src={urlFor(img).url()} 
                                    alt={`Foto ${idx}`}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        ))}
                    </div>

                    <h3 className="text-lg font-bold text-[#3200C1] mb-6">Agregar más Fotos</h3>
                    <div className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-colors ${
                        photoError ? 'border-red-400 bg-red-50' : 'border-[#37FFDB] bg-[#37FFDB]/5 hover:bg-[#37FFDB]/10'
                    }`}>
                        <UploadCloud className="w-10 h-10 text-[#3200C1] mx-auto mb-4" />
                        <h4 className="font-bold text-[#3200C1] mb-2">Adjuntar Nuevas Fotografías</h4>
                        <p className="text-xs font-bold text-slate-400 mb-6 uppercase">Máximo <span className="text-[#3200C1]">3 MB</span> por foto. Se añadirán a las actuales.</p>
                        <input name="photos" type="file" multiple accept="image/*" onChange={handlePhotoChange} className="w-full text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#3200C1] file:text-white hover:file:bg-[#3200C1]/90 cursor-pointer" />
                    </div>
                </section>

                <div className="pt-6 border-t border-slate-100 flex justify-end gap-4">
                    <Link href="/dashboard/projects" className="px-6 py-3 font-bold text-slate-500 hover:bg-slate-50 rounded-xl transition-colors">
                        Cancelar
                    </Link>
                    <button
                        disabled={isPending || !!photoError}
                        type="submit"
                        className={`px-6 py-3 bg-[#3200C1] text-white font-bold rounded-xl flex items-center gap-2 hover:bg-[#3200C1]/90 transition-colors ${(isPending || photoError) ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {isPending ? 'Guardando...' : <><Save className="w-5 h-5" /> Guardar Cambios</>}
                    </button>
                </div>
            </form>
        </div>
    );
}
