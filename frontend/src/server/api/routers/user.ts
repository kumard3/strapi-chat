import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import bcrypt from "bcryptjs";
import { TRPCClientError } from "@trpc/client";
import { env } from "@/env";

export const userRouter = createTRPCRouter({

  createUser: publicProcedure
    .input(z.object({ email: z.string().email(), password: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const users = await fetch(
        `${env.SERVER_URL}/api/accounts??filters[email][$eq]=${input.email}&populate[author][fields][0]=email&fields[0]=email&publicationState=live`,
        {
          method: "GET",

          headers: {
            "Content-Type": "application/json",
            Authorization: env.SERVER_AUTHTOKEN,
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
          Authorization:
            "bearer ea5704081fbca2f59b6d7ea03200d675ea2f3d55caba5751190c695236b7c7864c223bf23baf8397ad6bd382fc6bda57d3bf0c19dac4be0329610b86f898bbaf39f8ff9427e9ab4810ab104b397dad595f8a1f4f196cf719d52cd59a7601a90a70094c50f1dc95999e6151d35fc53e0565f10fa39d93501c5593eee8d28f195b",
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
