import { NextRequest, NextResponse } from "next/server";
import { sanityClient } from "@/lib/sanity.client";
import { sanityWriteClient } from "@/lib/sanity.server";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
    try {
        const { token, password } = await req.json();

        if (!token || !password) {
            return NextResponse.json({ error: "Token y contraseña son requeridos" }, { status: 400 });
        }

        if (password.length < 8) {
            return NextResponse.json({ error: "La contraseña debe tener al menos 8 caracteres" }, { status: 400 });
        }

        const now = new Date().toISOString();

        // Verificar el token
        const user = await sanityClient.fetch(
            `*[_type == "companyUser" && reset_password_token == $token && reset_password_expires > $now][0]`,
            { token, now } as Record<string, string>
        );

        if (!user) {
            return NextResponse.json({ error: "El enlace es inválido o ha expirado" }, { status: 400 });
        }

        // Hashear la nueva contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Actualizar la contraseña en Sanity y limpiar los campos del token
        await sanityWriteClient.patch(user._id)
            .set({ password: hashedPassword })
            .unset(["reset_password_token", "reset_password_expires"])
            .commit();

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Error en reset-password:", error);
        return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
    }
}
