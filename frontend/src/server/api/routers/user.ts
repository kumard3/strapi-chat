import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import bcrypt from "bcryptjs";
import { TRPCClientError } from "@trpc/client";
import { env } from "@/env";

export const createUserForm = z.object({ email: z.string().email(), password: z.string() })


export const userRouter = createTRPCRouter({
  createUser: publicProcedure
    .input(createUserForm)
    .mutation(async ({ input, ctx }) => {
      const users = await fetch(
        `${env.SERVER_URL}/api/accounts??filters[email][$eq]=${input.email}&populate[author][fields][0]=email&fields[0]=email&publicationState=live`,
        {
          method: "GET",

          headers: {
            "Content-Type": "application/json",
            Authorization: `${env.SERVER_AUTHTOKEN}`,
          },
        },
      );
      const usersData = (await users.json()) as userType;
      if (usersData.data.length > 0) {
        throw new TRPCClientError("User already exists");
      }

      const hashedPassword = await bcrypt.hash(input.password, 12);

      const payload = {
        data: {
          email: input.email,
          password: hashedPassword,
        },
      };
      await fetch(`${env.SERVER_URL}/api/accounts`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: `${env.SERVER_AUTHTOKEN}`,
        },
        body: JSON.stringify(payload),
      }).then((res) => {
        return res.json();
      });
    }),
});

interface userType {
  data: {
    id: number;
    attributes: {
      email: string;
      createdAt: string;
      updatedAt: string;
      publishedAt: string;
      emailID: null;
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
