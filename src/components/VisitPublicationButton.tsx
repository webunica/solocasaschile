"use client";

import { useState } from "react";
import { ExternalLink, Loader2 } from "lucide-react";

interface VisitPublicationButtonProps {
    modelId: string;
    modelName: string;
    companyName: string;
    targetUrl: string;
    source?: "card" | "detail";
    className?: string;
    label?: string;
}

export default function VisitPublicationButton({
    modelId,
    modelName,
    companyName,
    targetUrl,
    source = "card",
    className,
    label = "Ver Publicación",
}: VisitPublicationButtonProps) {
    const [tracking, setTracking] = useState(false);

    if (!targetUrl) return null;

    const handleClick = async (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        setTracking(true);
        try {
            await fetch("/api/track-click", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ modelId, modelName, companyName, targetUrl, source }),
            });
        } catch {
            // silenceamos el error — el clic igual procede
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
            className={
                className ||
                "inline-flex items-center gap-2 px-4 py-2 rounded-[4px] bg-[#37FFDB] text-[#3200C1] text-xs font-black hover:brightness-105 active:scale-95 transition-all whitespace-nowrap"
            }
            title={`Visitar publicación original de ${modelName}`}
        >
            {tracking ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
                <ExternalLink className="w-3.5 h-3.5" />
            )}
            {label}
        </a>
    );
}
