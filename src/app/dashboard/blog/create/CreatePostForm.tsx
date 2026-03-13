"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, AlertCircle, Save } from "lucide-react";
import { createPostAction } from "./create-post-action";

export default function CreatePostForm() {
    const router = useRouter();
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [errorMsg, setErrorMsg] = useState("");

    const [formParams, setFormParams] = useState({
        title: "",
        slug: "",
        category: "",
        excerpt: "",
        htmlContent: "",
        schemaMarkup: "",
        imageAlt: "",
        imageCaption: ""
    });
    const [imageFile, setImageFile] = useState<File | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormParams(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImageFile(e.target.files[0]);
        }
    };

    // Auto-generate slug when title changes (if slug is empty)
    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const title = e.target.value;
        setFormParams(prev => {
            if (prev.slug === "" || prev.slug === generateSlug(prev.title)) {
                return { ...prev, title, slug: generateSlug(title) };
            }
            return { ...prev, title };
        });
    };

    const generateSlug = (text: string) => {
        return text.toString().toLowerCase()
            .replace(/\s+/g, '-')           // Replace spaces with -
            .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
            .replace(/\-\-+/g, '-')         // Replace multiple - with single -
            .replace(/^-+/, '')             // Trim - from start of text
            .replace(/-+$/, '');            // Trim - from end of text
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("loading");
        setErrorMsg("");

        try {
            const formData = new FormData();
            Object.entries(formParams).forEach(([key, value]) => {
                if (value) formData.append(key, value);
            });
            if (imageFile) formData.append("coverImage", imageFile);

            const result = await createPostAction(formData);

            if (result?.error) {
                setStatus("error");
                setErrorMsg(result.error);
            } else {
                setStatus("success");
                setTimeout(() => {
                    router.push("/dashboard/blog");
                }, 2000);
            }
        } catch (err: any) {
            setStatus("error");
            setErrorMsg("Error interno. Revisa la consola.");
        }
    };

    if (status === "success") {
        return (
            <div className="bg-green-50 text-green-700 p-8 rounded-2xl flex flex-col items-center justify-center border border-green-200">
                <CheckCircle className="w-12 h-12 mb-4 text-green-500" />
                <h3 className="text-xl font-bold">¡Publicación Creada!</h3>
                <p>Redirigiendo a las publicaciones...</p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8 pb-12">
            
            {/* 1. SECCIÓN BÁSICA */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 space-y-6">
                <h3 className="text-lg font-black text-[#3200C1] border-b pb-4">1. Información Principal</h3>
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="col-span-2">
                        <label className="block text-xs font-black text-slate-500 uppercase mb-2">Título de la Publicación *</label>
                        <input
                            required
                            name="title"
                            type="text"
                            placeholder="Ej: Las 10 ventajas de las casas prefabricadas"
                            value={formParams.title}
                            onChange={handleTitleChange}
                            className="w-full px-4 py-3 bg-slate-50 border rounded-xl focus:border-[#3200C1] transition-colors"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-black text-slate-500 uppercase mb-2">Slug (URL limpia) *</label>
                        <input
                            required
                            name="slug"
                            type="text"
                            value={formParams.slug}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-slate-50 border rounded-xl focus:border-[#3200C1]"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-black text-slate-500 uppercase mb-2">Categoría</label>
                        <input
                            name="category"
                            type="text"
                            placeholder="Ej: Casas SIP, Tendencias, Guías..."
                            value={formParams.category}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-slate-50 border rounded-xl focus:border-[#3200C1]"
                        />
                    </div>
                </div>
            </div>

            {/* 2. CONTENIDO HTML */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 space-y-6">
                <h3 className="text-lg font-black text-[#3200C1] border-b pb-4">2. Contenido (HTML)</h3>
                <p className="text-sm text-slate-500">Puedes insertar tu artículo en formato HTML. Estará renderizado con tipografía y estilos automáticos (Prose de Tailwind).</p>
                <textarea
                    name="htmlContent"
                    rows={12}
                    placeholder="<h2>Tu subtítulo</h2><p>Párrafo principal sobre construcción sostenible...</p>"
                    value={formParams.htmlContent}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 font-mono text-sm border rounded-xl focus:border-[#3200C1] transition-colors resize-y"
                />
            </div>

            {/* 3. IMAGEN PRINCIPAL */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 space-y-6">
                <h3 className="text-lg font-black text-[#3200C1] border-b pb-4">3. Imagen Principal</h3>
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="col-span-2">
                        <label className="block text-xs font-black text-slate-500 uppercase mb-2">Subir Archivo de Imagen</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#3200C1]/10 file:text-[#3200C1] hover:file:bg-[#3200C1]/20 cursor-pointer"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-black text-slate-500 uppercase mb-2">Atributo ALT (Accesibilidad/SEO)</label>
                        <input
                            name="imageAlt"
                            type="text"
                            placeholder="Ej: Fachada de casa modelo Mediterráneo"
                            value={formParams.imageAlt}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-slate-50 border rounded-xl focus:border-[#3200C1]"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-black text-slate-500 uppercase mb-2">Leyenda / Descripción</label>
                        <input
                            name="imageCaption"
                            type="text"
                            placeholder="Ej: Casa llave en mano en Puerto Varas"
                            value={formParams.imageCaption}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-slate-50 border rounded-xl focus:border-[#3200C1]"
                        />
                    </div>
                </div>
            </div>

            {/* 4. SEO & SCHEMA */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 space-y-6">
                <h3 className="text-lg font-black text-[#3200C1] border-b pb-4">4. SEO & Schema Markup</h3>
                
                <div>
                    <label className="block text-xs font-black text-slate-500 uppercase mb-2">Meta Descripción (Excerpt)</label>
                    <textarea
                        name="excerpt"
                        maxLength={160}
                        rows={3}
                        placeholder="Descripción corta para Google (max 160 caracteres)"
                        value={formParams.excerpt}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-slate-50 border rounded-xl focus:border-[#3200C1]"
                    />
                    <div className="text-right text-xs text-slate-400 mt-1">{formParams.excerpt.length}/160</div>
                </div>

                <div>
                    <label className="block text-xs font-black text-slate-500 uppercase mb-2">Schema JSON-LD</label>
                    <textarea
                        name="schemaMarkup"
                        rows={6}
                        placeholder={'{"@context": "https://schema.org", "@type": "Article", ...}'}
                        value={formParams.schemaMarkup}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-slate-50 font-mono text-sm border rounded-xl focus:border-[#3200C1]"
                    />
                    <p className="text-xs text-slate-500 mt-2">Copia aquí tu Schema estructurado (script inyectado en cabecera).</p>
                </div>
            </div>

            {status === "error" && (
                <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm font-semibold">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    {errorMsg}
                </div>
            )}

            <div className="flex justify-end gap-4 pb-8">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="px-6 py-3 font-bold text-slate-500 hover:text-slate-800"
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    disabled={status === "loading"}
                    className="flex items-center gap-2 px-8 py-3 bg-[#3200C1] text-white font-bold rounded-xl hover:brightness-110 disabled:opacity-50"
                >
                    {status === "loading" ? "Guardando..." : "Publicar Artículo"}
                    <Save className="w-5 h-5" />
                </button>
            </div>
        </form>
    );
}
