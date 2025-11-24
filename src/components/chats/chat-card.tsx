"use client";
import { ChatType } from "@/interfaces";
import { ChatState, SetSelectedChat } from "@/redux/chatSlice";
import { UserState } from "@/redux/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { formatDateTime } from "@/lib/date-formats";
import { clearChatUnread } from "@/redux/notificationSlice";

const ChatCard = ({ chat }: { chat: ChatType }) => {
  const { currentUserData, onlineUsers }: UserState = useSelector(
    (state: any) => state.user
  );
  const { selectedChat }: ChatState = useSelector((state: any) => state.chat);
  const dispatch = useDispatch();
  let chatName = "";
  let chatImage = "";

  // to do
  let lastMessage = "";
  let lastMessageSenderName = "";
  let lastMessageTime = "";

  const recipient = chat.users.find(
    (user) => user._id !== currentUserData?._id
  );

  chatName = recipient?.name!;
  chatImage = recipient?.profilePicture!;

  if (chat.lastMessage) {
    lastMessage = chat.lastMessage.text;
    lastMessageSenderName =
      chat.lastMessage.sender?._id === currentUserData?._id
        ? "You: "
        : `${chat.lastMessage?.sender?.name.split(" ")[0]}: `;

    lastMessageTime = formatDateTime(chat.lastMessage.createdAt);
  }
  const isSelected = selectedChat?._id === chat._id;

  const isUnreadCountsExist =
    chat.unreadCounts && chat.unreadCounts[currentUserData?._id!];

  const unreadCounts = () => {
    if (
      !chat.unreadCounts ||
      !chat.unreadCounts[currentUserData?._id!] ||
      chat._id === selectedChat?._id
    ) {
      return null;
    }
    return (
      <div className="bg-gray-800 rounded-full h-5 w-5 flex justify-center items-center">
        <span className="text-white text-xs">
          {chat.unreadCounts[currentUserData?._id!]}
        </span>
      </div>
    );
  };

  const onlineIndicator = () => {
    const recipientId = chat.users.find(
      (user) => user._id !== currentUserData?._id
    )?._id;
    if (onlineUsers.includes(recipientId!)) {
      return <div className="w-2 h-2 rounded-full bg-green-400"></div>;
    }
  };
  const shortMessage =
    lastMessage && lastMessage.length > 8
      ? lastMessage.slice(0, 8) + "..."
      : lastMessage;

  return (
    <div
      className={`flex justify-between hover:bg-gray-100 p-2 rounded cursor-pointer ${
        isSelected ? `bg-gray-100 border border-gray-200 ` : ``
      }`}
      onClick={() => {
        dispatch(SetSelectedChat(chat)); // select the chat
        dispatch(clearChatUnread(chat._id)); // clear unread count for this chat
      }}
    >
      <div className="flex gap-5 items-center">
        <Avatar>
          <AvatarImage src={chatImage} />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
        <div
          className={`flex flex-col gap-1 ${
            isUnreadCountsExist ? `font-bold` : ``
          }`}
        >
          {recipient?.role !== "admin" ? (
            <span
              className={`flex items-center gap-2 ${
                isUnreadCountsExist ? `font-bold` : ``
              }`}
            >
              {chatName}
              {onlineIndicator()}
            </span>
          ) : (
            <span
              className={`flex items-center gap-2 ${
                isUnreadCountsExist ? `font-bold` : ``
              }`}
            >
              {chatName.split(" ")[0] + ` ` + `ADMIN`}
              {onlineIndicator()}
            </span>
          )}

          <span
            className={`text-xs ${
              isUnreadCountsExist ? `font-bold text-black` : `text-gray-500`
            }`}
          >
            {lastMessageSenderName}
            {shortMessage}
          </span>
        </div>
      </div>
      <div>
        <span className="text-xs text-gray-500">{unreadCounts()}</span>
        <span
          className={`text-xs ${
            isUnreadCountsExist ? `font-bold text-black` : `text-gray-500`
          }`}
        >
          {lastMessageTime}
        </span>
      </div>
    </div>
  );
};

export default ChatCard;
