import { NextRequest, NextResponse } from "next/server";
import { sanityWriteClient } from "@/lib/sanity.server";
import { sanityClient } from "@/lib/sanity.client";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { modelId, modelName, companyName, targetUrl, source } = body;

        if (!modelId) {
            return NextResponse.json({ error: "modelId requerido" }, { status: 400 });
        }

        // Obtener IP del usuario (anonimizada — solo primeros 3 octetos)
        const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "desconocida";
        const anonIp = ip.split(".").slice(0, 3).join(".") + ".xxx";

        // Registrar el clic en Sanity
        await sanityWriteClient.create({
            _type: "propertyClick",
            model_id: modelId,
            model_name: modelName || "",
            company_name: companyName || "",
            target_url: targetUrl || "",
            source: source || "card", // "card" | "detail"
            ip_anon: anonIp,
            user_agent: req.headers.get("user-agent") || "",
            clicked_at: new Date().toISOString(),
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Track click error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
