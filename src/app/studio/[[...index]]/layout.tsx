import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Sanity Studio',
    description: 'Sanity Studio Embedded in Next.js',
    robots: 'noindex, nofollow',
}

export default function StudioLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body style={{ margin: 0 }}>{children}</body>
        </html>
    )
}
