import NextAuth from "next-auth";
  import Credentials from "next-auth/providers/credentials";
  import { z } from "zod";

  export const { handlers, auth, signIn, signOut } = NextAuth({
    providers: [
      Credentials({
        name: "Admin Credentials",
        credentials: {
          email: { label: "Email", type: "email" },
          password: { label: "Password", type: "password" },
        },
        async authorize(credentials) {
          const parsedCredentials = z
            .object({ email: z.string().email(), password: z.string().min(6) })
            .safeParse(credentials);

          if (parsedCredentials.success) {
            const { email, password } = parsedCredentials.data;
            
            // Check against configured admin in environment variables
            const adminEmail = process.env.ADMIN_EMAIL || "admin@henry.dev";
            const adminPassword = process.env.ADMIN_PASSWORD || "HenrySecurePassword123!";

            if (email === adminEmail && password === adminPassword) {
              return {
                id: "admin-user-id",
                name: "Henry A.",
                email: adminEmail,
                role: "admin",
              };
            }
          }
          return null;
        },
      }),
    ],
    pages: {
      signIn: "/login",
    },
    callbacks: {
      async jwt({ token, user }) {
        if (user) {
          token.role = (user as { role?: string }).role;
        }
        return token;
      },
      async session({ session, token }) {
        if (session.user) {
          (session.user as { role?: string }).role = token.role as string;
        }
        return session;
      },
    },
    secret: process.env.AUTH_SECRET,
  });
