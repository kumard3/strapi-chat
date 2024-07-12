import { signIn, signOut, useSession } from "next-auth/react";

import { useRouter } from "next/router";

import { ChatLayout } from "@/components/chat-new/chat-layout";

export default function Home() {
  const router = useRouter();
  const {} = useSession({
    required: true,
    onUnauthenticated() {
      void router.push("/login");
    },
  });
  return (
    <div className="flex h-[calc(100dvh)] flex-col items-center justify-center gap-4">
      <ChatLayout defaultLayout={[320, 480]} navCollapsedSize={8} />
    </div>
  );
}
