import { MessageType } from "@/interfaces";
import { UserState } from "@/redux/userSlice";
import { useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { formatDateTime } from "@/lib/date-formats";
import Image from "next/image";
import { CheckCheck } from "lucide-react";
import { ChatState } from "@/redux/chatSlice";

const Message = ({ message }: { message: MessageType }) => {
  const { currentUserData }: UserState = useSelector(
    (state: any) => state.user
  );
  const { selectedChat }: ChatState = useSelector((state: any) => state.chat);
  const isLoggedInUserMessage = message.sender._id === currentUserData?._id;
  let read = false;
  if (
    selectedChat &&
    selectedChat?.users?.length - 1 === message.readBy.length
  ) {
    read = true;
  }
  if (isLoggedInUserMessage) {
    return (
      <div className="flex justify-end gap-2 ">
        <div className="max-w-[320px] w-fit">
          <div className="bg-primary text-white p-3 rounded-xl rounded-tr-none max-w-[250px] space-y-2">
            {message.text && (
              <p className="whitespace-pre-line break-words">{message.text}</p>
            )}

            {message.image && (
              <Image
                src={message.image}
                alt="chat-image"
                width={190}
                height={190}
                className="rounded-md"
              />
            )}
          </div>

          <div className="flex justify-between gap-5">
            <span className="text-[13px] text-gray-400 flex">
              {formatDateTime(message.createdAt)}
            </span>

            {read ? (
              <div className="flex gap-2">
                <span className="text-sm text-gray-400">seen</span>
                <CheckCheck size={13} />
              </div>
            ) : (
              <CheckCheck size={13} className="text-gray-400" />
            )}
          </div>
        </div>
        <Avatar className="w-5 h-5">
          <AvatarImage src={message.sender.profilePicture} />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
      </div>
    );
  } else {
    return (
      <div className="flex  gap-2">
        <Avatar className="w-5 h-5">
          <AvatarImage src={message.sender.profilePicture} />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
        <div className="max-w-[320px] w-fit">
          <span className="text-blue-500 text-sm">{message.sender.name}</span>

          {message.text && (
            <p className="bg-gray-200 text-primary py-2 px-5 rounded-xl rounded-tl-none">
              {message.text}
            </p>
          )}
          {message.image && (
            <div className="bg-gray-200 py-2 px-5 rounded-xl rounded-tl-none">
              <Image
                src={message.image}
                alt="chat-image"
                width={190}
                height={190}
              />
            </div>
          )}
          <span className="text-[13px] text-gray-400">
            {formatDateTime(message.createdAt)}
          </span>
        </div>
      </div>
    );
  }
};

export default Message;
