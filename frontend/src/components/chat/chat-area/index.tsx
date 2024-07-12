import Header from "@/ui/components/chat/header";
import * as z from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { Suspense, useMemo, useRef, useState } from "react";
import { api } from "~/utils/api";

import { ChatMessages } from "./chat-messgages";
import { ChatInput } from "./chat-input";
import { notifications } from "@mantine/notifications";
import { useForm } from "react-hook-form";
import { useIntersection } from "@mantine/hooks";
import {
  AttributeEnum,
  useGeneralFlowMutation,
} from "~/utils/hooks/useGeneralFlowMutation";
const formSchema = z.object({
  content: z.string(),
  file: z.string().optional(),
});

const ChatChatArea = ({
  userAvatar,
  status,
  name,
  userId,
}: {
  userAvatar?: string;
  status?: string;
  name?: string;
  userId?: string;
}) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
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
  //  Do not remove this line. This is used to update the user's general flow detail
  const { updateGeneralFlowForMascot } = useGeneralFlowMutation();
  const { mutate: sendMessage } = api.internalChat.sendMessage.useMutation({
    onSuccess() {
      void refetchSingleChat();
      form.reset();
      void updateGeneralFlowForMascot(AttributeEnum.SentAMessage);
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

  const handleSearchQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchQuery(query);
  };

  const handleSendMessage = () => {
    if ((userId && form.getValues().file) || form.getValues().content) {
      sendMessage({
        message: form.getValues().content || "",
        receiverId: userId as string,
        file: form.getValues().file,
      });
    } else {
      refetchSingleChat;
    }
  };

  return (
    <div
      ref={containerRef}
      className=" flex h-full  max-h-[82svh] min-h-[80svh]  w-full flex-col justify-between rounded-md  bg-white "
    >
      <Header
        handleSearchQuery={handleSearchQuery}
        userAvatar={userAvatar}
        name={name}
        status={status}
        searchQuery={searchQuery}
      />
      <>
        <Suspense>
          <ChatMessages
            data={getSingleChat}
            refetchSingleChat={() => void refetchSingleChat()}
            status={fetchStatus}
            setPaginationNumber={setPaginationNumber}
          />
        </Suspense>
        <ChatInput handleSendMessage={handleSendMessage} form={form} />
      </>
    </div>
  );
};

export default ChatChatArea;
