import { signIn, signOut, useSession } from "next-auth/react";

import { useRouter } from "next/router";

import { ChatLayout } from "@/components/chat-new/chat-layout";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      void router.push("/login");
    },
  });
  useEffect(() => {
    if (status !== "authenticated") {
      void signIn();
    }
  }, [status]);

  if (status === "loading") {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  if (status === "authenticated") {
    return (
      <div className="flex h-[calc(100dvh)] flex-col items-center justify-center gap-4">
        <ChatLayout defaultLayout={[320, 480]} navCollapsedSize={8} />
      </div>
    );
  }
}
