import { sanityClient } from "@/lib/sanity.client";
import { Hash } from "lucide-react";
import Link from "next/link";
import HeaderClient from "./HeaderClient";

// Server component: obtiene datos del logo y pasa al client
export const Header = async () => {
    const settings = await sanityClient.fetch(`*[_type == "siteSettings"][0]{
        site_name,
        "logo_url": site_logo.asset->url
    }`);

    const siteName = settings?.site_name || "solocasaschile.com";
    const logoUrl = settings?.logo_url || null;

    return (
        <HeaderClient siteName={siteName} logoUrl={logoUrl} />
    );
};
