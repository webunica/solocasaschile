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
            name: 'site_logo',
            title: 'Logotipo Principal (Cabecera)',
            type: 'image',
            description: 'Se mostrará en la barra superior del sitio web.',
            options: { hotspot: true }
        }),
        defineField({
            name: 'site_favicon',
            title: 'Favicon / Icono (Pestaña Navegador)',
            type: 'image',
            description: 'Aparecerá junto al título en la pestaña del navegador.',
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
        // ─── Contacto / Footer ───────────────────────────────────
        defineField({
            name: 'contact_section',
            title: '📞 Información de Contacto (Footer)',
            type: 'string',
            readOnly: true,
            initialValue: '───────────────────────────────────',
        }),
        defineField({
            name: 'contact_phones',
            title: 'Teléfonos de Contacto (Footer)',
            type: 'array',
            of: [{ type: 'string' }],
            description: 'Añade hasta 2 números de teléfono (Ej: +56 9 1234 5678). Se mostrarán en el pie de página.',
            validation: (Rule: any) => Rule.max(2)
        }),
    ],
    preview: {
        prepare() {
            return { title: '⚙️ Ajustes del Portal', subtitle: 'Solo el Administrador puede editar esto' }
        }
    }
})
