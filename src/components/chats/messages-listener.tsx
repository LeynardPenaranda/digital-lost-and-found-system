"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import socket from "@/config/socket-config";
import { toast } from "sonner";
import { ChatState } from "@/redux/chatSlice";
import { UserState } from "@/redux/userSlice";
import { incrementUnread } from "@/redux/notificationSlice";

export default function MessagesListener({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useDispatch();
  const { selectedChat }: ChatState = useSelector((state: any) => state.chat);
  const { currentUserData }: UserState = useSelector(
    (state: any) => state.user
  );
  const { chatUnread } = useSelector((state: any) => state.notifications); // <-- get unread counts

  useEffect(() => {
    socket.on("new-message-received", (message) => {
      const chatId = message.chat._id;
      const senderId = message.sender._id;

      const isMyMessage = senderId === currentUserData?._id;
      const isOpenChat = selectedChat?._id === chatId;

      if (!isMyMessage && !isOpenChat) {
        const incrementPayload = {
          chatId,
          lastMessage: message.text || "",
          lastSenderName: message.sender?.name || "",
        };

        // Get the current count from Redux (optional fallback)
        const currentCount = chatUnread[chatId]?.count || 0;

        // Increment manually for toast
        const newCount = currentCount + 1;

        // Dispatch to Redux
        dispatch(incrementUnread(incrementPayload));

        // Show toast using the incremented count
        toast(
          <div className="flex items-center gap-2">
            <i className="ri-mail-unread-line text-green-500 text-2xl relative">
              {newCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                  {newCount}
                </span>
              )}
            </i>
            <div className="flex flex-col">
              <span className="font-semibold text-sm">
                {message.sender?.name?.split(" ")[0] || "Unknown"}
              </span>
              <div className="grid grid-cols-2 gap-x-2">
                <span className="text-xs text-gray-700">Message:</span>
                <span className="text-xs text-gray-700">
                  {message.text?.length > 15
                    ? message.text.slice(0, 15) + "..."
                    : message.text}
                </span>
              </div>
            </div>
          </div>,
          { duration: 4000 }
        );
      }
    });

    return () => {
      socket.off("new-message-received");
    };
  }, [selectedChat, currentUserData, chatUnread]); // <-- add chatUnread to dependency

  return <>{children}</>;
}
