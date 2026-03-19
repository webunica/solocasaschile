import { NextRequest, NextResponse } from "next/server";
import { sanityClient } from "@/lib/sanity.client";

export async function GET(req: NextRequest) {
    try {
        const url = new URL(req.url);
        const token = url.searchParams.get("token");

        if (!token) {
            return NextResponse.json({ valid: false }, { status: 400 });
        }

        const now = new Date().toISOString();

        const user = await sanityClient.fetch(
            `*[_type == "companyUser" && reset_password_token == $token && reset_password_expires > $now][0]`,
            { token, now } as Record<string, string>
        );

        return NextResponse.json({ valid: !!user });
    } catch (error: any) {
        console.error("Error en validate-reset-token:", error);
        return NextResponse.json({ valid: false }, { status: 500 });
    }
}
