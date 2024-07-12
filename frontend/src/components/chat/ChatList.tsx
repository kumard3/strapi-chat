import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";

import { api } from "@/utils/api";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import useSocket from "@/hook/useScoket";
import { Button } from "@/components/ui/button";
import { Chat } from "./Chat";
import { ScrollArea } from "../ui/scroll-area";
interface User {
  id: number;
  attributes: {
    email: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    emailID: null;
  };
}
export const UserList = () => {
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
  
  const startChat = (user: User) => {
    setSelectedUser(user);
  };

  const generateRoomId = () => {
    return [selectedUser?.attributes.email, currentUser?.email]
      .sort()
      .join("-");
  };

  if (!currentUser) return <div>Loading...</div>;

  return (
    <div className="flex h-full w-full gap-x-3">
      <div>
        <div className="hidden min-w-[200px] max-w-sm flex-col rounded-md bg-white md:flex lg:min-w-[250px]">
          <div className="w-full">
            <ScrollArea className="60vh mb-3 w-full pt-2">
              <div className="flex w-full flex-col items-center gap-y-2">
                <ul>
                  {users
                    ?.filter((user) => user.id.toString() !== currentUser.id) // Filter out the current user
                    .map((user) => (
                      <li
                        key={user.id}
                        style={{ marginBottom: "10px" }}
                        onClick={() => startChat(user)}
                      >
                        {user.attributes.email}
                        <button style={{ padding: "5px 10px" }}>Chat</button>
                      </li>
                    ))}
                </ul>
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>
      <div>
        <div className="flex h-full max-h-[82svh] min-h-[80svh] w-full flex-col justify-between rounded-md bg-white">
          {selectedUser && (
            <Chat
              roomId={generateRoomId()}
              username={currentUser.name ?? ""}
              userId={currentUser.id}
              selectedUser={selectedUser.attributes.email}
              selectedUserId={selectedUser.id.toString()}
            />
          )}
        </div>
      </div>
    </div>
  );
};
