import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "admin") {
        return NextResponse.json({ error: "No autorizado." }, { status: 401 });
    }

    try {
        const formData = await req.formData();
        const network = formData.get("network") as string;
        const text = formData.get("text") as string;
        const imageFile = formData.get("image") as File | null;

        if (!network || !text) {
            return NextResponse.json({ error: "Faltan datos requeridos." }, { status: 400 });
        }

        // Obtener tokens desde Sanity (prioridad sobre .env)
        const { sanityClient } = await import("@/lib/sanity.client");
        const settings = await sanityClient.fetch(`*[_type == "siteSettings"][0]{
            fb_page_id,
            fb_page_access_token,
            ig_account_id
        }`);

        const tokens = {
            fb_id: settings?.fb_page_id || process.env.FB_PAGE_ID,
            fb_token: settings?.fb_page_access_token || process.env.FB_PAGE_ACCESS_TOKEN,
            ig_id: settings?.ig_account_id || process.env.IG_ACCOUNT_ID
        };

        // Upload de imagen a Sanity si viene
        let imageUrl: string | null = null;
        if (imageFile && imageFile.size > 0) {
            const { sanityWriteClient } = await import("@/lib/sanity.server");
            const buffer = Buffer.from(await imageFile.arrayBuffer());
            const asset = await sanityWriteClient.assets.upload("image", buffer, { filename: imageFile.name });
            imageUrl = asset.url;
        }

        if (network === "facebook") {
            return await publishToFacebook(text, imageUrl, tokens.fb_id, tokens.fb_token);
        } else if (network === "instagram") {
            return await publishToInstagram(text, imageUrl, tokens.ig_id, tokens.fb_token);
        }

        return NextResponse.json({ error: "Red social no soportada." }, { status: 400 });
    } catch (err: any) {
        return NextResponse.json({ error: err.message || "Error interno." }, { status: 500 });
    }
}

async function publishToFacebook(text: string, imageUrl: string | null, PAGE_ID?: string, ACCESS_TOKEN?: string) {
    if (!PAGE_ID || !ACCESS_TOKEN) {
        return NextResponse.json({
            error: "Meta API no conectada. Usa el botón 'Conectar con Facebook' en el dashboard."
        }, { status: 503 });
    }

    let endpoint: string;
    let body: Record<string, string>;

    if (imageUrl) {
        // Post con foto
        endpoint = `https://graph.facebook.com/v21.0/${PAGE_ID}/photos`;
        body = { message: text, url: imageUrl, access_token: ACCESS_TOKEN };
    } else {
        // Post solo texto
        endpoint = `https://graph.facebook.com/v21.0/${PAGE_ID}/feed`;
        body = { message: text, access_token: ACCESS_TOKEN };
    }

    const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok || data.error) {
        return NextResponse.json({ error: data.error?.message || "Error de Facebook API." }, { status: 500 });
    }

    return NextResponse.json({ success: true, postId: data.id });
}

async function publishToInstagram(caption: string, imageUrl: string | null, IG_ID?: string, ACCESS_TOKEN?: string) {
    if (!IG_ID || !ACCESS_TOKEN) {
        return NextResponse.json({
            error: "Cuenta de Instagram no vinculada o Meta API no conectada."
        }, { status: 503 });
    }

    if (!imageUrl) {
        return NextResponse.json({
            error: "Instagram requiere una imagen para publicar. Por favor adjunta una imagen."
        }, { status: 400 });
    }

    // Paso 1: Crear el media container
    const createRes = await fetch(`https://graph.facebook.com/v21.0/${IG_ID}/media`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            image_url: imageUrl,
            caption,
            access_token: ACCESS_TOKEN,
        }),
    });

    const createData = await createRes.json();
    if (!createRes.ok || createData.error) {
        return NextResponse.json({ error: createData.error?.message || "Error creando media en Instagram." }, { status: 500 });
    }

    const containerId = createData.id;

    // Paso 2: Publicar el container
    const publishRes = await fetch(`https://graph.facebook.com/v21.0/${IG_ID}/media_publish`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            creation_id: containerId,
            access_token: ACCESS_TOKEN,
        }),
    });

    const publishData = await publishRes.json();
    if (!publishRes.ok || publishData.error) {
        return NextResponse.json({ error: publishData.error?.message || "Error publicando en Instagram." }, { status: 500 });
    }

    return NextResponse.json({ success: true, postId: publishData.id });
}
