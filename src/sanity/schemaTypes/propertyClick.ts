import { defineField, defineType } from 'sanity'

export const propertyClickType = defineType({
    name: 'propertyClick',
    title: 'Clics en Publicaciones',
    type: 'document',
    fields: [
        defineField({ name: 'model_id', title: 'ID Modelo', type: 'string' }),
        defineField({ name: 'model_name', title: 'Nombre Modelo', type: 'string' }),
        defineField({ name: 'company_name', title: 'Empresa', type: 'string' }),
        defineField({ name: 'target_url', title: 'URL Destino', type: 'url' }),
        defineField({ name: 'source', title: 'Origen', type: 'string', description: '"card" (listado) o "detail" (página de detalle)' }),
        defineField({ name: 'ip_anon', title: 'IP (Anónima)', type: 'string' }),
        defineField({ name: 'user_agent', title: 'User Agent', type: 'string' }),
        defineField({ name: 'clicked_at', title: 'Fecha del Clic', type: 'datetime' }),
    ],
    preview: {
        select: { title: 'model_name', subtitle: 'company_name', description: 'clicked_at' }
    }
})
