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

  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    providers.push(
      Credentials({
        name: "credentials",
        credentials: {
          email: { label: "Email", type: "email" },
          password: { label: "Password", type: "password" },
        },
        async authorize(credentials) {
          try {
            const { supabase } = await import("./supabase");
            const bcrypt = await import("bcryptjs");

            if (!credentials?.email || !credentials?.password) return null;

            const { data: user } = await supabase
              .from("users")
              .select("id, name, email, image, password")
              .eq("email", credentials.email as string)
              .single();

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
        const adminEmail = process.env.ADMIN_EMAIL;
        token.isAdmin =
          !!token.email &&
          !!adminEmail &&
          (token.email as string).toLowerCase() === adminEmail.toLowerCase();
        return token;
      },
      async session({ session, token }) {
        if (session.user) {
          if (token.id) session.user.id = token.id as string;
          if (token.email) session.user.email = token.email as string;
          (session as unknown as Record<string, unknown>).isAdmin = token.isAdmin ?? false;
        }
        return session;
      },
    },
  };
}

export const { handlers, auth, signIn, signOut } = NextAuth(getAuthConfig());
