import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import bcrypt from "bcryptjs";
import { TRPCClientError } from "@trpc/client";
import { env } from "@/env";
import axios from "axios";

export const createUserForm = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const userRouter = createTRPCRouter({
  createUser: publicProcedure
    .input(createUserForm)
    .mutation(async ({ input, ctx }) => {
      const users = await fetch(
        `${env.SERVER_URL}/api/accounts?filters[email][$eq]=${input.email}&populate[author][fields][0]=email&fields[0]=email&publicationState=live`,
        {
          method: "GET",

          headers: {
            "Content-Type": "application/json",
            Authorization: `${env.SERVER_AUTHTOKEN}`,
          },
        },
      );
      const usersData = (await users.json()) as userType;

      if (
        usersData.data.find((user) => user.attributes.email === input.email)
      ) {
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
  getAllUsers: protectedProcedure.query(async ({ ctx }) => {
    const users = await fetch(
      `${env.SERVER_URL}/api/accounts?publicationState=live`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${env.SERVER_AUTHTOKEN}`,
        },
      },
    );
    const usersData = (await users.json()) as userType;
    return usersData.data;
  }),
  getMessage: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        selectedUserId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { userId, selectedUserId } = input;

      const res = await fetch(
        `${env.SERVER_URL}/api/messages?filters[$or][0][sender][$eq]=${userId}&filters[$or][0][receiver][$eq]=${selectedUserId}&filters[$or][1][sender][$eq]=${selectedUserId}&filters[$or][1][receiver][$eq]=${userId}&pagination[pageSize]=100&pagination[page]=1`,
      );
      const data = (await res.json()) as messageType;

      return data.data;
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

// /api/messages?filters[$or][0][sender][$eq]=3&filters[$or][1][date][$eq]=2020-01-02&filters[author][name][$eq]=Kai%20doe
// filters[sender][$eq]=2&filters[receiver][$eq]=3[$or]

interface messageType {
  data: {
    id: number;
    attributes: {
      user: null;
      message: string;
      createdAt: string;
      updatedAt: string;
      publishedAt: string;
      sender: string;
      receiver: string;
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
