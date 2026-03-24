import { NextRequest, NextResponse } from "next/server";
import { sanityClient } from "@/lib/sanity.client";
import { Resend } from "resend";

const SETTINGS_DOC_ID = "site-settings-singleton";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { company, contact, email, message } = body;

    if (!contact || !email) {
      return NextResponse.json({ error: "Faltan datos requeridos" }, { status: 400 });
    }

    // --- Leer configuración desde Sanity (Reusable de api/contact) ---
    const siteSettings = await sanityClient.fetch(
      `*[_type == "siteSettings" && _id == $id][0]{ resend_api_key, from_email, admin_email }`,
      { id: SETTINGS_DOC_ID },
      { cache: "no-store" }
    );

    const RESEND_API_KEY = siteSettings?.resend_api_key || process.env.RESEND_API_KEY || "";
    // El usuario pidió específicamente contacto@ (o el admin email por defecto)
    const ADMIN_EMAIL = "contacto@solocasaschile.com"; 
    const FROM_EMAIL = siteSettings?.from_email || process.env.FROM_EMAIL || "no-reply@solocasaschile.com";

    if (!RESEND_API_KEY) {
      console.warn("⚠️ RESEND_API_KEY no configurado en Sanity.");
      return NextResponse.json({ error: "Correo no configurado" }, { status: 500 });
    }

    const resend = new Resend(RESEND_API_KEY);

    // HTML para el correo a contacto@
    const adminEmailHtml = `
<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"></head>
<body style="font-family: Arial, sans-serif; background: #020110; color: white; padding: 24px;">
  <div style="max-width: 600px; margin: 0 auto; background: #0a0a1a; border: 1px solid #37FFDB30; border-radius: 24px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.5);">
    <div style="padding: 40px; text-align: center; background: linear-gradient(to right, #3200C1, #37FFDB20);">
      <h1 style="color: #37FFDB; margin: 0; font-size: 24px; font-weight: 900; text-transform: uppercase; letter-spacing: 2px;">Nueva Consulta - Coming Soon</h1>
    </div>
    <div style="padding: 40px;">
      <div style="margin-bottom: 32px;">
        <h2 style="font-size: 14px; text-transform: uppercase; color: #37FFDB; letter-spacing: 1px; margin-bottom: 16px;">Detalles de la Consulta:</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 12px 0; color: #94a3b8; font-size: 13px; font-weight: bold; width: 40%;">Constructora:</td>
            <td style="padding: 12px 0; color: white; font-size: 14px;">${company || "No especificada"}</td>
          </tr>
          <tr>
            <td style="padding: 12px 0; color: #94a3b8; font-size: 13px; font-weight: bold;">Contacto:</td>
            <td style="padding: 12px 0; color: white; font-size: 14px;">${contact}</td>
          </tr>
          <tr>
            <td style="padding: 12px 0; color: #94a3b8; font-size: 13px; font-weight: bold;">Email:</td>
            <td style="padding: 12px 0; color: white; font-size: 14px;"><a href="mailto:${email}" style="color: #37FFDB; text-decoration: none;">${email}</a></td>
          </tr>
          <tr>
            <td style="padding: 12px 0; color: #94a3b8; font-size: 13px; font-weight: bold; vertical-align: top;">Mensaje:</td>
            <td style="padding: 12px 0; color: #cbd5e1; font-size: 14px; line-height: 1.6;">${message}</td>
          </tr>
        </table>
      </div>
    </div>
    <div style="padding: 20px; background: #020110; text-align: center;">
      <p style="color: #475569; font-size: 11px;">solocasaschile.com — El Comparador de Chile</p>
    </div>
  </div>
</body>
</html>`;

    // 1. Enviar a contacto@solocasaschile.com
    await resend.emails.send({
      from: FROM_EMAIL,
      to: [ADMIN_EMAIL],
      replyTo: email,
      subject: `🔔 Nueva Consulta de ${contact} (${company || "Empresa"})`,
      html: adminEmailHtml,
    });

    // 2. Email de Confirmación al Cliente
    const clientEmailHtml = `
<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"></head>
<body style="font-family: Arial, sans-serif; background: #020110; color: white; padding: 24px;">
  <div style="max-width: 600px; margin: 0 auto; background: #0a0a1a; border: 1px solid #37FFDB30; border-radius: 24px; overflow: hidden;">
    <div style="padding: 40px; text-align: center;">
      <div style="font-size: 48px; margin-bottom: 16px;">✅</div>
      <h1 style="color: #37FFDB; margin: 0; font-size: 24px; font-weight: 900;">¡Recibimos tu consulta!</h1>
      <p style="color: #94a3b8; margin: 8px 0 0; font-size: 14px;">Gracias por contactarnos, ${contact}.</p>
    </div>
    <div style="padding: 40px; text-align: center; border-top: 1px solid #1e1e30;">
      <p style="color: white; font-size: 16px; font-weight: 500; line-height: 1.6;">
        Un ejecutivo de <strong style="color: #37FFDB;">solocasaschile.com</strong> revisará tu mensaje y lo contactaremos a la brevedad para brindarte toda la información que necesitas.
      </p>
    </div>
    <div style="padding: 24px; text-align: center; background: #020110;">
      <p style="color: #475569; font-size: 11px;">© 2024 solocasaschile.com</p>
    </div>
  </div>
</body>
</html>`;

    await resend.emails.send({
      from: FROM_EMAIL,
      to: [email],
      subject: `✅ Consulta Recibida - solocasaschile.com`,
      html: clientEmailHtml,
    });

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error("Consultation API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
