import ChatTopbar from "./chat-topbar";
import { ChatList } from "./chat-list";
import React, { useEffect, useState } from "react";
import { api } from "@/utils/api";
import useSocket from "@/hook/useScoket";
import { Skeleton } from "../ui/skeleton";
import { Avatar } from "../ui/avatar";

interface ChatProps {
  roomId: string;
  username: string;
  userId: string;
  selectedUser: string;
  selectedUserId: string;
  isMobile: boolean;
}

interface Message {
  attributes: {
    sender: string;
    message: string;
  };
}

export function Chat({
  roomId,
  username,
  userId,
  selectedUser,
  selectedUserId,
  isMobile,
}: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const socket = useSocket(roomId, username);
  const { data: getPrevMessage, isLoading } = api.user.getMessage.useQuery({
    userId: userId,
    selectedUserId: selectedUserId,
  });

  useEffect(() => {
    if (getPrevMessage) {
      setMessages(getPrevMessage);
    }
  }, [userId, selectedUserId, getPrevMessage]);

  useEffect(() => {
    if (socket) {
      socket.on("message", (message: Message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
      });
    }
  }, [socket]);

  const sendMessage = () => {
    if (socket && newMessage.trim() !== "") {
      const messageData = {
        senderId: parseInt(userId),
        receiverId: selectedUserId,
        senderName: username,
        message: newMessage,
        roomId: roomId,
      };
      socket.emit("sendMessage", messageData);
      setNewMessage("");
    }
  };

  return (
    <div className="flex h-full w-full flex-col justify-between">
     
      {!selectedUser && (
        <div className="flex h-full items-center justify-center">
          <p className="text-center"> please select a user to chat</p>
        </div>
      )}
      {selectedUser && (
        <>
          <ChatTopbar selectedUser={selectedUser} />

          <ChatList
            messages={messages}
            selectedUser={selectedUser}
            selectedUserId={selectedUserId}
            sendMessage={sendMessage}
            isMobile={isMobile}
            setNewMessage={setNewMessage}
            newMessage={newMessage}
            isLoading={isLoading}
          />
        </>
      )}
    </div>
  );
}

