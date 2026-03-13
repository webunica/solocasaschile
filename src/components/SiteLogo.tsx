import { sanityClient } from "@/lib/sanity.client";
import Link from "next/link";
import { Hash } from "lucide-react";
import Image from "next/image";

export default async function SiteLogo({ whiteMode = false }: { whiteMode?: boolean }) {
  const settings = await sanityClient.fetch(`*[_type == "siteSettings"][0]{
    site_name,
    "logo_url": site_logo.asset->url
  }`);

  const siteName = settings?.site_name || "solocasaschile.com";

  if (settings?.logo_url) {
    return (
      <Link href="/">
        <img
          src={settings.logo_url}
          alt={siteName}
          className="h-9 w-auto object-contain"
        />
      </Link>
    );
  }

  // Backup logo text
  const textColor = whiteMode ? "text-white" : "text-[#3200C1]";

  return (
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-lg bg-[#37FFDB] flex items-center justify-center shadow-sm">
        <Hash className="w-5 h-5 text-[#3200C1]" aria-hidden="true" />
      </div>
      <Link href="/" className={`text-xl font-bold ${textColor}`} aria-label={`${siteName} - Inicio`}>
        {siteName.toLowerCase()}
      </Link>
    </div>
  );
}
