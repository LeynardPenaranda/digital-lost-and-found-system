"use client";
import { ChatState, SetChats } from "@/redux/chatSlice";
import { UserState } from "@/redux/userSlice";
import { GetAllChats } from "@/server-actions/chats";
import { message, Spin } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ChatCard from "./chat-card";
import socket from "@/config/socket-config";
import { ChatType, MessageType } from "@/interfaces";
import store from "@/redux/store";

const ChatList = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const { currentUserData }: UserState = useSelector(
    (state: any) => state.user
  );

  const { chats, selectedChat }: ChatState = useSelector(
    (state: any) => state.chat
  );
  const getChats = async () => {
    try {
      setLoading(true);
      const response = await GetAllChats(currentUserData?._id!);
      if (response.error) throw new Error(response.error);
      dispatch(SetChats(response));
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUserData) getChats();
  }, [currentUserData]);

  // useEffect(() => {
  //   socket.on("new-message-received", (newMessage: MessageType) => {
  //     let { chats }: ChatState = store.getState().chat;
  //     let prevChats = [...chats];

  //     let indexofChatToUpdate = prevChats.findIndex(
  //       (chat) => chat._id === newMessage.chat._id
  //     );
  //     if (indexofChatToUpdate === -1) return;

  //     let chatToUpdate = prevChats[indexofChatToUpdate];

  //     if (
  //       chatToUpdate?.lastMessage?.socketMessageId ===
  //       newMessage?.socketMessageId
  //     )
  //       return;

  //     let chatToUpdateCopy: ChatType = { ...chatToUpdate };
  //     chatToUpdateCopy.lastMessage = newMessage;
  //     chatToUpdateCopy.updatedAt = newMessage.createdAt;
  //     chatToUpdateCopy.unreadCounts = { ...chatToUpdate.unreadCounts };

  //     if (
  //       newMessage.sender._id !== currentUserData?._id &&
  //       selectedChat?._id !== newMessage.chat._id
  //     ) {
  //       chatToUpdateCopy.unreadCounts[currentUserData?._id!] =
  //         (chatToUpdateCopy.unreadCounts[currentUserData?._id!] || 0) + 1;
  //     }

  //     prevChats[indexofChatToUpdate] = chatToUpdateCopy;

  //     // push the updated chat to the top
  //     prevChats = [
  //       prevChats[indexofChatToUpdate],
  //       ...prevChats.filter((chat) => chat._id !== newMessage.chat._id),
  //     ];

  //     dispatch(SetChats(prevChats));
  //   });
  // }, []);

  useEffect(() => {
    const handleNewMessage = (newMessage: MessageType) => {
      let { chats }: ChatState = store.getState().chat;
      let prevChats = [...chats];

      let indexofChatToUpdate = prevChats.findIndex(
        (chat) => chat._id === newMessage.chat._id
      );
      if (indexofChatToUpdate === -1) return;

      let chatToUpdate = prevChats[indexofChatToUpdate];

      if (
        chatToUpdate?.lastMessage?.socketMessageId ===
        newMessage?.socketMessageId
      )
        return;

      let chatToUpdateCopy: ChatType = { ...chatToUpdate };
      chatToUpdateCopy.lastMessage = newMessage;
      chatToUpdateCopy.updatedAt = newMessage.createdAt;
      chatToUpdateCopy.unreadCounts = { ...chatToUpdate.unreadCounts };

      // IMPORTANT: now this uses LIVE selectedChat/currentUserData
      if (
        newMessage.sender._id !== currentUserData?._id &&
        selectedChat?._id !== newMessage.chat._id
      ) {
        chatToUpdateCopy.unreadCounts[currentUserData?._id!] =
          (chatToUpdateCopy.unreadCounts[currentUserData?._id!] || 0) + 1;
      }

      prevChats[indexofChatToUpdate] = chatToUpdateCopy;

      prevChats = [
        prevChats[indexofChatToUpdate],
        ...prevChats.filter((chat) => chat._id !== newMessage.chat._id),
      ];

      dispatch(SetChats(prevChats));
    };

    socket.on("new-message-received", handleNewMessage);

    return () => {
      socket.off("new-message-received", handleNewMessage);
    };
  }, [selectedChat, currentUserData]);

  return (
    <div className="flex flex-col gap-1 mt-5">
      {loading && (
        <div className="flex justify-center items-center gap-2">
          <Spin />
          <span>Loading chats...</span>
        </div>
      )}
      {chats.length === 0 && !loading && (
        <div>No chats available Press the + to add chats</div>
      )}
      {!loading &&
        chats.map((chat) => {
          return <ChatCard key={chat._id} chat={chat} />;
        })}
    </div>
  );
};

export default ChatList;
