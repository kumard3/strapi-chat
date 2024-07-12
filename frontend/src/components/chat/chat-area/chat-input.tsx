/* eslint-disable @next/next/no-img-element */
import React, { useRef, useState } from "react";
import { type UseFormReturn } from "react-hook-form";

import { LuPlus, LuSend, LuX } from "react-icons/lu";
import { Input } from "@/components/ui/input";

import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";

import { useSession } from "next-auth/react";

import moment from "moment";

interface ChatInputProps {
  handleSendMessage: () => void;
  form: UseFormReturn<
    {
      content: string;
      file?: string;
    },
    unknown
  >;
}

export const ChatInput = ({ handleSendMessage, form }: ChatInputProps) => {

  const isLoading = form.formState.isSubmitting;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      // Prevent the default behavior of the Enter key (preventing a new line)
      e.preventDefault();
      // Submit the form or perform your submit action
      handleSendMessage();
    }
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={(e) => e.preventDefault()} className="">
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="relative w-full">
                    <div className="flex flex-col items-start">
                      <Input
                        disabled={isLoading}
                        {...field}
                        onKeyDown={handleKeyDown}
                        className="min-h-[60px] rounded-none border-0 border-none py-6 text-zinc-600 focus-visible:ring-0 focus-visible:ring-offset-0"
                        placeholder="Type your text..."
                      />
                    </div>
                    <div className="flex justify-between gap-x-3 px-2 pb-2">
                      <div className="right-2 top-2 flex gap-x-1">
                        <LuSend
                          onClick={(e) => {
                            handleSendMessage();
                          }}
                          className="cursor-pointer text-zinc-400 transition hover:text-zinc-600"
                        />
                      </div>
                    </div>
                  </div>
                </FormControl>
              </FormItem>
            )}
          />
        </form>
      </Form>
    </>
  );
};
