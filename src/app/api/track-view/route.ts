import { NextRequest, NextResponse } from "next/server";
import { sanityWriteClient } from "@/lib/sanity.server";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { modelId, modelName, companyName } = body;

        if (!modelId) {
            return NextResponse.json({ error: "modelId requerido" }, { status: 400 });
        }

        // Obtener IP del usuario (anonimizada)
        const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "desconocida";
        const anonIp = ip.split(".").slice(0, 3).join(".") + ".xxx";

        // Registrar la vista en Sanity
        await sanityWriteClient.create({
            _type: "modelView",
            model_id: modelId,
            model_name: modelName || "",
            company_name: companyName || "",
            ip_anon: anonIp,
            user_agent: req.headers.get("user-agent") || "",
            viewed_at: new Date().toISOString(),
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Track view error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
