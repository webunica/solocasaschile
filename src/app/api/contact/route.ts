import { NextRequest, NextResponse } from "next/server";
import { sanityWriteClient } from "@/lib/sanity.server";
import { sanityClient } from "@/lib/sanity.client";
import { Resend } from "resend";

const SETTINGS_DOC_ID = "site-settings-singleton";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, message, modelName, modelId, companyName, companyEmail } = body;

    if (!name || !email || !modelId) {
      return NextResponse.json({ error: "Faltan datos requeridos" }, { status: 400 });
    }

    // --- Leer configuración desde Sanity ---
    const siteSettings = await sanityClient.fetch(
      `*[_type == "siteSettings" && _id == $id][0]{ resend_api_key, from_email, admin_email }`,
      { id: SETTINGS_DOC_ID },
      { cache: "no-store" }
    );

    const RESEND_API_KEY = siteSettings?.resend_api_key || process.env.RESEND_API_KEY || "";
    const ADMIN_EMAIL = siteSettings?.admin_email || process.env.ADMIN_EMAIL || "admin@solocasaschile.com";
    const FROM_EMAIL = siteSettings?.from_email || process.env.FROM_EMAIL || "no-reply@solocasaschile.com";

    if (!RESEND_API_KEY) {
      // Guardamos el lead en Sanity igualmente pero advertimos sobre el email
      console.warn("⚠️ RESEND_API_KEY no configurado — el lead se guardará pero no se enviará email.");
    }

    const resend = new Resend(RESEND_API_KEY || "dummy-key");


    // 1. Guardar Lead en Sanity
    const leadDoc = await sanityWriteClient.create({
      _type: "lead",
      name,
      email,
      phone: phone || "",
      message: message || "",
      model_name: modelName,
      model_id: modelId,
      company_name: companyName,
      company_email: companyEmail || "",
      status: "new",
    });

    // 2. Email a la Empresa Constructora (destinatario principal) + Admin en CC
    const ccEmails = [ADMIN_EMAIL];
    const toEmails = companyEmail ? [companyEmail] : [ADMIN_EMAIL];

    const emailHtml = `
<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"></head>
<body style="font-family: Arial, sans-serif; background: #f8fafc; padding: 24px;">
  <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08);">
    
    <!-- Header -->
    <div style="background: #3200C1; padding: 32px; text-align: center;">
      <h1 style="color: #37FFDB; margin: 0; font-size: 22px; font-weight: 900;">🏠 Nuevo Lead en solocasaschile.com</h1>
      <p style="color: rgba(255,255,255,0.8); margin: 8px 0 0; font-size: 14px;">Un interesado ha solicitado asesoría sobre uno de tus modelos</p>
    </div>

    <!-- Lead Info -->
    <div style="padding: 32px;">
      <div style="background: #37FFDB20; border: 1px solid #37FFDB; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
        <h2 style="color: #3200C1; margin: 0 0 16px; font-size: 16px; font-weight: 900;">📋 Modelo Consultado</h2>
        <p style="margin: 0; font-size: 20px; font-weight: 900; color: #1e293b;">${modelName}</p>
        <p style="margin: 4px 0 0; font-size: 13px; color: #64748b;">Empresa: <strong>${companyName}</strong></p>
      </div>

      <h2 style="color: #3200C1; font-size: 16px; font-weight: 900; margin: 0 0 16px;">👤 Datos del Interesado</h2>
      
      <table style="width: 100%; border-collapse: collapse;">
        <tr style="border-bottom: 1px solid #f1f5f9;">
          <td style="padding: 12px 0; font-weight: 700; color: #475569; font-size: 13px; width: 35%;">Nombre</td>
          <td style="padding: 12px 0; font-size: 14px; color: #1e293b; font-weight: 600;">${name}</td>
        </tr>
        <tr style="border-bottom: 1px solid #f1f5f9;">
          <td style="padding: 12px 0; font-weight: 700; color: #475569; font-size: 13px;">Correo</td>
          <td style="padding: 12px 0; font-size: 14px; color: #1e293b;"><a href="mailto:${email}" style="color: #3200C1;">${email}</a></td>
        </tr>
        <tr style="border-bottom: 1px solid #f1f5f9;">
          <td style="padding: 12px 0; font-weight: 700; color: #475569; font-size: 13px;">Teléfono</td>
          <td style="padding: 12px 0; font-size: 14px; color: #1e293b;">${phone || "No especificado"}</td>
        </tr>
        <tr>
          <td style="padding: 12px 0; font-weight: 700; color: #475569; font-size: 13px; vertical-align: top;">Mensaje</td>
          <td style="padding: 12px 0; font-size: 14px; color: #1e293b; font-style: italic;">"${message || "Sin mensaje adicional"}"</td>
        </tr>
      </table>

      <div style="margin-top: 24px; padding: 16px; background: #fef3c7; border-radius: 10px; border: 1px solid #fde68a;">
        <p style="margin: 0; font-size: 12px; color: #92400e; font-weight: 600;">⚡ Este lead ha sido registrado automáticamente en el panel de administración de solocasaschile.com</p>
      </div>
    </div>

    <!-- Footer -->
    <div style="background: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0;">
      <p style="margin: 0; font-size: 11px; color: #94a3b8;">solocasaschile.com — Comparador Inmobiliario B2B Chile</p>
    </div>
  </div>
</body>
</html>`;

    // 2. Enviar emails solo si hay API Key configurada
    if (RESEND_API_KEY) {
      // ── 2a. Email a la Empresa + Admin en CC ──────────────────
      const ccEmails = [ADMIN_EMAIL];
      const toEmails = companyEmail ? [companyEmail] : [ADMIN_EMAIL];

      await resend.emails.send({
        from: FROM_EMAIL,
        to: toEmails,
        cc: ccEmails.filter(e => !toEmails.includes(e)),
        replyTo: email,
        subject: `🏠 Nuevo Lead: ${name} consulta por "${modelName}" (${companyName})`,
        html: emailHtml,
      });

      // ── 2b. Email de Confirmación al Interesado ───────────────
      const confirmationHtml = `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"></head>
<body style="font-family: Arial, sans-serif; background: #f8fafc; padding: 24px;">
  <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08);">
    <div style="background: #3200C1; padding: 32px; text-align: center;">
      <p style="font-size: 48px; margin: 0 0 12px;">✅</p>
      <h1 style="color: #37FFDB; margin: 0; font-size: 22px; font-weight: 900;">¡Solicitud Recibida!</h1>
      <p style="color: rgba(255,255,255,0.85); margin: 8px 0 0; font-size: 14px;">Te contactaremos a la brevedad.</p>
    </div>
    <div style="padding: 36px;">
      <p style="color: #1e293b; font-size: 15px; font-weight: 600; margin: 0 0 8px;">Hola, <strong>${name}</strong> 👋</p>
      <p style="color: #475569; font-size: 14px; line-height: 1.7; margin: 0 0 24px;">
        Hemos recibido tu solicitud de asesoría para el modelo <strong style="color: #3200C1;">${modelName}</strong>.
        Un ejecutivo de <strong>${companyName}</strong> revisará tu consulta y se pondrá en contacto a la brevedad.
      </p>
      <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin-bottom: 20px;">
        <p style="color: #3200C1; font-size: 12px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.08em; margin: 0 0 12px;">📋 Resumen de tu solicitud</p>
        <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
          <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 8px 0; color: #64748b; font-weight: 700; width: 40%;">Modelo</td><td style="padding: 8px 0; color: #1e293b; font-weight: 600;">${modelName}</td></tr>
          <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 8px 0; color: #64748b; font-weight: 700;">Empresa</td><td style="padding: 8px 0; color: #1e293b;">${companyName}</td></tr>
          <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 8px 0; color: #64748b; font-weight: 700;">Tu email</td><td style="padding: 8px 0; color: #1e293b;">${email}</td></tr>
          ${phone ? `<tr><td style="padding: 8px 0; color: #64748b; font-weight: 700;">Teléfono</td><td style="padding: 8px 0; color: #1e293b;">${phone}</td></tr>` : ""}
          ${message ? `<tr><td style="padding: 8px 0; color: #64748b; font-weight: 700; vertical-align: top;">Mensaje</td><td style="padding: 8px 0; color: #64748b; font-style: italic;">"${message}"</td></tr>` : ""}
        </table>
      </div>
      <div style="background: #ecfdf5; border: 1px solid #6ee7b7; border-radius: 10px; padding: 16px;">
        <p style="margin: 0; font-size: 13px; color: #065f46; font-weight: 600;">
          💡 Si tienes alguna duda urgente, puedes responder directamente a este correo y un asesor de solocasaschile.com te apoyará.
        </p>
      </div>
    </div>
    <div style="background: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0;">
      <p style="margin: 0 0 4px; font-size: 12px; font-weight: 900; color: #3200C1;">solocasaschile.com</p>
      <p style="margin: 0; font-size: 11px; color: #94a3b8;">Comparador Inmobiliario B2B — Chile</p>
    </div>
  </div>
</body>
</html>`;

      await resend.emails.send({
        from: FROM_EMAIL,
        to: [email],
        subject: `✅ Recibimos tu solicitud para "${modelName}" — solocasaschile.com`,
        html: confirmationHtml,
      });
    }

    return NextResponse.json({ success: true, leadId: leadDoc._id });

  } catch (error: any) {
    console.error("API Contact Error:", error);
    return NextResponse.json({ error: error.message || "Error interno del servidor" }, { status: 500 });
  }
}
