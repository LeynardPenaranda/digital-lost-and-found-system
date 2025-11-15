"use client";
import { ChatState } from "@/redux/chatSlice";

import Recipient from "./recipient";
import { useSelector } from "react-redux";
import Image from "next/image";
import Messages from "./messages";
import NewMessages from "./new-messages";

const ChatArea = () => {
  const { selectedChat }: ChatState = useSelector((state: any) => state.chat);

  if (!selectedChat) {
    return (
      <div className="flex-1 flex flex-col justify-center items-center h-full ">
        <Image src="/messages.png" alt="messages" width={290} height={290} />
        <span className="text-gray-600 font-semibold text-sm">
          Select a chat from your left to start messaging..
        </span>
      </div>
    );
  }
  return (
    selectedChat && (
      <div className="flex-1 flex flex-col justify-between">
        <Recipient />
        <Messages />
        <NewMessages />
      </div>
    )
  );
};

export default ChatArea;
