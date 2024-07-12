import * as z from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { Suspense, useMemo, useRef, useState } from "react";
import { api } from "~/utils/api";

import { ChatMessages } from "./chat-messgages";
import { ChatInput } from "./chat-input";
import { notifications } from "@mantine/notifications";
import { useForm } from "react-hook-form";
import { useIntersection } from "@mantine/hooks";
import { cn } from "@/ui/lib";
const formSchema = z.object({
  content: z.string(),
  file: z.string().optional(),
});

const HomeChatArea = ({
  userId,
  className,
}: {
  userAvatar?: string;
  status?: string;
  name?: string;
  userId?: string;
  className?: string;
}) => {
  const [paginationNumber, setPaginationNumber] = useState(0);
  const {
    data: getSingleChat,
    refetch: refetchSingleChat,
    status: fetchStatus,
  } = api.internalChat.getSingleChat.useQuery({
    receiverId: userId as string,
    take: paginationNumber,
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
      file: "",
    },
  });

  const { mutate: sendMessage } = api.internalChat.sendMessage.useMutation({
    onSuccess() {
      void refetchSingleChat();
      form.reset();
    },
    onError(value) {
      notifications.show({
        title: "Error",
        message: value.message,
        color: "red",
      });
    },
  });
  const containerRef = useRef<HTMLDivElement>(null);
  const { entry } = useIntersection({
    root: containerRef.current,
    threshold: 1,
  });
  useMemo(() => {
    if (entry?.isIntersecting) {
      setPaginationNumber((prev) => prev + 5);
    }
  }, [entry?.isIntersecting, setPaginationNumber]);

  const handleSendMessage = () => {
    if ((userId && form.getValues().file) || form.getValues().content) {
      sendMessage({
        message: form.getValues().content || "",
        receiverId: userId as string,
        file: form.getValues().file,
      });
    } else {
      void refetchSingleChat();
    }
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        " flex  w-full flex-col justify-between rounded-md  bg-white ",
        className,
      )}
    >
      {getSingleChat?.length === 0 ? (
        <div className="my-10 text-center font-poppins text-base font-semibold 2xl:text-2xl">
          No Chat Data found
        </div>
      ) : (
        <Suspense>
          <ChatMessages
            data={getSingleChat}
            refetchSingleChat={() => void refetchSingleChat()}
            status={fetchStatus}
            setPaginationNumber={setPaginationNumber}
            className="max-h-96 min-h-[200px]"
          />
        </Suspense>
      )}
      <ChatInput handleSendMessage={handleSendMessage} form={form} />
    </div>
  );
};

export default HomeChatArea;
