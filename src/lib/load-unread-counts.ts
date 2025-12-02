"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { UserState } from "@/redux/userSlice";
import { setUnread } from "@/redux/notificationSlice";
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

      // Directly set counts instead of incrementing
      dispatch(setUnread(unreadCounts));
    };

    fetchUnread();
  }, [currentUserData?._id]); // only trigger when the user ID changes

  return null;
}
