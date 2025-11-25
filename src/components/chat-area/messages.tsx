"use client";

import { MessageType } from "@/interfaces";
import {
  ChatState,
  SetMessagesForChat,
  AddMessageToChat,
  SetChats,
} from "@/redux/chatSlice";
import { GetChatMessages, ReadAllMessages } from "@/server-actions/messages";
import { message } from "antd";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Message from "./message";
import { UserState } from "@/redux/userSlice";
import socket from "@/config/socket-config";

const Messages = () => {
  const dispatch = useDispatch();
  const { currentUserData }: UserState = useSelector(
    (state: any) => state.user
  );
  const { selectedChat, chats, messagesByChatId }: ChatState = useSelector(
    (state: any) => state.chat
  );

  const [loading, setLoading] = useState(false);
  const messagesDivRef = useRef<HTMLDivElement>(null);
  const prevMessagesLength = useRef(0);

  // Messages for the current chat
  const messages = selectedChat ? messagesByChatId[selectedChat._id] || [] : [];

  // Fetch messages for selected chat
  const getMessages = async () => {
    if (!selectedChat?._id) return;

    try {
      setLoading(true);
      const res = await GetChatMessages(selectedChat._id);
      if (res.error) throw new Error(res.error);

      dispatch(SetMessagesForChat({ chatId: selectedChat._id, messages: res }));
    } catch (err: any) {
      message.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch messages & emit "chat-opened" when selectedChat changes
  useEffect(() => {
    if (!selectedChat?._id) return;

    socket.emit("chat-opened", {
      chatId: selectedChat._id,
      userId: currentUserData?._id,
    });

    // Always fetch messages (don’t rely solely on cache)
    getMessages();
  }, [selectedChat]);

  // Listen for new messages and read events
  useEffect(() => {
    const handleNewMessage = (newMessage: MessageType) => {
      if (!selectedChat) return;

      // Add to current chat messages if open
      if (selectedChat._id === newMessage.chat._id) {
        dispatch(
          AddMessageToChat({ chatId: selectedChat._id, message: newMessage })
        );
      }

      // Update lastMessage and unreadCounts in chat list
      const updatedChats = chats.map((chat) => {
        if (chat._id === newMessage.chat._id) {
          const unreadCounts = { ...chat.unreadCounts };
          if (
            newMessage.sender._id !== currentUserData?._id &&
            selectedChat._id !== chat._id
          ) {
            unreadCounts[currentUserData!._id] =
              (unreadCounts[currentUserData!._id] || 0) + 1;
          }
          return {
            ...chat,
            lastMessage: newMessage,
            updatedAt: newMessage.createdAt || new Date().toISOString(),
            unreadCounts,
          };
        }
        return chat;
      });

      const chatToTop = updatedChats.find((c) => c._id === newMessage.chat._id);
      const otherChats = updatedChats.filter(
        (c) => c._id !== newMessage.chat._id
      );
      dispatch(SetChats(chatToTop ? [chatToTop, ...otherChats] : updatedChats));
    };

    const handleRead = ({
      chatId,
      readByUserId,
    }: {
      chatId: string;
      readByUserId: string;
    }) => {
      if (!messagesByChatId[chatId]) return;

      const updated = messagesByChatId[chatId].map((msg) =>
        !msg.readBy.includes(readByUserId) && msg.sender._id !== readByUserId
          ? { ...msg, readBy: [...msg.readBy, readByUserId] }
          : msg
      );
      dispatch(SetMessagesForChat({ chatId, messages: updated }));
    };

    socket.on("new-message-received", handleNewMessage);
    socket.on("user-read-all-chat-messages", handleRead);

    return () => {
      socket.off("new-message-received", handleNewMessage);
      socket.off("user-read-all-chat-messages", handleRead);
    };
  }, [selectedChat, chats, messagesByChatId, currentUserData]);

  // Mark messages as read
  useEffect(() => {
    if (!selectedChat?._id) return;
    if (messages.length === 0) return;

    const unreadMessages = messages.filter(
      (msg) =>
        !msg.readBy.includes(currentUserData?._id!) &&
        msg.sender._id !== currentUserData?._id
    );

    if (unreadMessages.length > 0) {
      ReadAllMessages({
        userId: currentUserData!._id,
        chatId: selectedChat._id,
      });

      socket.emit("read-all-messages", {
        chatId: selectedChat._id,
        readByUserId: currentUserData!._id,
        users: selectedChat.users
          .filter((u) => u._id !== currentUserData!._id)
          .map((u) => u._id),
      });
    }

    // Reset unread count in chat list
    const updatedChats = chats.map((chat) =>
      chat._id === selectedChat._id
        ? {
            ...chat,
            unreadCounts: { ...chat.unreadCounts, [currentUserData!._id]: 0 },
          }
        : chat
    );
    dispatch(SetChats(updatedChats));
  }, [messages, selectedChat]);

  // Scroll to bottom
  useEffect(() => {
    if (!messagesDivRef.current) return;

    // Always scroll to bottom on chat change or new messages
    messagesDivRef.current.scrollTop = messagesDivRef.current.scrollHeight;

    // Update previous length
    prevMessagesLength.current = messages.length;
  }, [messages, selectedChat]);

  return (
    <div className="flex-1 p-3 overflow-y-scroll" ref={messagesDivRef}>
      {loading ? (
        <div className="w-full flex justify-center items-center py-10 text-gray-500">
          <div className="animate-spin h-6 w-6 border-2 border-gray-400 border-t-transparent rounded-full mr-3"></div>
          Loading messages...
        </div>
      ) : messages.length === 0 ? (
        <div className="w-full flex justify-center items-center py-10 text-gray-500 text-sm">
          No messages yet.
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {messages.map((msg) => (
            <Message key={msg._id || crypto.randomUUID()} message={msg} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Messages;
