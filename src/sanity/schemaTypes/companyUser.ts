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
                    { title: '🟢 Plan Starter — 3 UF | Hasta 5 modelos, visibilidad estándar', value: 'starter' },
                    { title: '🔵 Plan Crecer — 6 UF | Catálogo ilimitado + prioridad en buscador + leads calificados', value: 'builder' },
                    { title: '🟣 Plan Destacado — 14 UF | Todo Crecer + banners destacados + Blog exclusivo', value: 'constructor' },
                ],
            },
            initialValue: 'starter',
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
        defineField({ name: 'contact_phone', title: 'Teléfono Comercial (Receptor Leads)', type: 'string' }),
    ],
    preview: {
        select: { title: 'company_name', subtitle: 'plan', media: 'logo' },
        prepare({ title, subtitle, media }) {
            const planLabels: Record<string, string> = {
                starter: '🟢 Starter',
                builder: '🔵 Builder',
                constructor: '🟣 Constructor',
            };
            return {
                title,
                subtitle: planLabels[subtitle] || 'Sin Plan',
                media
            };
        }
    }
})
