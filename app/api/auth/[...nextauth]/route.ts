import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { compare } from "bcryptjs";
import type { NextAuthOptions, Session, User } from "next-auth";
import type { JWT } from "next-auth/jwt";

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                // Tìm user theo email
                const user = await prisma.user.findUnique({
                    where: { email: credentials?.email },
                });
                if (!user || !user.password) return null;
                // So sánh password (nếu đã hash thì dùng compare)
                const isValid = await compare(credentials!.password, user.password);
                if (!isValid) return null;
                return user;
            },
        }),
    ],
    callbacks: {
        async session({ session, token }: { session: Session; token: JWT }) {
            // Attach role and id to session
            if (session.user) {
                (session.user as any).role = token.role;
                (session.user as any).id = token.id;
            }
            return session;
        },
        async jwt({ token, user }: { token: JWT; user?: User }) {
            if (user) {
                token.role = (user as any).role;
                token.id = user.id;
            }
            return token;
        },
    },
    session: {
        strategy: "jwt" as const,
    },
    pages: {
        signIn: "/login",
    },
    secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST }; 