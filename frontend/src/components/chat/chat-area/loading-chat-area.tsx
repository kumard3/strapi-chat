import { SendIcon } from "@/ui/icons";
import { ScrollArea, Skeleton } from "@mantine/core";

const ChatChatAreaLoading = () => {
  return (
    <div className="max-h-[80vh] w-full rounded-md bg-white px-7 py-4">
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <Skeleton className="h-11 w-11 rounded-full" />

          <div className="flex flex-col space-y-1">
            <Skeleton className="h-2 w-14" />

            <p className="flex items-center font-poppins text-xs">
              <Skeleton className="h-2 w-8" />
              <Skeleton className="ml-2 h-2 w-4" />
            </p>
          </div>
        </div>
        <div className="">
          <div className="w-full">
            <Skeleton className="h-7 w-40" />
          </div>
        </div>
      </div>
      <div className="mt-2 flex h-full max-h-[60vh] w-full flex-col justify-between rounded-md border bg-[#F4F4F4] px-5 pb-3">
        <ScrollArea
          type="hover"
          scrollbarSize={12}
          scrollHideDelay={500}
          className=" mt-5 h-full w-full rounded-sm"
        ></ScrollArea>

        <div className=" relative w-full">
          <div className="w-full">
            <Skeleton className="h-9 w-full" />
          </div>
          <button className="absolute right-2 top-2">
            <SendIcon />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatChatAreaLoading;
