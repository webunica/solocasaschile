import { defineField, defineType } from 'sanity'

export const blogPostType = defineType({
    name: 'blogPost',
    title: 'Blog Post',
    type: 'document',
    fields: [
        defineField({ name: 'title', title: 'Título SEO', type: 'string', validation: Rule => Rule.required() }),
        defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title', maxLength: 96 }, validation: Rule => Rule.required() }),
        defineField({ name: 'publishedAt', title: 'Publicado el', type: 'datetime', initialValue: () => new Date().toISOString() }),
        defineField({ name: 'excerpt', title: 'Meta Description', type: 'text', rows: 3, validation: Rule => Rule.max(160) }),
        defineField({ name: 'coverImage', title: 'Imagen Principal', type: 'image', options: { hotspot: true } }),
        defineField({
            name: 'body',
            title: 'Contenido (Cuerpo)',
            type: 'array',
            of: [{ type: 'block' }, { type: 'image' }]
        }),
    ]
})
