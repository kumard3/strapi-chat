// import { Avatar, Input } from "@mantine/core";
import { TbTriangleInvertedFilled } from "react-icons/tb";
import { IoSearch } from "react-icons/io5";
import React from "react";

export default function Header({
  userAvatar,
  borderColor,
  name,
  status,
  searchQuery,
  handleSearchQuery,
}: {
  userAvatar?: string;
  borderColor?: string;
  name?: string;
  status?: string;
  searchQuery?: string;
  handleSearchQuery: (event: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="flex w-full items-center justify-between px-3 py-2">
      <div className="flex items-center space-x-2.5">
        <Avatar
          radius="xl"
          src={userAvatar ? userAvatar : ""}
          styles={{
            root: {
              padding: "2px",
              backgroundColor: borderColor,
              width: "44px",
              height: "44px",
            },
            image: {
              borderRadius: "50%",
            },
          }}
        />

        <div className="flex flex-col space-y-1">
          <p className="font-poppins text-sm font-semibold">{name}</p>
          <p className="font-poppins flex items-center text-xs">
            {status}
            <TbTriangleInvertedFilled className="ml-1" size="0.4rem" />
          </p>
        </div>
      </div>
      <div>
        <Input
          className=""
          placeholder="Search"
          rightSection={<IoSearch size="1rem" stroke="1.5" />}
          value={searchQuery}
          onChange={handleSearchQuery}
        />
      </div>
    </div>
  );
}
