import { cn } from "@/lib/utils";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const ChatPeopleCard = ({
  name,
  status,
  messagesNumber,
  userAvatar,
  customStyles,
  link,
}: {
  name?: string;
  status?: string;
  messagesNumber?: number;
  userAvatar?: string;
  customStyles?: string;
  link?: string;
}) => {
  return (
    <div className="w-full py-2 pl-0.5 hover:bg-[#F4F4F4]">
      <div
        className={cn(
          "flex w-full min-w-full items-center justify-between",
          customStyles,
        )}
      >
        <div className="flex items-center space-x-1">
          <div className="">
            <Avatar>
              <AvatarImage src={userAvatar ? userAvatar : ""} />
              <AvatarFallback>{name?.charAt(0)}</AvatarFallback>
            </Avatar>
          </div>
          <div className="flex flex-col space-y-1">
            <p className="font-poppins text-sm font-semibold">{name}</p>
            <p className="font-poppins text-xs">{status}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPeopleCard;
