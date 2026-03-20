"use client";

import { useState } from "react";
import { ExternalLink, Loader2, Calendar } from "lucide-react";

interface Props {
    modelId: string;
    modelName: string;
    companyName: string;
    targetUrl: string;
    className?: string;
    label?: string;
    icon?: "calendar" | "external";
    source?: string;
}

export default function VisitExternalLinkButton({
    modelId,
    modelName,
    companyName,
    targetUrl,
    className,
    label = "Ver más",
    icon = "external",
    source = "external"
}: Props) {
    const [tracking, setTracking] = useState(false);

    if (!targetUrl) return null;

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
                    source 
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
            className={className || "w-full flex items-center justify-center gap-2 bg-slate-800 text-white py-3 rounded-xl font-bold hover:bg-slate-700 transition-colors"}
        >
            {tracking ? (
                <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
                icon === "calendar" ? <Calendar className="w-4 h-4" /> : <ExternalLink className="w-4 h-4" />
            )}
            {label}
        </a>
    );
}
