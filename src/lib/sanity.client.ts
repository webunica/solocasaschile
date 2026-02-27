import { createClient } from 'next-sanity'

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'tu_project_id' // Reemplazar con env file en prod
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
export const apiVersion = '2024-02-26'

export const sanityClient = createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: true, // false si necesitas revalidación rápida
})
