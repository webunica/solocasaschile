import { defineField, defineType } from 'sanity'

export const siteSettingsType = defineType({
    name: 'siteSettings',
    title: 'Ajustes del Portal',
    type: 'document',
    fields: [
        // ─── Email / Resend ───────────────────────────────────────
        defineField({
            name: 'resend_section',
            title: '📧 Configuración de Emails (Resend)',
            type: 'string',
            readOnly: true,
            initialValue: '───────────────────────────────────',
        }),
        defineField({
            name: 'resend_api_key',
            title: 'Resend API Key',
            type: 'string',
            description: 'Obtén tu API Key en resend.com → API Keys. Empieza con "re_".',
        }),
        defineField({
            name: 'from_email',
            title: 'Email Remitente',
            type: 'string',
            description: 'Ej: no-reply@solocasaschile.com (debe estar verificado en Resend)',
            initialValue: 'no-reply@solocasaschile.com',
        }),
        defineField({
            name: 'admin_email',
            title: 'Email Administrador (recibe copia de todos los leads)',
            type: 'string',
            description: 'Ej: admin@solocasaschile.com',
            initialValue: 'admin@solocasaschile.com',
        }),

        // ─── Info del Portal ──────────────────────────────────────
        defineField({
            name: 'portal_section',
            title: '🏠 Información General del Portal',
            type: 'string',
            readOnly: true,
            initialValue: '───────────────────────────────────',
        }),
        defineField({
            name: 'site_name',
            title: 'Nombre del Sitio',
            type: 'string',
            initialValue: 'Solo Casas Chile',
        }),
        defineField({
            name: 'site_url',
            title: 'URL del Sitio',
            type: 'url',
            initialValue: 'https://solocasaschile.com',
        }),
        defineField({
            name: 'whatsapp_fallback',
            title: 'WhatsApp de Soporte (fallback si la empresa no tiene teléfono)',
            type: 'string',
            description: 'Formato internacional sin "+" ni espacios. Ej: 56912345678',
        }),
    ],
    preview: {
        prepare() {
            return { title: '⚙️ Ajustes del Portal', subtitle: 'Solo el Administrador puede editar esto' }
        }
    }
})
