"use client";

import { useState } from "react";
import { Facebook, Twitter, Linkedin, Link2, MessageCircle, Check } from "lucide-react";

interface ShareButtonsProps {
    title: string;
    slug: string;
    excerpt?: string;
}

export default function ShareButtons({ title, slug, excerpt }: ShareButtonsProps) {
    const [copied, setCopied] = useState(false);
    const url = `https://www.solocasaschile.com/blog/${slug}`;
    const text = encodeURIComponent(`${title} - solocasaschile.com`);
    const encodedUrl = encodeURIComponent(url);
    const encodedExcerpt = encodeURIComponent(excerpt || title);

    const shareLinks = {
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
        twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${text}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
        whatsapp: `https://wa.me/?text=${encodeURIComponent(`${title}\n${url}`)}`,
    };

    const copyLink = async () => {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
    };

    return (
        <div className="flex items-center gap-3 flex-wrap">
            <span className="text-slate-400 text-sm font-bold">Compartir:</span>

            {/* Facebook */}
            <a
                href={shareLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                title="Compartir en Facebook"
                className="group w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-[#1877F2] hover:bg-[#1877F2] hover:border-[#1877F2] hover:text-white transition-all duration-200"
            >
                <Facebook className="w-4 h-4" />
            </a>

            {/* X / Twitter */}
            <a
                href={shareLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                title="Compartir en X (Twitter)"
                className="group w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-800 hover:bg-slate-800 hover:border-slate-800 hover:text-white transition-all duration-200"
            >
                <Twitter className="w-4 h-4" />
            </a>

            {/* LinkedIn */}
            <a
                href={shareLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                title="Compartir en LinkedIn"
                className="group w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-[#0A66C2] hover:bg-[#0A66C2] hover:border-[#0A66C2] hover:text-white transition-all duration-200"
            >
                <Linkedin className="w-4 h-4" />
            </a>

            {/* WhatsApp */}
            <a
                href={shareLinks.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                title="Compartir en WhatsApp"
                className="group w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-[#25D366] hover:bg-[#25D366] hover:border-[#25D366] hover:text-white transition-all duration-200"
            >
                <MessageCircle className="w-4 h-4" />
            </a>

            {/* Copiar link */}
            <button
                onClick={copyLink}
                title="Copiar enlace"
                className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-200 ${
                    copied
                        ? "bg-green-500 border-green-500 text-white"
                        : "border-slate-200 text-slate-500 hover:bg-slate-100"
                }`}
            >
                {copied ? <Check className="w-4 h-4" /> : <Link2 className="w-4 h-4" />}
            </button>

            {copied && (
                <span className="text-xs text-green-600 font-bold animate-pulse">¡Copiado!</span>
            )}
        </div>
    );
}
