import { Skeleton } from "@/components/ui/skeleton";

const ChatPeopleCardLoading = () => {
  return (
    <button className="w-full py-3">
      <div className="flex min-w-full max-w-sm items-center justify-between ">
        <div className="flex items-center space-x-2.5">
          <div className="">
            <Skeleton className="h-11 w-11 rounded-full" />
          </div>
          <div className="flex flex-col space-y-1">
            <Skeleton className="h-2 w-28" />
            <Skeleton className="h-2 w-11" />
          </div>
        </div>
        <Skeleton className="h-5 w-5 rounded-full" />
      </div>
    </button>
  );
};

export default ChatPeopleCardLoading;
