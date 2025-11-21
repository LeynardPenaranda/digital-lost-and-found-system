import { ChatState, SetSelectedChat } from "@/redux/chatSlice";
import { UserState } from "@/redux/userSlice";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useEffect, useState } from "react";
import socket from "@/config/socket-config";
import { ChatType } from "@/interfaces";
import { Button } from "antd";

const Recipient = () => {
  const [typing, setTyping] = useState(false);
  const { selectedChat }: ChatState = useSelector((state: any) => state.chat);
  const { currentUserData, onlineUsers }: UserState = useSelector(
    (state: any) => state.user
  );

  const dispatch = useDispatch();
  let chatName = "";
  let chatImage = "";

  const recipient = selectedChat?.users.find(
    (u) => u._id !== currentUserData?._id
  );

  chatName = recipient?.name!;
  chatImage = recipient?.profilePicture!;

  const unSelect = () => {
    dispatch(SetSelectedChat(null));
  };
  const onlineIndicator = () => {
    const recipientId = recipient?._id;
    const isOnline = onlineUsers.includes(recipientId!);

    if (isOnline) {
      return (
        <div className="w-3 h-3 bg-green-400 rounded-full border-2 border-white "></div>
      );
    }
    return null;
  };

  const typingAnimation = () => {
    if (typing) {
      return (
        <span className="text-green-700 font-semibold text-xs">Typing...</span>
      );
    }
  };

  useEffect(() => {
    socket.on("typing", (chat: ChatType) => {
      if (selectedChat?._id === chat._id) setTyping(true);

      setTimeout(() => {
        setTyping(false);
      }, 2000);
    });

    return () => {
      socket.off("typing");
    };
  }, [selectedChat]);
  return (
    <div className="flex justify-between py-2 px-5 border-b border-gray-200 items-center">
      <div className="flex gap-5 items-center">
        <Avatar>
          <AvatarImage src={chatImage} />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
        <div className="flex flex-col gap-1">
          {recipient?.role === "admin" ? (
            <span className="flex items-center gap-2">
              {`${chatName} - ADMIN`} {onlineIndicator()}
            </span>
          ) : (
            <span className="flex items-center gap-2">
              {chatName}
              {onlineIndicator()}
            </span>
          )}
          {typingAnimation()}
        </div>
      </div>

      <div>
        <Button onClick={unSelect}>Close</Button>
      </div>
    </div>
  );
};

export default Recipient;
