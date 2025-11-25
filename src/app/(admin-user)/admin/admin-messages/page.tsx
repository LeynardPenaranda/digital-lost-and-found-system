"use client";

import ChatArea from "@/components/chat-area";
import Chats from "@/components/chats";
import { ChatState } from "@/redux/chatSlice";
import { useSelector } from "react-redux";

const AdminMessages = () => {
  const { selectedChat }: ChatState = useSelector((state: any) => state.chat);
  return (
    <div className="min-h-screen flex">
      {/* LEFT COLUMN (Chats List) */}
      <div className="lg:w-[18%] w-screen h-screen ">
        <Chats />
      </div>

      {/* RIGHT COLUMN (Chat area on LARGE screens) */}
      <div className="hidden lg:flex flex-1">
        <ChatArea />
      </div>

      {/* MOBILE POP-UP CHAT AREA */}
      {selectedChat && (
        <div className="lg:hidden fixed inset-0 bg-white z-50">
          <ChatArea />
        </div>
      )}
    </div>
  );
};

export default AdminMessages;
