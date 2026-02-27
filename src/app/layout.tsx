import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { Footer } from "@/components/Footer";
import NextAuthProvider from "@/components/NextAuthProvider";

const nunito = Nunito({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "solocasaschile.com",
  description: "Encuentra tu casa ideal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth">
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
