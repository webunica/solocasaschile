import { NextResponse } from "next/server";
import { sanityClient } from "@/lib/sanity.client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        const isAdmin = (session?.user as any)?.role === "admin";

        if (!isAdmin) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { ids } = await req.json();

        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return NextResponse.json({ error: "No IDs provided" }, { status: 400 });
        }

        console.log(`Deleting ${ids.length} companies...`);

        const transaction = sanityClient.transaction();
        ids.forEach(id => {
            transaction.delete(id);
        });

        await transaction.commit();

        return NextResponse.json({ success: true, count: ids.length });
    } catch (error: any) {
        console.error("Delete error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
