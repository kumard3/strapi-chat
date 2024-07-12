import { cn } from "@/lib/utils";
import React, { useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import ChatBottombar from "./chat-bottombar";
import { AnimatePresence, motion } from "framer-motion";

interface ChatListProps {
  messages?: Message[];
  selectedUser: string;
  selectedUserId: string;
  sendMessage: () => void;
  setNewMessage: React.Dispatch<React.SetStateAction<string>>;
  isMobile: boolean;
}
interface Message {
  attributes: {
    sender: string;
    message: string;
  };
}

export function ChatList({
  messages,
  selectedUser,
  sendMessage,
  isMobile,
  selectedUserId,
  setNewMessage,
}: ChatListProps) {
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex h-full w-full flex-col overflow-y-auto overflow-x-hidden">
      <div
        ref={messagesContainerRef}
        className="flex h-full w-full flex-col overflow-y-auto overflow-x-hidden"
      >
        <AnimatePresence>
          {messages?.map((message, index) => (
            <motion.div
              key={index}
              layout
              initial={{ opacity: 0, scale: 1, y: 50, x: 0 }}
              animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
              exit={{ opacity: 0, scale: 1, y: 1, x: 0 }}
              transition={{
                opacity: { duration: 0.1 },
                layout: {
                  type: "spring",
                  bounce: 0.3,
                  duration: messages.indexOf(message) * 0.05 + 0.2,
                },
              }}
              style={{
                originX: 0.5,
                originY: 0.5,
              }}
              className={cn(
                "flex flex-col gap-2 whitespace-pre-wrap p-4",
                message.attributes.sender !== selectedUserId
                  ? "items-end"
                  : "items-start",
              )}
            >
              <div className="flex items-center gap-3">
                {message.attributes.sender === selectedUserId && (
                  <Avatar className="flex items-center justify-center">
                    <AvatarFallback>{message.attributes.sender}</AvatarFallback>
                  </Avatar>
                )}
                <span className="max-w-xs rounded-md bg-accent p-3">
                  {message.attributes.message}
                </span>
                {message.attributes.sender !== selectedUserId && (
                  <Avatar className="flex items-center justify-center">
                    <AvatarFallback>{message.attributes.sender}</AvatarFallback>
                  </Avatar>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      <ChatBottombar
        setNewMessage={setNewMessage}
        sendMessage={sendMessage}
        isMobile={isMobile}
      />
    </div>
  );
}
