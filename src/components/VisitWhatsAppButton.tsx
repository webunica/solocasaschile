"use client";

import { useState } from "react";
import { MessageCircle, Loader2 } from "lucide-react";

interface Props {
    modelId: string;
    modelName: string;
    companyName: string;
    whatsappNumber: string;
    className?: string;
    label?: string;
}

export default function VisitWhatsAppButton({
    modelId,
    modelName,
    companyName,
    whatsappNumber,
    className,
    label = "WhatsApp Directo",
}: Props) {
    const [tracking, setTracking] = useState(false);

    if (!whatsappNumber) return null;

    const targetUrl = `https://wa.me/${whatsappNumber.replace(/\+/g, '').replace(/\s/g, '')}?text=Hola,%20me%20interesa%20el%20modelo%20${encodeURIComponent(modelName)}%20visto%20en%20SoloCasasChile.`;

    const handleClick = async (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        setTracking(true);
        try {
            await fetch("/api/track-click", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    modelId, 
                    modelName, 
                    companyName, 
                    targetUrl, 
                    source: "whatsapp" 
                }),
            });
        } catch {
            // silencio
        } finally {
            setTracking(false);
            window.open(targetUrl, "_blank", "noopener,noreferrer");
        }
    };

    return (
        <a
            href={targetUrl}
            onClick={handleClick}
            rel="noopener noreferrer"
            target="_blank"
            className={className || "w-full flex items-center justify-center gap-2 bg-[#25D366] text-white py-3 rounded-xl font-bold hover:bg-[#20bd5a] transition-colors"}
        >
            {tracking ? (
                <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
                <MessageCircle className="w-4 h-4" />
            )}
            {label}
        </a>
    );
}
