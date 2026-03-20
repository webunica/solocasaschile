"use client";

import { useEffect } from "react";

type Props = {
    modelId: string;
    modelName: string;
    companyName: string;
};

export default function ViewTracker({ modelId, modelName, companyName }: Props) {
    useEffect(() => {
        const trackView = async () => {
            try {
                // Pequeño delay para no contar rebotes instantáneos de milisegundos
                // o para dejar que hydrate el resto
                setTimeout(async () => {
                    await fetch("/api/track-view", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ modelId, modelName, companyName }),
                    });
                }, 1000);
            } catch (err) {
                console.error("Failed to track view", err);
            }
        };

        trackView();
    }, [modelId, modelName, companyName]);

    return null; // Componente invisible
}
