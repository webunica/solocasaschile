import { defineField, defineType } from 'sanity'

export const houseModelType = defineType({
    name: 'houseModel',
    title: 'Modelo de Casa',
    type: 'document',
    fields: [
        defineField({ name: 'company_name', title: 'Nombre Empresa', type: 'string', validation: Rule => Rule.required() }),
        defineField({ name: 'model_name', title: 'Nombre del Modelo', type: 'string', validation: Rule => Rule.required() }),
        defineField({
            name: 'property_id',
            title: 'ID Interno de la Propiedad',
            type: 'string',
            description: 'Identificador único rápido (Ej. TCF-001).'
        }),
        defineField({
            name: 'tags',
            title: 'Etiquetas / Tags',
            type: 'array',
            of: [{ type: 'string' }],
            description: 'Agrega etiquetas para búsquedas rápidas (Ej. Económica, Lujo, Playa, Invierno).',
            options: { layout: 'tags' }
        }),
        defineField({ name: 'model_code', title: 'Código del Modelo Original', type: 'string' }),
        defineField({ name: 'model_url', title: 'URL Original', type: 'url', validation: Rule => Rule.required() }),
        defineField({ name: 'category', title: 'Categoría', type: 'string' }),
        defineField({ name: 'style', title: 'Estilo', type: 'string' }),
        defineField({ name: 'surface_m2', title: 'Superficie (m²)', type: 'number' }),
        defineField({ name: 'bedrooms', title: 'Dormitorios', type: 'number' }),
        defineField({ name: 'bathrooms', title: 'Baños', type: 'number' }),
        defineField({ name: 'floors', title: 'Pisos', type: 'number' }),
        defineField({ name: 'structure_material', title: 'Material Estructural', type: 'string' }),
        defineField({ name: 'delivery_modes', title: 'Formatos de Entrega', type: 'array', of: [{ type: 'string' }] }),
        defineField({ name: 'price_from', title: 'Precio Desde', type: 'number' }),
        defineField({ name: 'price_to', title: 'Precio Hasta', type: 'number' }),
        defineField({ name: 'currency', title: 'Moneda', type: 'string' }),
        defineField({ name: 'original_price_text', title: 'Precio Texto', type: 'string' }),
        defineField({ name: 'includes_transport', title: 'Incluye Transporte', type: 'boolean' }),
        defineField({ name: 'includes_assembly', title: 'Incluye Armado', type: 'boolean' }),
        defineField({ name: 'estimated_total_time', title: 'Tiempo Construcción', type: 'string' }),
        defineField({ name: 'description', title: 'Descripción', type: 'text' }),
        defineField({
            name: 'images',
            title: 'Galería de Imágenes',
            type: 'array',
            of: [{ type: 'image', options: { hotspot: true } }]
        }),
        defineField({ name: 'pdf_ficha_url', title: 'Ficha PDF (URL)', type: 'url' }),
        defineField({ name: 'scrape_date', title: 'Fecha de Scrapeo', type: 'datetime' }),
        defineField({ name: 'fingerprint_hash', title: 'Hash Único', type: 'string' }),
        // --- Campos SEO ---
        defineField({
            name: 'seo_title',
            title: 'Título SEO',
            type: 'string',
            description: 'Sobreescribe el título del modelo en la pestaña del navegador (Max 60 caracteres).',
            validation: Rule => Rule.max(60).warning('Los títulos muy largos son cortados por Google.')
        }),
        defineField({
            name: 'seo_description',
            title: 'Descripción SEO',
            type: 'text',
            description: 'El resumen que aparecerá bajo el enlace en Google (Max 160 caracteres).',
            validation: Rule => Rule.max(160).warning('Meta descriptions más largas que 160 caracteres son truncadas.')
        }),
        defineField({
            name: 'seo_keywords',
            title: 'Palabras Clave SEO',
            type: 'string',
            description: 'Palabras clave separadas por comas (ej: casa prefabricada, modelo llave en mano, santiago)'
        }),
        // --- Visibilidad ---
        defineField({
            name: 'is_active',
            title: '¿Propiedad Activa?',
            type: 'boolean',
            description: 'Si está desactivada, NO aparecerá en el comparador público.',
            initialValue: true,
        }),
    ],
    preview: {
        select: { title: 'model_name', subtitle: 'company_name' }
    }
})
