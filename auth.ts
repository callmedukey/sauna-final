import { Role } from "@prisma/client";
import bcrypt from "bcryptjs";
import NextAuth, { DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";

import prisma from "@/lib/prisma";

import { LoginSchema } from "./definitions/zod";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      isAdmin: boolean;
      email: string;
      phone: string;
      name?: string;
    } & DefaultSession["user"];
  }

  interface Profile {
    isAdmin?: boolean;
    userId?: string;
    email?: string | null;
    name?: string | null;
    response?: {
      email: string | undefined;
      mobile: string | undefined;
    };
  }

  interface User {
    id?: string;
    isAdmin?: boolean;
    email?: string | null;
    name?: string | null;
  }

  interface JWT {
    id: string;
    isAdmin: boolean;
    email: string;
    name?: string;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        console.log(credentials);
        if (!credentials.email || !credentials.password) {
          return null;
        }

        const validated = await LoginSchema.safeParseAsync(credentials);

        if (!validated.success) {
          throw new Error("잘못된 요청입니다");
        }

        let user = null;

        user = await prisma.user.findUnique({
          where: {
            email: validated.data.email,
          },
        });

        if (!user) {
          throw new Error("존재하지 않는 계정입니다");
        }

        const isValidPassword = await bcrypt.compare(
          validated.data.password,
          user.password
        );

        if (!isValidPassword) {
          throw new Error("비밀번호가 일치 하지 않습니다");
        }

        // Return the user with only the fields we want to store in the token
        return {
          id: user.id,
          email: user.email,
          isAdmin: user.role === Role.ADMIN,
          name: user.name,
        };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        // First time jwt callback is run, user object is available
        token.id = user.id;
        token.email = user.email;
        token.isAdmin = user.isAdmin;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.isAdmin = token.isAdmin as boolean;
        session.user.name = token.name as string;
      }
      return session;
    },
    async signIn() {
      return true;
    },
  },
});
