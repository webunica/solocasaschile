import { defineField, defineType } from 'sanity'

export const modelViewType = defineType({
    name: 'modelView',
    title: 'Vistas de Modelos',
    type: 'document',
    fields: [
        defineField({ name: 'model_id', title: 'ID Modelo', type: 'string' }),
        defineField({ name: 'model_name', title: 'Nombre Modelo', type: 'string' }),
        defineField({ name: 'company_name', title: 'Empresa', type: 'string' }),
        defineField({ name: 'ip_anon', title: 'IP (Anónima)', type: 'string' }),
        defineField({ name: 'user_agent', title: 'User Agent', type: 'string' }),
        defineField({ name: 'viewed_at', title: 'Fecha de la Vista', type: 'datetime' }),
    ],
    preview: {
        select: { title: 'model_name', subtitle: 'company_name', description: 'viewed_at' }
    }
})
