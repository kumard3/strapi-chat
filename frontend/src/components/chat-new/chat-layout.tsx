import React, { useEffect, useState } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { cn } from "@/lib/utils";
// import { Sidebar } from "../sidebar";
import { Chat } from "./chat";
import { useSession } from "next-auth/react";
import { api } from "@/utils/api";
import { Sidebar } from "./sidebar";

interface ChatLayoutProps {
  defaultLayout: number[] | undefined;
  defaultCollapsed?: boolean;
  navCollapsedSize: number;
}
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
export function ChatLayout({
  defaultLayout = [320, 480],
  defaultCollapsed = false,
  navCollapsedSize,
}: ChatLayoutProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed);

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
  const [users, setUsers] = useState<typeof getAllUsers>([]);
  const { data: session } = useSession();
  const currentUser = session?.user;
  const { data: getAllUsers, isLoading } = api.user.getAllUsers.useQuery();

  useEffect(() => {
    if (getAllUsers) {
      setUsers(getAllUsers);
    }
  }, [getAllUsers]);

  const startChat = (user: User) => {
    console.log(user, "user");
    setSelectedUser(user);
  };

  const generateRoomId = () => {
    return [selectedUser?.attributes.email, currentUser?.email]
      .sort()
      .join("-");
  };

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenWidth = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    // Initial check
    checkScreenWidth();

    // Event listener for screen width changes
    window.addEventListener("resize", checkScreenWidth);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("resize", checkScreenWidth);
    };
  }, []);

  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="h-full items-stretch border"
    >
      <ResizablePanel
        defaultSize={defaultLayout[0]}
        collapsedSize={navCollapsedSize}
        collapsible={true}
        minSize={isMobile ? 0 : 24}
        maxSize={isMobile ? 8 : 30}
        onCollapse={() => {
          setIsCollapsed(true);
        }}
        onExpand={() => {
          setIsCollapsed(false);
        }}
        className={cn(
          isCollapsed &&
            "min-w-[50px] transition-all duration-300 ease-in-out md:min-w-[70px]",
        )}
      >
        <Sidebar
          isCollapsed={isCollapsed || isMobile}
          links={users?.filter(
            (user) => user.id.toString() !== currentUser?.id,
          )}
          isMobile={isMobile}
          startChat={startChat}
          selectedUser={selectedUser}
          isLoading={isLoading}
        />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={defaultLayout[1]} minSize={30}>
        <Chat
          roomId={generateRoomId()}
          username={currentUser?.name ?? ""}
          userId={currentUser?.id ?? ""}
          selectedUser={selectedUser?.attributes?.email ?? ""}
          selectedUserId={selectedUser?.id?.toString() ?? ""}
          isMobile={isMobile}
        />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
