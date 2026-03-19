import { defineField, defineType } from 'sanity'

export const companyUserType = defineType({
    name: 'companyUser',
    title: 'Cuenta de Constructora (B2B)',
    type: 'document',
    fields: [
        defineField({ name: 'company_name', title: 'Nombre Oficial de la Empresa', type: 'string', validation: Rule => Rule.required() }),
        defineField({
            name: 'email',
            title: 'Correo de Acceso (Usuario)',
            type: 'string',
            validation: Rule => Rule.required().email()
        }),
        defineField({
            name: 'role',
            title: 'Rol en la Plataforma',
            type: 'string',
            options: {
                list: [
                    { title: 'Empresa / Constructora', value: 'company' },
                    { title: 'Administrador Principal', value: 'admin' }
                ],
            },
            initialValue: 'company',
            validation: Rule => Rule.required()
        }),
        defineField({
            name: 'plan',
            title: 'Plan de Suscripción',
            type: 'string',
            options: {
                list: [
                    { title: '🌟 Plan Inicial — 3 modelos, 4 fotos, WhatsApp Link', value: 'free' },
                    { title: '🚀 Plan Pro — 20 modelos, 10 fotos, Video, PDF, Reunión', value: 'pro' },
                    { title: '👑 Plan Elite — Ilimitados, 20 fotos, Comparador, Landing, Home', value: 'elite' },
                ],
            },
            initialValue: 'free',
        }),
        defineField({
            name: 'trial_ends_at',
            title: 'Fecha Fin de Prueba (Plan Gratuito)',
            type: 'datetime',
            description: 'Calculado automáticamente al registrarse (6 meses). Si la fecha pasa y el plan es free, la cuenta se pausa.',
        }),
        defineField({
            name: 'is_active',
            title: 'Cuenta Activa',
            type: 'boolean',
            description: 'Si está desactivada, la empresa NO podrá iniciar sesión en el portal.',
            initialValue: true,
        }),
        defineField({
            name: 'password',
            title: 'Contraseña Interna',
            type: 'string',
            description: 'Hash encriptado, no editar manualmente.',
            hidden: true
        }),
        defineField({
            name: 'raw_password_generator',
            title: 'Forzar Nueva Contraseña',
            type: 'string',
            description: 'Solo Administrador: Escribe aquí la nueva clave para que el webhook la encripte, o para gestión manual.'
        }),
        defineField({ name: 'logo', title: 'Logotipo Corporativo', type: 'image', options: { hotspot: true } }),
        defineField({ name: 'favicon', title: 'Favicon / Icono (Redes)', type: 'image', options: { hotspot: true }, description: 'Símbolo o icono de tu empresa para la web y redes.' }),
        defineField({ name: 'contact_phone', title: 'Teléfono Comercial (Receptor Leads)', type: 'string' }),
        defineField({
            name: 'reset_password_token',
            title: 'Token de Recuperación',
            type: 'string',
            hidden: true
        }),
        defineField({
            name: 'reset_password_expires',
            title: 'Expiración del Token',
            type: 'datetime',
            hidden: true
        }),
    ],
    preview: {
        select: { title: 'company_name', subtitle: 'plan', media: 'logo' },
        prepare({ title, subtitle, media }) {
            const planLabels: Record<string, string> = {
                free: '🌟 Inicial (Gratis)',
                pro: '🚀 Plan Pro',
                elite: '👑 Plan Elite',
            };
            return {
                title,
                subtitle: planLabels[subtitle] || 'Sin Plan',
                media
            };
        }
    }
})
