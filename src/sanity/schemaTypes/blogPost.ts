import { defineField, defineType } from 'sanity'

export const blogPostType = defineType({
    name: 'blogPost',
    title: 'Blog Post',
    type: 'document',
    fields: [
        defineField({ name: 'title', title: 'Título SEO', type: 'string', validation: Rule => Rule.required() }),
        defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title', maxLength: 96 }, validation: Rule => Rule.required() }),
        defineField({ name: 'publishedAt', title: 'Publicado el', type: 'datetime', initialValue: () => new Date().toISOString() }),
        defineField({ name: 'category', title: 'Categoría', type: 'string' }),
        defineField({ name: 'excerpt', title: 'Meta Description', type: 'text', rows: 3, validation: Rule => Rule.max(160) }),
        defineField({
            name: 'coverImage', title: 'Imagen Principal', type: 'image', options: { hotspot: true },
            fields: [
                {
                    name: 'alt',
                    type: 'string',
                    title: 'Texto Alternativo (Alt)',
                },
                {
                    name: 'caption',
                    type: 'string',
                    title: 'Descripción / Leyenda',
                }
            ]
        }),
        defineField({
            name: 'htmlContent',
            title: 'Contenido (HTML)',
            type: 'text',
            rows: 15,
            description: 'Escribe tu contenido aquí usando código HTML o texto normal.'
        }),
        defineField({
            name: 'body',
            title: 'Contenido Estructurado (Portable Text)',
            type: 'array',
            of: [{ type: 'block' }, { type: 'image' }],
            description: 'Usa este si prefieres el editor visual en lugar de HTML.'
        }),
        defineField({
            name: 'schemaMarkup',
            title: 'Schema Markup (JSON-LD)',
            type: 'text',
            rows: 8,
            description: 'Pega aquí el código JSON-LD para SEO estructurado. Se inyectará automáticamente en el <head>.'
        })
    ]
})
