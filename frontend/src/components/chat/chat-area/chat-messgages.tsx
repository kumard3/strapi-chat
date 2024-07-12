import {
  useRef,
  type ElementRef,
  useEffect,
  type Dispatch,
  type SetStateAction,
} from "react";

import { LuLoader2, LuServerCrash } from "react-icons/lu";
import SingleChat from "./single-chat";

export const ChatMessages = ({
  data,
  refetchSingleChat,
  status,
  setPaginationNumber,
  className,
}: {
  data: any;
  refetchSingleChat: () => void;
  status: "error" | "success" | "idle" | "loading";
  setPaginationNumber: Dispatch<SetStateAction<number>>;
  className?: string;
}) => {
  const chatRef = useRef<ElementRef<"div">>(null);
  const topref = useRef<ElementRef<"button">>(null);
  const bottomRef = useRef<ElementRef<"div">>(null);
  const targetRef = useRef<ElementRef<"div">>(null);

  useChatScroll({
    chatRef,
    bottomRef,
    loadMore: refetchSingleChat,
    shouldLoadMore: true,
    count: data?.length ?? 0,
  });
  const urlParams = useUrlParams();

  useEffect(() => {
    if (urlParams) {
      targetRef?.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [urlParams]);

  if (status === "loading") {
    return (
      <div className="flex flex-1 flex-col items-center justify-center">
        <LuLoader2 className="my-4 h-7 w-7 animate-spin text-zinc-500" />
        <p className="text-xs text-zinc-500">Loading messages...</p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex flex-1 flex-col items-center justify-center">
        <LuServerCrash className="my-4 h-7 w-7 text-zinc-500" />
        <p className="text-xs text-zinc-500">Something went wrong!</p>
      </div>
    );
  }

  return (
    <>
      {data && data?.length > 5 && (
        <button
          onClick={() => {
            setPaginationNumber((prev) => prev + 5);
            topref?.current?.scrollIntoView({ behavior: "smooth" });
          }}
          className="w-full bg-gray-200 py-2 text-black"
        >
          Load More
        </button>
      )}

      <div
        ref={chatRef}
        className={cn(
          "flex h-full flex-1 flex-col overflow-scroll border bg-[#F4F4F4] p-2 py-4",
          className,
        )}
      >
        <div className="mt-auto flex flex-col-reverse">
          {data?.map((message) => (
            <SingleChat message={message} key={nanoid()} />
          ))}
        </div>
        <div ref={bottomRef} />
        <div ref={targetRef} />
      </div>
    </>
  );
};
