"use client";

import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import socket from "@/config/socket-config";
import { toast } from "sonner";
import { ChatState } from "@/redux/chatSlice";
import { UserState } from "@/redux/userSlice";
import { incrementUnread } from "@/redux/notificationSlice";
import Image from "next/image";

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
  const { chatUnread } = useSelector((state: any) => state.notifications);

  // Notification sound
  const notificationSound = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio("/notification.wav");
    audio.addEventListener("error", () => {
      console.error("Failed to load notification.wav");
    });
    notificationSound.current = audio;
  }, []);

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

        const currentCount = chatUnread[chatId]?.count || 0;
        const newCount = currentCount + 1;

        dispatch(incrementUnread(incrementPayload));

        // 🔔 Play sound ONLY when unread message received
        if (notificationSound.current) {
          notificationSound.current.currentTime = 0;
          notificationSound.current.play().catch(() => {});
        }

        // Toast notification
        toast(
          <div className="flex items-center gap-2">
            <div className="relative">
              <Image
                src="/messages.png"
                alt="messages Logo"
                width={40}
                height={40}
              />
              {newCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                  {newCount}
                </span>
              )}
            </div>
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
  }, [selectedChat, currentUserData, chatUnread]);

  return <>{children}</>;
}
