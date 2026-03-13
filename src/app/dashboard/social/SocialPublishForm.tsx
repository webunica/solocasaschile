"use client";

import { useState } from "react";
import {
    Facebook, Instagram, Send, Image as ImageIcon, 
    CheckCircle, AlertCircle, ExternalLink, Info
} from "lucide-react";

const MAX_FB = 63206;
const MAX_IG = 2200;

type Network = "facebook" | "instagram";

export default function SocialPublishForm() {
    const [network, setNetwork] = useState<Network>("facebook");
    const [text, setText] = useState("");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [errorMsg, setErrorMsg] = useState("");

    const maxChars = network === "facebook" ? MAX_FB : MAX_IG;
    const isOverLimit = text.length > maxChars;

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setImageFile(file);
        const reader = new FileReader();
        reader.onload = (ev) => setImagePreview(ev.target?.result as string);
        reader.readAsDataURL(file);
    };

    const handlePublish = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!text.trim()) {
            setErrorMsg("El texto no puede estar vacío.");
            setStatus("error");
            return;
        }
        if (isOverLimit) {
            setErrorMsg(`El texto supera el límite de caracteres de ${network === "facebook" ? "Facebook" : "Instagram"}.`);
            setStatus("error");
            return;
        }

        setStatus("loading");
        setErrorMsg("");

        try {
            const formData = new FormData();
            formData.append("network", network);
            formData.append("text", text);
            if (imageFile) formData.append("image", imageFile);

            const res = await fetch("/api/social/publish", {
                method: "POST",
                body: formData,
            });

            const data = await res.json();
            if (!res.ok || data.error) {
                throw new Error(data.error || "Error desconocido.");
            }

            setStatus("success");
            setText("");
            setImageFile(null);
            setImagePreview(null);
            setTimeout(() => setStatus("idle"), 5000);
        } catch (err: any) {
            setStatus("error");
            setErrorMsg(err.message);
        }
    };

    return (
        <div className="space-y-8 max-w-3xl">

            {/* Info Banner */}
            <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-2xl p-5 text-blue-800">
                <Info className="w-5 h-5 mt-0.5 shrink-0 text-blue-500" />
                <div className="text-sm">
                    <p className="font-bold mb-1">Configuración requerida</p>
                    <p>Para publicar automáticamente necesitas configurar tus <strong>tokens de Meta API</strong> en las variables de entorno del servidor. Consulta el apartado <em>Ajustes &gt; Redes Sociales</em> más abajo para conectar tus páginas de Facebook e Instagram.</p>
                </div>
            </div>

            {/* Network Selector */}
            <div className="flex gap-4">
                <button
                    type="button"
                    onClick={() => setNetwork("facebook")}
                    className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-2xl font-bold border-2 transition-all ${
                        network === "facebook"
                            ? "bg-[#1877F2] border-[#1877F2] text-white shadow-lg shadow-blue-200"
                            : "bg-white border-slate-200 text-slate-600 hover:border-[#1877F2]"
                    }`}
                >
                    <Facebook className="w-5 h-5" />
                    Facebook
                </button>
                <button
                    type="button"
                    onClick={() => setNetwork("instagram")}
                    className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-2xl font-bold border-2 transition-all ${
                        network === "instagram"
                            ? "text-white border-transparent shadow-lg shadow-pink-200"
                            : "bg-white border-slate-200 text-slate-600 hover:border-pink-400"
                    }`}
                    style={ network === "instagram" ? { background: "linear-gradient(135deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)" } : {} }
                >
                    <Instagram className="w-5 h-5" />
                    Instagram
                </button>
            </div>

            {/* Compose Form */}
            <form onSubmit={handlePublish} className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                        network === "facebook" ? "bg-[#1877F2]" : ""
                    }`}
                    style={ network === "instagram" ? { background: "linear-gradient(135deg, #f09433, #dc2743, #bc1888)" } : {} }
                    >
                        {network === "facebook"
                            ? <Facebook className="w-5 h-5 text-white" />
                            : <Instagram className="w-5 h-5 text-white" />
                        }
                    </div>
                    <div>
                        <p className="font-bold text-slate-800">Composición de publicación</p>
                        <p className="text-xs text-slate-400">
                            {network === "facebook" ? "Publicará en tu Página de Facebook" : "Publicará en tu cuenta de Instagram Business"}
                        </p>
                    </div>
                </div>

                <div className="p-6 space-y-5">
                    {/* Text area */}
                    <div>
                        <textarea
                            rows={6}
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            placeholder={
                                network === "instagram"
                                    ? "Escribe tu caption con hashtags... #casasprefabricadas #construccion #chile"
                                    : "Escribe el texto de tu publicación..."
                            }
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-[#3200C1] outline-none resize-none text-sm leading-relaxed transition-colors"
                        />
                        <div className={`text-right text-xs mt-1 ${isOverLimit ? "text-red-500 font-bold" : "text-slate-400"}`}>
                            {text.length.toLocaleString()} / {maxChars.toLocaleString()}
                        </div>
                    </div>

                    {/* Image upload */}
                    <div>
                        <label className="block text-xs font-black text-slate-500 uppercase mb-2">
                            Imagen adjunta {network === "instagram" ? "(recomendada)" : "(opcional)"}
                        </label>
                        {imagePreview ? (
                            <div className="relative">
                                <img src={imagePreview} alt="Preview" className="w-full max-h-64 object-cover rounded-xl border border-slate-200" />
                                <button
                                    type="button"
                                    onClick={() => { setImageFile(null); setImagePreview(null); }}
                                    className="absolute top-3 right-3 bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center text-xs font-bold hover:bg-red-600"
                                >✕</button>
                            </div>
                        ) : (
                            <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-slate-300 rounded-xl py-8 cursor-pointer hover:border-[#3200C1] hover:bg-slate-50 transition-all">
                                <ImageIcon className="w-8 h-8 text-slate-400" />
                                <span className="text-sm text-slate-500">Haz clic para subir imagen</span>
                                <span className="text-xs text-slate-400">JPG, PNG — Recomendado 1080x1080 px para Instagram</span>
                                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                            </label>
                        )}
                    </div>

                    {/* Error */}
                    {status === "error" && (
                        <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm font-semibold">
                            <AlertCircle className="w-5 h-5 shrink-0" />
                            {errorMsg}
                        </div>
                    )}

                    {status === "success" && (
                        <div className="flex items-center gap-2 text-green-700 bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-sm font-semibold">
                            <CheckCircle className="w-5 h-5 shrink-0" />
                            ¡Publicación enviada exitosamente! Revisa tu cuenta para confirmar.
                        </div>
                    )}
                </div>

                {/* Submit */}
                <div className="px-6 pb-6 flex justify-end">
                    <button
                        type="submit"
                        disabled={status === "loading" || isOverLimit}
                        className="flex items-center gap-2 px-8 py-3 bg-[#3200C1] text-white font-bold rounded-xl hover:brightness-110 disabled:opacity-50 transition-all"
                    >
                        {status === "loading" ? "Publicando..." : "Publicar ahora"}
                        <Send className="w-5 h-5" />
                    </button>
                </div>
            </form>

            {/* Config Section */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-5">
                <h3 className="font-black text-lg text-[#3200C1] border-b pb-4">⚙️ Cómo conectar tus cuentas</h3>
                <div className="grid md:grid-cols-2 gap-6 text-sm text-slate-600">
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 font-bold text-[#1877F2]">
                            <Facebook className="w-5 h-5" /> Facebook Pages API
                        </div>
                        <ol className="space-y-2 text-slate-500">
                            <li className="flex gap-2"><span className="font-bold text-[#3200C1]">1.</span> Crea una App en <a href="https://developers.facebook.com" target="_blank" className="underline hover:text-[#3200C1]">developers.facebook.com</a></li>
                            <li className="flex gap-2"><span className="font-bold text-[#3200C1]">2.</span> Agrega el permiso <code className="bg-slate-100 px-1 rounded">pages_manage_posts</code></li>
                            <li className="flex gap-2"><span className="font-bold text-[#3200C1]">3.</span> Genera un Page Access Token y cópialo en el .env como <code className="bg-slate-100 px-1 rounded">FB_PAGE_ACCESS_TOKEN</code></li>
                            <li className="flex gap-2"><span className="font-bold text-[#3200C1]">4.</span> Agrega tu Page ID en <code className="bg-slate-100 px-1 rounded">FB_PAGE_ID</code></li>
                        </ol>
                    </div>
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 font-bold text-pink-600">
                            <Instagram className="w-5 h-5" /> Instagram Graph API
                        </div>
                        <ol className="space-y-2 text-slate-500">
                            <li className="flex gap-2"><span className="font-bold text-[#3200C1]">1.</span> Conecta tu cuenta de Instagram a una Página de Facebook</li>
                            <li className="flex gap-2"><span className="font-bold text-[#3200C1]">2.</span> Usa el mismo Token de Facebook y agrega permisos <code className="bg-slate-100 px-1 rounded">instagram_basic</code>, <code className="bg-slate-100 px-1 rounded">instagram_content_publish</code></li>
                            <li className="flex gap-2"><span className="font-bold text-[#3200C1]">3.</span> Agrega tu IG Account ID en <code className="bg-slate-100 px-1 rounded">IG_ACCOUNT_ID</code></li>
                            <li className="flex gap-2"><span className="font-bold text-[#3200C1]">4.</span> Instagram solo permite publicar imágenes hospedadas en URL pública</li>
                        </ol>
                    </div>
                </div>
                <a
                    href="https://developers.facebook.com/docs/graph-api/reference/page/feed"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-[#3200C1] text-sm font-bold hover:underline"
                >
                    Ver documentación oficial de Meta Graph API <ExternalLink className="w-4 h-4" />
                </a>
            </div>
        </div>
    );
}
