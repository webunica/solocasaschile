import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

const FB_APP_ID = process.env.FB_APP_ID;
const FB_APP_SECRET = process.env.FB_APP_SECRET;
const REDIRECT_URI = `${process.env.NEXTAUTH_URL || 'https://www.solocasaschile.com'}/api/social/connect`;

export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "admin") {
        return NextResponse.json({ error: "No autorizado." }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");

    // Si no hay código, redirigir a login de Facebook
    if (!code) {
        if (!FB_APP_ID) {
            return NextResponse.json({ error: "FB_APP_ID no configurado en el servidor." }, { status: 500 });
        }
        
        const loginUrl = `https://www.facebook.com/v21.0/dialog/oauth?client_id=${FB_APP_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=pages_manage_posts,instagram_basic,instagram_content_publish,pages_show_list,business_management`;
        return NextResponse.redirect(loginUrl);
    }

    // Si hay código, intercambiarlo por un token de acceso
    try {
        // 1. Obtener User Access Token
        const tokenRes = await fetch(`https://graph.facebook.com/v21.0/oauth/access_token?client_id=${FB_APP_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&client_secret=${FB_APP_SECRET}&code=${code}`);
        const tokenData = await tokenRes.json();

        if (tokenData.error) throw new Error(tokenData.error.message);
        
        const userAccessToken = tokenData.access_token;

        // 2. Obtener lista de páginas para sacar el Page Token y el IG ID
        const accountsRes = await fetch(`https://graph.facebook.com/v21.0/me/accounts?fields=name,access_token,instagram_business_account&access_token=${userAccessToken}`);
        const accountsData = await accountsRes.json();

        if (accountsData.error) throw new Error(accountsData.error.message);

        // Tomamos la primera página que tenga Instagram vinculado o simplemente la primera
        const page = accountsData.data.find((p: any) => p.instagram_business_account) || accountsData.data[0];

        if (!page) {
            throw new Error("No se encontraron páginas de Facebook vinculadas a esta cuenta.");
        }

        const fbPageId = page.id;
        const fbPageAccessToken = page.access_token;
        const igAccountId = page.instagram_business_account?.id || null;

        // 3. Guardar en Sanity
        const { sanityWriteClient } = await import("@/lib/sanity.server");
        
        // Buscamos el documento de ajustes (asumimos que existe uno con ID 'siteSettings' o similar)
        // Usamos una consulta para encontrar el ID del documento siteSettings
        const siteSettings = await sanityWriteClient.fetch(`*[_type == "siteSettings"][0]`);
        
        if (!siteSettings) {
            throw new Error("No se encontró el documento de Ajustes del Portal en Sanity.");
        }

        await sanityWriteClient
            .patch(siteSettings._id)
            .set({
                fb_page_id: fbPageId,
                fb_page_access_token: fbPageAccessToken,
                ig_account_id: igAccountId
            })
            .commit();

        // 4. Redirigir de vuelta al dashboard con éxito
        return NextResponse.redirect(`${process.env.NEXTAUTH_URL || 'https://www.solocasaschile.com'}/dashboard/social?connected=true`);

    } catch (err: any) {
        return NextResponse.redirect(`${process.env.NEXTAUTH_URL || 'https://www.solocasaschile.com'}/dashboard/social?error=${encodeURIComponent(err.message)}`);
    }
}
