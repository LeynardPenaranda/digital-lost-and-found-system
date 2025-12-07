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

    console.log(currentUserData?._id);

    const fetchUnread = async () => {
      console.log("Inside the fetch:", currentUserData?._id);
      const unreadCounts = await GetUserUnreadCounts(currentUserData?._id);
      console.log("Unread response:", unreadCounts);
      // Directly set counts instead of incrementing
      dispatch(setUnread(unreadCounts));
    };

    fetchUnread();
  }, [currentUserData?._id, dispatch]); // only trigger when the user ID changes

  return null;
}
