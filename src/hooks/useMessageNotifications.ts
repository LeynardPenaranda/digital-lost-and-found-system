"use client";

import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { io, Socket } from "socket.io-client";
import { RootState } from "@/redux/store";
import { AddMessageToChat, IncrementUnread } from "@/redux/chatSlice";

import { useToast } from "@/hooks/use-toast";

export function useMessageNotifications(
  socket: Socket | null,
  currentUserId?: string
) {
  const dispatch = useDispatch();
  const { toast } = useToast();

  const selectedChat = useSelector(
    (state: RootState) => state.chat.selectedChat
  );

  useEffect(() => {
    if (!socket || !currentUserId) return;

    const handleMessage = (message: any) => {
      const chatId = message.chat;
      const senderName = message.senderName || "Someone";

      // Save message in Redux
      dispatch(AddMessageToChat({ chatId, message }));

      // If not the current chat → increment unread + toast
      if (!selectedChat || selectedChat._id !== chatId) {
        dispatch(IncrementUnread(chatId));

        toast({
          title: senderName,
          description: "Sent a new message",
        });

        const audio = new Audio("/notification.mp3");
        audio.play();
      }
    };

    socket.on("receive-message", handleMessage);

    return () => {
      socket.off("receive-message", handleMessage);
    };
  }, [socket, selectedChat, currentUserId, toast]);
}
