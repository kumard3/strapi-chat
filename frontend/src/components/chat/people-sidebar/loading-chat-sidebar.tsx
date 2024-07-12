// import { Input, ScrollArea } from "@mantine/core";
import { IoSearch } from "react-icons/io5";

import ChatPeopleCardLoading from "../people-card/loading-people-card";
import { ScrollArea } from "@/components/ui/scroll-area";

const ChatPeopleSidebarLoading = () => {
  return (
    <div className="flex min-w-[250px] max-w-sm flex-col rounded-l-md bg-white p-3">
      <div className="w-full">
        <p className="pb-2 text-xl font-semibold">People</p>

        <ScrollArea className="h-[200px] w-[350px] rounded-md border p-4">
          {Array(15)
            .fill(0)
            .map((_, idx) => (
              <ChatPeopleCardLoading key={idx} />
            ))}

          {/* <Skeleton h={28} mt="sm" animate={false} /> */}
        </ScrollArea>
      </div>
    </div>
  );
};

export default ChatPeopleSidebarLoading;
