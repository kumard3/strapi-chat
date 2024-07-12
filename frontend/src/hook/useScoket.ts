import { useEffect, useState } from "react";
import { io, type Socket } from "socket.io-client";

const useSocket = (roomId: string, username: string): Socket | null => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const SERVER_URL = "https://strapi-dashboard.kumard3.in";

    // connect the socket
    const socket = io(SERVER_URL);
    setSocket(socket);

    socket.emit("join", { username, roomId });

    return () => {
      socket.disconnect();
    };
  }, [roomId, username]);

  return socket;
};

export default useSocket;
