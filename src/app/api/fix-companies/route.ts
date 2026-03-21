import { sanityWriteClient } from "@/lib/sanity.server";
import { NextResponse } from "next/server";

const slugify = (text: string) => {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]+/g, '')
        .replace(/--+/g, '-');
};

export async function GET() {
    try {
        const companies = await sanityWriteClient.fetch(`*[_type == "companyUser" && !defined(slug)]{_id, company_name}`);
        const results = [];

        for (const company of companies) {
            if (!company.company_name) continue;
            const slug = slugify(company.company_name);
            
            await sanityWriteClient
                .patch(company._id)
                .set({ 
                    slug: { _type: 'slug', current: slug },
                    is_active: true
                })
                .commit();
            
            results.push({ name: company.company_name, slug });
        }

        return NextResponse.json({ 
            message: `Migración completada. ${results.length} empresas actualizadas.`,
            updated: results
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
