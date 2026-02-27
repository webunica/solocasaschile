import { defineField, defineType } from 'sanity'

export const leadType = defineType({
    name: 'lead',
    title: 'Mensajes de Contacto (Leads)',
    type: 'document',
    fields: [
        defineField({ name: 'name', title: 'Nombre del Interesado', type: 'string' }),
        defineField({ name: 'email', title: 'Correo Electrónico', type: 'string' }),
        defineField({ name: 'phone', title: 'Teléfono / WhatsApp', type: 'string' }),
        defineField({ name: 'message', title: 'Mensaje', type: 'text' }),
        defineField({ name: 'model_name', title: 'Modelo Consultado', type: 'string' }),
        defineField({ name: 'model_id', title: 'ID Sanity del Modelo', type: 'string' }),
        defineField({ name: 'company_name', title: 'Empresa Constructora', type: 'string' }),
        defineField({ name: 'company_email', title: 'Correo de la Empresa (usado para CC)', type: 'string' }),
        defineField({
            name: 'status',
            title: 'Estado del Lead',
            type: 'string',
            options: {
                list: [
                    { title: '🟡 Nuevo', value: 'new' },
                    { title: '🔵 En Contacto', value: 'contacted' },
                    { title: '✅ Cerrado', value: 'closed' },
                    { title: '❌ Descartado', value: 'discarded' },
                ]
            },
            initialValue: 'new',
        }),
        defineField({ name: 'notes', title: 'Notas Internas (Admin)', type: 'text' }),
    ],
    orderings: [
        { title: 'Más Recientes', name: 'createdAtDesc', by: [{ field: '_createdAt', direction: 'desc' }] }
    ],
    preview: {
        select: { title: 'name', subtitle: 'company_name', description: 'model_name' },
        prepare({ title, subtitle, description }) {
            return { title: title || 'Sin nombre', subtitle: `${subtitle} — ${description}` }
        }
    }
})
