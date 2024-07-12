import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";

import { api } from "@/utils/api";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import useSocket from "@/hook/useScoket";
import { Button } from "@/components/ui/button";
import ChatPeopleCard from "@/components/chat/people-card";
interface ChatProps {
  roomId: string;
  username: string;
  userId: string;
  selectedUser: string;
  selectedUserId: string;
}

interface Message {
  attributes: {
    sender: string;
    message: string;
  };
}
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
    <div>
      <Button onClick={signOut}>sing</Button>
      <UserList />
    </div>
  );
}

const UserList = () => {
  const { data: session } = useSession();
  const [users, setUsers] = useState<typeof getAllUsers>([]);
  const [selectedUser, setSelectedUser] = useState<{
    id: number;
    attributes: {
      email: string;
      createdAt: string;
      updatedAt: string;
      publishedAt: string;
      emailID: null;
    };
  } | null>(null);
  const currentUser = session?.user;
  const { data: getAllUsers } = api.user.getAllUsers.useQuery();
  useEffect(() => {
    if (getAllUsers) {
      setUsers(getAllUsers);
    }
  }, [getAllUsers]);

  const startChat = (user) => {
    setSelectedUser(user);
  };

  const generateRoomId = () => {
    return [selectedUser?.attributes.email, currentUser?.email]
      .sort()
      .join("-");
  };

  if (!currentUser) return <div>Loading...</div>;

  return (
    <div>
      <h1>Users</h1>

      <ul>
        {users
          ?.filter((user) => user.id.toString() !== currentUser.id) // Filter out the current user
          .map((user) => (
            <li key={user.id} style={{ marginBottom: "10px" }}>
              <button
                onClick={() => startChat(user)}
                style={{ padding: "5px 10px" }}
              >
                Chat
              </button>
              <ChatPeopleCard name={user.attributes.email} />
            </li>
          ))}
      </ul>
      {selectedUser && (
        <Chat
          roomId={generateRoomId()}
          username={currentUser.name}
          userId={currentUser.id}
          selectedUser={selectedUser.attributes.email}
          selectedUserId={selectedUser.id}
        />
      )}
    </div>
  );
};

const Chat: React.FC<ChatProps> = ({
  roomId,
  username,
  userId,
  selectedUser,
  selectedUserId,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const socket = useSocket(roomId, username);
  const { data: getPrevMessage } = api.user.getMessage.useQuery({
    userId: userId,
    selectedUserId: selectedUserId.toString(),
  });

  useEffect(() => {
    if (getPrevMessage) {
      setMessages(getPrevMessage);
    }
  }, [userId, selectedUserId, getPrevMessage]);

  useEffect(() => {
    if (socket) {
      socket.on("message", (message) => {
        console.log(message, "message")
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
      console.log(messageData, "messageData");
      socket.emit("sendMessage", messageData);
      setNewMessage("");
    }
  };

  return (
    <div>
      <h2>Chat with {selectedUser}</h2>
      <div
        style={{
          border: "1px solid #ccc",
          padding: "10px",
          height: "300px",
          overflowY: "scroll",
        }}
      >
        {messages.map((msg, index) => (
          <div key={index} style={{ marginBottom: "10px" }}>
            <strong>
              {msg?.attributes?.sender === userId ? username : selectedUser}
            </strong>
            : {msg?.attributes?.message}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        style={{ width: "80%", padding: "10px", marginRight: "10px" }}
      />
      <button onClick={sendMessage} style={{ padding: "10px 20px" }}>
        Send
      </button>
    </div>
  );
};
