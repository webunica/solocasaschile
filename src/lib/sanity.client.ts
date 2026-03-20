import { createClient } from 'next-sanity'

import imageUrlBuilder from '@sanity/image-url'

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || process.env.SANITY_PROJECT_ID || 'placeholder'
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || process.env.SANITY_DATASET || 'production'
export const apiVersion = '2024-02-26'

export const sanityClient = createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: true,
})

const builder = imageUrlBuilder(sanityClient)

export function urlFor(source: any) {
    return builder.image(source)
}

