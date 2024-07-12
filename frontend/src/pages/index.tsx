import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";

import { api } from "@/utils/api";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import useSocket from "@/hook/useScoket";
import { Button } from "@/components/ui/button";
import { UserList } from "@/components/chat/ChatList";
import { ChatLayout } from "@/components/chat-new/chat-layout";

export default function Home() {
  const router = useRouter();
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      void router.push("/login");
    },
  });
  console.log(session);
  return (
    <div className="flex h-[calc(100dvh)] flex-col items-center justify-center gap-4 p-4 py-32 md:px-24">
      {/* <UserList /> */}

      <ChatLayout defaultLayout={[320, 480]} navCollapsedSize={8} />
    </div>
  );
}
