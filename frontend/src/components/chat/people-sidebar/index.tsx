import { IoSearch } from "react-icons/io5";
import ChatPeopleCard from "../people-card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

const ChatPeopleSidebar = ({
  userData,
}: {
  userData?: {
    name: string | null;
    email: string | null;
    image: string | null;
    id: string;
  }[];
}) => {
  return (
    <div className="hidden min-w-[200px] max-w-sm flex-col rounded-md bg-white md:flex lg:min-w-[250px]">
      <div className="w-full">
        <div className="p-1">
          <p className="pb-2 pl-2 text-xl font-semibold">People</p>
        </div>
        <ScrollArea className="h-[200px] w-[350px] rounded-md border p-4">
          <div className="flex w-full flex-col items-center gap-y-2">
            {userData?.map((data) => (
              <ChatPeopleCard
                key={data.id}
                messagesNumber={1}
                name={data?.name}
                status={""}
                userAvatar={data.image}
                link={data.id}
              />
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default ChatPeopleSidebar;
