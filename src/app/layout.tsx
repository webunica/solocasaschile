import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { Footer } from "@/components/Footer";
import NextAuthProvider from "@/components/NextAuthProvider";

const nunito = Nunito({ subsets: ["latin"], display: "swap" });

const SITE_URL = "https://www.solocasaschile.com";
const SITE_NAME = "SoloClasasChile.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Casas Prefabricadas en Chile | Comparador de Precios y Modelos | SolocasasChile",
    template: "%s | SolocasasChile.com",
  },
  description:
    "Compara casas prefabricadas, casas SIP, casas modulares y llave en mano en Chile. Encuentra el mejor precio entre las principales constructoras. Modelos desde 36 m² con fotos, especificaciones y cotización online.",
  keywords: [
    "casas prefabricadas Chile",
    "casas prefabricadas precios",
    "casas SIP Chile",
    "casas modulares Chile",
    "casas llave en mano Chile",
    "casas prefabricadas madera",
    "casas prefabricadas metalcon",
    "casas prefabricadas kit",
    "comparador casas prefabricadas",
    "solocasaschile",
  ],
  authors: [{ name: "SolocasasChile.com", url: SITE_URL }],
  creator: "SolocasasChile.com",
  publisher: "SolocasasChile.com",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    type: "website",
    locale: "es_CL",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: "Casas Prefabricadas en Chile | Compara Precios y Modelos",
    description:
      "Descubre y compara casas prefabricadas, SIP, modulares y llave en mano en Chile. Más de 200 modelos de las mejores constructoras del país.",
    images: [
      {
        url: `${SITE_URL}/og-home.jpg`,
        width: 1200,
        height: 630,
        alt: "SolocasasChile - Comparador de casas prefabricadas en Chile",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Casas Prefabricadas Chile | SolocasasChile.com",
    description:
      "Compara precios y modelos de casas prefabricadas, SIP, modulares y llave en mano en Chile.",
    images: [`${SITE_URL}/og-home.jpg`],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "SolocasasChile.com",
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    description:
      "Comparador de casas prefabricadas, SIP, modulares y llave en mano en Chile.",
    contactPoint: {
      "@type": "ContactPoint",
      email: "solicitud@solocasaschile.com",
      contactType: "customer service",
      availableLanguage: "Spanish",
    },
    sameAs: [
      "https://www.facebook.com/solocasaschile",
      "https://www.instagram.com/solocasaschile",
    ],
  };

  return (
    <html lang="es" className="scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${nunito.className} bg-white text-[#3200C1] min-h-screen selection:bg-accent-500/30 selection:text-brand-500 flex flex-col`}>
        <NextAuthProvider>
          <NuqsAdapter>
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </NuqsAdapter>
        </NextAuthProvider>
      </body>
    </html>
  );
}
