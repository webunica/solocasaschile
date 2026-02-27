import { createClient } from 'next-sanity'

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'placeholder'
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
export const apiVersion = '2024-02-26'

export const sanityClient = createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: true,
})
