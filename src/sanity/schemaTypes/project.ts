import { defineField, defineType } from 'sanity'

export const projectType = defineType({
    name: 'project',
    title: 'Proyecto Realizado / Obra Terminada',
    type: 'document',
    fields: [
        defineField({
            name: 'company',
            title: 'Empresa Constructora',
            type: 'reference',
            to: [{ type: 'companyUser' }],
            validation: Rule => Rule.required(),
        }),
        defineField({
            name: 'title',
            title: 'Nombre del Proyecto / Ubicación',
            type: 'string',
            description: 'Ej: Casa Mediterránea en Colina, Condominio Ayres.',
            validation: Rule => Rule.required(),
        }),
        defineField({
            name: 'description',
            title: 'Breve Descripción',
            type: 'text',
            rows: 3,
        }),
        defineField({
            name: 'images',
            title: 'Galería de Fotos Reales',
            type: 'array',
            of: [{ type: 'image', options: { hotspot: true } }],
        }),
        defineField({
            name: 'location_name',
            title: 'Nombre de la ubicación (Ciudad/Región)',
            type: 'string',
            description: 'Ej: Curacaví, Región Metropolitana',
        }),
        defineField({
            name: 'location',
            title: 'Geolocalización exacta para el Mapa',
            type: 'geopoint',
            description: 'Abre el mapa y selecciona el punto exacto donde se instaló la casa.',
        }),
        defineField({
            name: 'completion_date',
            title: 'Fecha de Entrega',
            type: 'date',
        }),
    ],
    preview: {
        select: {
            title: 'title',
            company: 'company.company_name',
            media: 'images.0'
        },
        prepare({ title, company, media }) {
            return {
                title,
                subtitle: company,
                media
            }
        }
    }
})
