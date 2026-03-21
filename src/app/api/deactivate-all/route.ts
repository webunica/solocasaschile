export const dynamic = "force-dynamic";
import { sanityWriteClient } from "@/lib/sanity.server";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const companies = await sanityWriteClient.fetch(`*[_type == "companyUser" && is_active != false]`);
        
        if (companies.length === 0) {
            return NextResponse.json({ success: true, count: 0, message: "No active companies found." });
        }

        const transaction = sanityWriteClient.transaction();
        
        companies.forEach((company: any) => {
            transaction.patch(company._id, (p) => p.set({ is_active: false }));
        });
        
        await transaction.commit();
        
        return NextResponse.json({ success: true, count: companies.length });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
