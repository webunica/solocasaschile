import { NextRequest, NextResponse } from "next/server";
import { sanityClient } from "@/lib/sanity.client";
import { Resend } from "resend";

const SETTINGS_DOC_ID = "site-settings-singleton";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { company, contact, email, phone, subject, message } = body;

    if (!contact || !email) {
      return NextResponse.json({ error: "Faltan datos requeridos" }, { status: 400 });
    }

    // --- Leer configuración desde Sanity ---
    const siteSettings = await sanityClient.fetch(
      `*[_type == "siteSettings" && _id == $id][0]{ resend_api_key, from_email, admin_email }`,
      { id: SETTINGS_DOC_ID },
      { cache: "no-store" }
    );

    const RESEND_API_KEY = siteSettings?.resend_api_key || process.env.RESEND_API_KEY || "";
    const ADMIN_EMAIL = "contacto@solocasaschile.com"; 
    const FROM_EMAIL = siteSettings?.from_email || process.env.FROM_EMAIL || "no-reply@solocasaschile.com";

    if (!RESEND_API_KEY) {
      return NextResponse.json({ error: "Correo no configurado" }, { status: 500 });
    }

    const resend = new Resend(RESEND_API_KEY);

    // Mapeo de asuntos legibles
    const subjectLabels: Record<string, string> = {
        constructora: "Soy una Constructora (Quiero unirme)",
        cliente: "Busco una casa (Más información)",
        alianza: "Alianzas Comerciales",
        soporte: "Soporte / Otros"
    };

    const subjectText = subjectLabels[subject] || subject || "Nueva Consulta";

    // HTML para el correo a contacto@
    const adminEmailHtml = `
<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"></head>
<body style="font-family: Arial, sans-serif; background: #020110; color: white; padding: 24px;">
  <div style="max-width: 600px; margin: 0 auto; background: #0a0a1a; border: 1px solid #37FFDB30; border-radius: 24px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.5);">
    <div style="padding: 40px; text-align: center; background: linear-gradient(to right, #3200C1, #37FFDB20);">
      <h1 style="color: #37FFDB; margin: 0; font-size: 20px; font-weight: 900; text-transform: uppercase;">Nueva Consulta Coming Soon</h1>
      <p style="color: white; margin-top: 10px; font-size: 14px;">Asunto: <strong>${subjectText}</strong></p>
    </div>
    <div style="padding: 40px;">
      <h2 style="font-size: 14px; text-transform: uppercase; color: #37FFDB; letter-spacing: 1px; margin-bottom: 16px;">Detalles:</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <tr><td style="padding: 10px 0; color: #94a3b8; font-size: 13px; font-weight: bold; width: 40%;">Constructora:</td><td style="padding: 10px 0; color: white; font-size: 14px;">${company || "No especificada"}</td></tr>
        <tr><td style="padding: 10px 0; color: #94a3b8; font-size: 13px; font-weight: bold;">Contacto:</td><td style="padding: 10px 0; color: white; font-size: 14px;">${contact}</td></tr>
        <tr><td style="padding: 10px 0; color: #94a3b8; font-size: 13px; font-weight: bold;">Email:</td><td style="padding: 10px 0; color: white; font-size: 14px;">${email}</td></tr>
        <tr><td style="padding: 10px 0; color: #94a3b8; font-size: 13px; font-weight: bold;">Teléfono:</td><td style="padding: 10px 0; color: white; font-size: 14px;">${phone || "No especificado"}</td></tr>
        <tr><td style="padding: 20px 0 10px; color: #94a3b8; font-size: 13px; font-weight: bold;" colspan="2">Mensaje:</td></tr>
        <tr><td style="padding: 10px; color: #cbd5e1; font-size: 14px; line-height: 1.6; background: rgba(255,255,255,0.05); border-radius: 12px;" colspan="2">${message}</td></tr>
      </table>
    </div>
  </div>
</body>
</html>`;

    await resend.emails.send({
      from: FROM_EMAIL,
      to: [ADMIN_EMAIL],
      replyTo: email,
      subject: `🔔 [${subjectText}] - ${contact} (${company || "Indiv."})`,
      html: adminEmailHtml,
    });

    // Email de Confirmación al Cliente
    const clientEmailHtml = `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"></head>
<body style="font-family: Arial, sans-serif; background: #020110; color: white; padding: 24px;">
  <div style="max-width: 600px; margin: 0 auto; background: #0a0a1a; border: 1px solid #37FFDB30; border-radius: 20px; overflow: hidden; text-align: center;">
    <div style="padding: 40px;">
      <div style="font-size: 40px; margin-bottom: 20px;">🏠</div>
      <h1 style="color: #37FFDB; margin: 0; font-size: 22px; font-weight: 900;">¡Recibimos tu consulta!</h1>
      <p style="color: #94a3b8; margin: 12px 0 0; font-size: 15px; line-height: 1.6;">
        Hola <strong>${contact}</strong>, gracias por contactar a solocasaschile.com.<br>
        Nuestro equipo revisará tu mensaje por <strong>${subjectText}</strong> y te contactaremos en breve.
      </p>
    </div>
  </div>
</body></html>`;

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
