import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import type { NextAuthConfig } from "next-auth";

function getAuthConfig(): NextAuthConfig {
  const providers: NextAuthConfig["providers"] = [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ];

  // Credentials provider only works with a database
  if (process.env.DATABASE_URL) {
    providers.push(
      Credentials({
        name: "credentials",
        credentials: {
          email: { label: "Email", type: "email" },
          password: { label: "Password", type: "password" },
        },
        async authorize(credentials) {
          try {
            const { prisma } = await import("./prisma");
            const bcrypt = await import("bcryptjs");

            if (!credentials?.email || !credentials?.password) return null;

            const user = await prisma.user.findUnique({
              where: { email: credentials.email as string },
            });

            if (!user || !user.password) return null;

            const isValid = await bcrypt.compare(
              credentials.password as string,
              user.password
            );

            if (!isValid) return null;

            return {
              id: user.id,
              name: user.name,
              email: user.email,
              image: user.image,
            };
          } catch {
            return null;
          }
        },
      })
    );
  }

  return {
    providers,
    session: { strategy: "jwt" },
    pages: {
      signIn: "/auth/signin",
    },
    callbacks: {
      async jwt({ token, user }) {
        if (user) {
          token.id = user.id;
          token.email = user.email;
        }
        return token;
      },
      async session({ session, token }) {
        if (session.user) {
          if (token.id) session.user.id = token.id as string;
          if (token.email) session.user.email = token.email as string;
        }
        return session;
      },
    },
  };
}

export const { handlers, auth, signIn, signOut } = NextAuth(getAuthConfig());
