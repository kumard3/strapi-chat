import { type GetServerSidePropsContext } from "next";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { env } from "@/env";
import bcrypt from "bcryptjs";
import { z } from "zod";

const loginUserSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: DefaultSession["user"] & {
      id: string;
      // ...other properties
      // role: UserRole;
    };
  }
}

export const authOptions: NextAuthOptions = {
  callbacks: {
    session: ({ session, token }) => ({
      ...session,
      user: {
        ...session.user,
        id: token.sub,
      },
    }),
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "email", type: "text" },
        password: { label: "password", type: "password" },
      },
      type: "credentials",
      authorize: async (credentials) => {
        const { email, password } = loginUserSchema.parse(credentials);
        // Fetch the user from the database based on the provided username
        const users = await fetch(
          `${env.SERVER_URL}/api/tests??filters[email][$eq]=${email}`,
          {
            method: "GET",

            headers: {
              "Content-Type": "application/json",
              Authorization: env.SERVER_AUTHTOKEN,
            },
          },
        );
        const usersData = (await users.json()) as userType;
        const user = usersData.data[0];

        if (user && bcrypt?.compareSync(password, user?.attributes.password)) {
          // Include the desired user properties in the session
          return Promise.resolve({
            id: user.id.toString(),
            email: user.attributes.email,
            name: user.attributes.email,
          });
        } else {
          return Promise.resolve(null);
        }
      },
    }),
  ],
};

export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};

interface userType {
  data: {
    id: number;
    attributes: {
      email: string;
      createdAt: string;
      updatedAt: string;
      publishedAt: string;
      password: string;
    };
  }[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}
