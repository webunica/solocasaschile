import { defineField, defineType } from 'sanity'

export const companyUserType = defineType({
    name: 'companyUser',
    title: 'Cuenta de Constructora (B2B)',
    type: 'document',
    fields: [
        defineField({ name: 'company_name', title: 'Nombre Oficial de la Empresa', type: 'string', validation: Rule => Rule.required() }),
        defineField({
            name: 'slug',
            title: 'URL Pública (Slug)',
            type: 'slug',
            options: {
                source: 'company_name',
                maxLength: 96,
            },
            validation: Rule => Rule.required(),
        }),
        defineField({
            name: 'is_verified',
            title: '¿Empresa Verificada?',
            type: 'boolean',
            description: 'Solo disponible para planes Pro y Elite. Muestra un sello de verificación en el perfil.',
            initialValue: false,
        }),
        defineField({
            name: 'description',
            title: 'Descripción de la Empresa',
            type: 'text',
            description: 'Un resumen de quiénes son y qué ofrecen (Max 500 caracteres).',
            validation: Rule => Rule.max(500),
        }),
        defineField({
            name: 'cover_image',
            title: 'Imagen de Portada',
            type: 'image',
            options: { hotspot: true },
            description: 'Solo disponible para plan Elite. Se usará en la Landing Premium.'
        }),
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
            title: 'Fecha Fin de Prueba',
            type: 'datetime',
            description: 'Calculado automáticamente al registrarse (4 meses). Si la fecha pasa y el plan es free, la cuenta se pausa.',
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
            name: 'whatsapp_number',
            title: 'Número WhatsApp para Ficha (Formato internacional, ej: 56912345678)',
            type: 'string',
            description: 'Se mostrará como botón flotante en los modelos'
        }),
        defineField({
            name: 'meeting_url',
            title: 'Enlace para Agendar Reunión (ej: Calendly)',
            type: 'url',
            description: 'Se habilitará el botón "Agendar Reunión" en la ficha del modelo.'
        }),
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

        // ─── Información de Autoridad y Confianza ────────────────
        defineField({
            name: 'authority_section',
            title: '🏆 Autoridad y Confianza',
            type: 'string',
            readOnly: true,
            initialValue: '───────────────────────────────────',
        }),
        defineField({
            name: 'years_experience',
            title: 'Años de Experiencia',
            type: 'number',
            description: 'Años operando en el mercado.',
        }),
        defineField({
            name: 'projects_completed_count',
            title: 'Casas/Proyectos Realizados',
            type: 'number',
            description: 'Número total de proyectos finalizados.',
        }),
        defineField({
            name: 'badges',
            title: 'Insignias de Calidad',
            type: 'array',
            of: [{ type: 'string' }],
            options: {
                list: [
                    { title: 'ISO 9001', value: 'iso_9001' },
                    { title: 'Calidad Certificada', value: 'quality_cert' },
                    { title: 'Construcción Sustentable', value: 'sustainable' },
                    { title: 'Empresa Destacada', value: 'featured_company' },
                    { title: 'Garantía Extendida', value: 'extended_warranty' },
                ]
            },
            description: 'Sellos que se mostrarán en tu perfil público.'
        }),
        defineField({
            name: 'coverage_areas',
            title: 'Zonas de Cobertura / Regiones',
            type: 'array',
            of: [{ type: 'string' }],
            options: {
                list: [
                    { title: 'Arica y Parinacota', value: 'arica_parinacota' },
                    { title: 'Tarapacá', value: 'tarapaca' },
                    { title: 'Antofagasta', value: 'antofagasta' },
                    { title: 'Atacama', value: 'atacama' },
                    { title: 'Coquimbo', value: 'coquimbo' },
                    { title: 'Valparaíso', value: 'valparaiso' },
                    { title: 'Metropolitana', value: 'metropolitana' },
                    { title: 'O\'Higgins', value: 'ohiggins' },
                    { title: 'Maule', value: 'maule' },
                    { title: 'Ñuble', value: 'nuble' },
                    { title: 'Biobío', value: 'biobio' },
                    { title: 'Araucanía', value: 'araucania' },
                    { title: 'Los Ríos', value: 'los_rios' },
                    { title: 'Los Lagos', value: 'los_lagos' },
                    { title: 'Aysén', value: 'aysen' },
                    { title: 'Magallanes', value: 'magallanes' },
                    { title: 'Todo Chile', value: 'todo_chile' },
                ]
            },
            description: 'Regiones donde la empresa realiza obras.'
        }),
        defineField({
            name: 'certifications',
            title: 'Galería de Certificaciones/Logros',
            type: 'array',
            of: [
                {
                    type: 'image',
                    options: { hotspot: true },
                    fields: [{ name: 'title', type: 'string', title: 'Título del Logro' }]
                }
            ],
            description: 'Diplomas, sellos ISO oficiales, etc.'
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
