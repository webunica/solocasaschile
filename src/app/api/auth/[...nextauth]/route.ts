import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { sanityClient } from "@/lib/sanity.client";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credenciales de Empresa",
            credentials: {
                email: { label: "Correo Electrónico", type: "email", placeholder: "empresa@correo.com" },
                password: { label: "Contraseña", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Por favor ingresa tu correo y contraseña");
                }

                // Buscar usuario en Sanity
                const query = `*[_type == "companyUser" && email == $email][0]`;
                const user = await sanityClient.fetch(query, { email: credentials.email });

                if (!user) {
                    throw new Error("No existe una cuenta B2B con este correo");
                }

                // Verificar si la cuenta está activa
                if (user.is_active === false) {
                    throw new Error("Esta cuenta ha sido desactivada. Contacta a soporte.");
                }

                if (!user.password) {
                    throw new Error("Cuenta sin contraseña configurada. Contacta a soporte.");
                }

                // Verificar bcrypt password
                const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

                if (!isPasswordValid) {
                    throw new Error("Contraseña incorrecta");
                }

                return {
                    id: user._id,
                    email: user.email,
                    name: user.company_name,
                    role: user.role || 'company',
                    plan: user.plan || 'starter',
                };
            }
        })
    ],
    pages: {
        signIn: "/login",
    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET || "1234567890_INMO_SECRET_TESTING",
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.company_name = user.name;
                token.role = (user as any).role;
                token.plan = (user as any).plan;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.name = token.company_name as string;
                (session.user as any).id = token.id;
                (session.user as any).role = token.role;
                (session.user as any).plan = token.plan;
            }
            return session;
        }
    }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
