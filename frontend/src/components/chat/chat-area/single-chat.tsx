/* eslint-disable @next/next/no-img-element */
import { FileIcon } from "react-file-icon";

import { cn } from "@/ui/lib/utils";
import { Avatar } from "@mantine/core";
import { useSession } from "next-auth/react";
import React from "react";
import { formatDateTime } from "~/utils/date-format";
import { type RouterOutputs } from "~/utils/api";

type SingleChatMessage = RouterOutputs["internalChat"]["getSingleChat"][0];

export default function SingleChat({
  message,
}: {
  message: SingleChatMessage;
}) {
  const session = useSession();
  const isOwn = session.data?.user?.id === message.senderId;

  if (message?.message !== "" || message?.file)
    return (
      <div className="flex w-full space-x-3 py-2">
        <Avatar radius="xl" src={message?.user[0]?.image} size="md" />
        <div className="space-y-2.5">
          <div className="flex items-center space-x-2">
            <p className="font-poppins text-xs font-semibold">
              {message?.user[0]?.name}
            </p>
            <p className="font-poppins text-[10px] text-[#919191]">
              {formatDateTime(message.createdAt)}
            </p>
          </div>
          {message?.message && (
            <div
              className={cn(
                "word-wrap flex min-h-[30px] w-fit items-center rounded-md bg-white px-4 py-2 font-poppins text-sm text-black",
                isOwn && "bg-custom-blue text-white",
              )}
            >
              {message?.message}
            </div>
          )}

          <div>
            {message.file && (
              <div className="">
                <GetFileExtension url={message.file} />
              </div>
            )}
          </div>
        </div>
      </div>
    );
}

const imageTags = [
  "jpg",
  "jpeg",
  "png",
  "gif",
  "bmp",
  "tiff",
  "tif",
  "webp",
  "svg",
  "ico",
  "avif",
];

function GetFileExtension({ url }: { url: string }) {
  const fileNameWithExtension = url.substring(url.lastIndexOf("/") + 1);
  const fileExtension = fileNameWithExtension.split(".").pop();
  if (imageTags.includes(fileExtension ?? "")) {
    return <img src={url} width="200" height="200" />;
  }

  return (
    <a href={url} target="_blank" rel="noopener noreferrer">
      <div className="w-20">
        <FileIcon extension={fileExtension} color="#309df4" />
      </div>
    </a>
  );
}

// function GetFileExtension({
//   fileType,
//   fileUrl,
// }: {
//   fileType: string;
//   fileUrl: string;
// }) {
//   const fileExtension = fileType?.split("/");
//   if (fileExtension[0] === "image") {
//     return <img src={fileUrl} width="100" height="100" />;
//   }

//   return <FileIcon extension={fileExtension[1]} color="#309df4" />;
// }
