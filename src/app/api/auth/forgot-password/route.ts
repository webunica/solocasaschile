import { NextRequest, NextResponse } from "next/server";
import { sanityClient } from "@/lib/sanity.client";
import { sanityWriteClient } from "@/lib/sanity.server";
import { Resend } from "resend";
import crypto from "crypto";

const SETTINGS_DOC_ID = "site-settings-singleton";

export async function POST(req: NextRequest) {
    try {
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json({ error: "El correo es requerido" }, { status: 400 });
        }

        const user = await sanityClient.fetch(
            `*[_type == "companyUser" && email == $email][0]`,
            { email } as Record<string, string>
        );

        if (!user) {
            // Por seguridad, retornamos 200 aunque no exista
            return NextResponse.json({ success: true });
        }

        if (user.is_active === false) {
            return NextResponse.json({ error: "Cuenta desactivada. Contacta soporte." }, { status: 403 });
        }

        // Generar token
        const token = crypto.randomBytes(32).toString('hex');
        const expires = new Date(Date.now() + 3600000).toISOString(); // 1 hora

        // Guardar token en Sanity
        await sanityWriteClient.patch(user._id)
            .set({
                reset_password_token: token,
                reset_password_expires: expires
            })
            .commit();

        // Leer configuración de Resend
        const siteSettings = await sanityClient.fetch(
            `*[_type == "siteSettings" && _id == $id][0]{ resend_api_key, from_email }`,
            { id: SETTINGS_DOC_ID },
            { cache: "no-store" }
        );

        const RESEND_API_KEY = siteSettings?.resend_api_key || process.env.RESEND_API_KEY;
        const FROM_EMAIL = siteSettings?.from_email || process.env.FROM_EMAIL || "no-reply@solocasaschile.com";

        if (!RESEND_API_KEY) {
            console.error("No hay RESEND_API_KEY configurado para enviar el enlace de recuperación");
            return NextResponse.json({ error: "Servicio de emails no configurado." }, { status: 500 });
        }

        const resend = new Resend(RESEND_API_KEY);
        const resetUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.solocasaschile.com'}/reset-password?token=${token}`;

        const emailHtml = `
<!DOCTYPE html>
<html lang="es">
<body style="font-family: Arial, sans-serif; background: #f8fafc; padding: 24px;">
    <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08);">
        <div style="background: #3200C1; padding: 32px; text-align: center;">
            <h1 style="color: #37FFDB; margin: 0; font-size: 22px; font-weight: 900;">Recuperación de Contraseña</h1>
        </div>
        <div style="padding: 32px;">
            <p style="color: #1e293b; font-size: 15px;">Hola <strong>${user.company_name}</strong>,</p>
            <p style="color: #475569; font-size: 14px; line-height: 1.6;">
                Recibimos una solicitud para restablecer la contraseña de tu cuenta en solocasaschile.com. 
                Haz clic en el siguiente botón para elegir una nueva contraseña:
            </p>
            <div style="text-align: center; margin: 32px 0;">
                <a href="${resetUrl}" style="background-color: #3200C1; color: #37FFDB; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Restablecer Contraseña</a>
            </div>
            <p style="color: #475569; font-size: 13px;">
                Este enlace expirará en 1 hora. Si no solicitaste este cambio, puedes ignorar este correo.
            </p>
        </div>
        <div style="background: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0;">
            <p style="margin: 0; font-size: 11px; color: #94a3b8;">solocasaschile.com — Comparador Inmobiliario B2B Chile</p>
        </div>
    </div>
</body>
</html>`;

        await resend.emails.send({
            from: FROM_EMAIL,
            to: [email],
            subject: "Recuperación de contraseña - solocasaschile.com",
            html: emailHtml,
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Error en forgot-password:", error);
        return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
    }
}
