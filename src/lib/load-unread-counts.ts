"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { UserState } from "@/redux/userSlice";
import { incrementUnread } from "@/redux/notificationSlice";
import { GetUserUnreadCounts } from "@/server-actions/chats";

export default function LoadUnreadCounts() {
  const dispatch = useDispatch();
  const { currentUserData }: UserState = useSelector(
    (state: any) => state.user
  );

  useEffect(() => {
    if (!currentUserData?._id) return;

    const fetchUnread = async () => {
      const unreadCounts = await GetUserUnreadCounts(currentUserData._id);

      Object.entries(unreadCounts).forEach(([chatId, data]) => {
        dispatch(
          incrementUnread({
            chatId,
            lastMessage: data.lastMessage,
            lastSenderName: data.lastSenderName,
          })
        );
      });
    };

    fetchUnread();
  }, [currentUserData]);

  return null;
}
