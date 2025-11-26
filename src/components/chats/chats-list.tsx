"use client";

import { ChatState, SetChats } from "@/redux/chatSlice";
import { UserState } from "@/redux/userSlice";
import { GetAllChats } from "@/server-actions/chats";
import { message, Spin } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ChatCard from "./chat-card";
import socket from "@/config/socket-config";

const ChatList = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const { currentUserData }: UserState = useSelector(
    (state: any) => state.user
  );
  const { chats, selectedChat }: ChatState = useSelector(
    (state: any) => state.chat
  );

  // Fetch chats from server
  const getChats = async () => {
    if (!currentUserData?._id) return;

    try {
      setLoading(true);
      const response = await GetAllChats(currentUserData._id);
      if (response.error) throw new Error(response.error);

      dispatch(SetChats(response));
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getChats();
  }, [currentUserData?._id]);

  // Listen for new messages and update chat list
  useEffect(() => {
    if (!currentUserData) return;

    const handleNewMessage = (newMessage: any) => {
      const updatedChats = chats.map((chat) => {
        if (chat._id === newMessage.chat._id) {
          const unreadCounts = { ...chat.unreadCounts };

          // Increment unread if it's not the currently opened chat and from another user
          if (
            selectedChat?._id !== newMessage.chat._id &&
            newMessage.sender._id !== currentUserData._id
          ) {
            unreadCounts[currentUserData._id] =
              (unreadCounts[currentUserData._id] || 0) + 1;
          }

          return {
            ...chat,
            lastMessage: newMessage,
            updatedAt: newMessage.createdAt || new Date().toISOString(), // use createdAt or current time
            unreadCounts,
          };
        }
        return chat;
      });

      // Move the chat with the new message to the top
      const chatToTop = updatedChats.find((c) => c._id === newMessage.chat._id);
      const otherChats = updatedChats.filter(
        (c) => c._id !== newMessage.chat._id
      );
      dispatch(SetChats(chatToTop ? [chatToTop, ...otherChats] : updatedChats));
    };

    socket.on("new-message-received", handleNewMessage);

    return () => {
      socket.off("new-message-received", handleNewMessage);
    };
  }, [chats, selectedChat, currentUserData]);

  // Sort chats by updatedAt descending
  const sortedChats = [...chats].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  return (
    <div className="flex flex-col gap-1 mt-5">
      {loading && (
        <div className="flex justify-center items-center gap-2">
          <Spin />
          <span>Loading chats...</span>
        </div>
      )}
      {!loading && sortedChats.length === 0 && (
        <div>No chats available. Press + to add chats</div>
      )}
      {!loading &&
        sortedChats
          .filter((chat) =>
            chat.users.some((u) => u && u._id !== currentUserData?._id)
          )
          .map((chat) => <ChatCard key={chat._id} chat={chat} />)}
    </div>
  );
};

export default ChatList;
