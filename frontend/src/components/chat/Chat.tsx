import useSocket from "@/hook/useScoket";
import { api } from "@/utils/api";
import { useEffect, useState } from "react";
import { Input } from "../ui/input";

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

export const Chat: React.FC<ChatProps> = ({
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
        console.log(message, "message");
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

      <div>
        <Input
          onChange={(e) => setNewMessage(e.target.value)}
          className="min-h-[60px] rounded-none border-0 border-none py-6 text-zinc-600 focus-visible:ring-0 focus-visible:ring-offset-0"
          placeholder="Type your text..."
        />
        <button onClick={sendMessage} style={{ padding: "10px 20px" }}>
          Send
        </button>
      </div>
    </div>
  );
};
