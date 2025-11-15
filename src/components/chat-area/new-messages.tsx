import { Button, message } from "antd";
import { Input } from "../ui/input";
import { Image, SendHorizontal, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { UserState } from "@/redux/userSlice";
import { useSelector } from "react-redux";
import { ChatState } from "@/redux/chatSlice";
import { SendNewMessage } from "@/server-actions/messages";
import socket from "@/config/socket-config";
import dayjs from "dayjs";
import EmojiPicker from "emoji-picker-react";
import ImageSelector from "./image-selector";
import { UploadImageToFireBaseAndReturnUrlMessage } from "@/lib/image-upload";

const NewMessages = () => {
  const [showEmoji, setShowEmoji] = useState(false);
  const [text, setText] = useState("");
  const { currentUserData }: UserState = useSelector(
    (state: any) => state.user
  );
  const [showImageSelector, setShowImageSelector] = useState(false);
  const { selectedChat }: ChatState = useSelector((state: any) => state.chat);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  const onSend = async () => {
    try {
      if (!text && !selectedImageFile) return;
      setLoading(true);
      let image = "";
      if (selectedImageFile) {
        image = await UploadImageToFireBaseAndReturnUrlMessage(
          selectedImageFile
        );
      }
      const commonPayload = {
        text,
        image,
        socketMessageId: dayjs().unix(),
        createdAt: dayjs().toISOString(),
        updatedAt: dayjs().toISOString(),
        readBy: [],
      };
      const socketPayload = {
        ...commonPayload,
        chat: selectedChat,
        sender: currentUserData,
      };

      // send message using socket
      socket.emit("send-new-message", socketPayload);
      setText("");
      setSelectedImageFile(null);
      setShowImageSelector(false);
      setShowEmoji(false);
      const dbPayload = {
        ...commonPayload,
        sender: currentUserData?._id!,
        chat: selectedChat?._id!,
      };
      SendNewMessage(dbPayload);
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    socket.emit("typing", {
      chat: selectedChat,
      senderId: currentUserData?._id,
    });
  }, [selectedChat, text]);

  return (
    <div className="p-3 bg-gray-100 border-t border-gray-100 flex gap-5 items-center relative">
      <div>
        {showEmoji && (
          <div className="absolute left-2 bottom-12">
            <EmojiPicker
              height={350}
              previewConfig={{
                showPreview: false, // hides the emoji name/description on hover
              }}
              onEmojiClick={(emojiObject: any) => {
                setText((prevText) => prevText + emojiObject.emoji);
                inputRef.current?.focus();
              }}
            />
          </div>
        )}
        <div className="flex items-center gap-2">
          <Button
            onClick={() => setShowEmoji(!showEmoji)}
            type={showEmoji ? `primary` : `default`}
          >
            {showEmoji ? (
              <X size={14} />
            ) : (
              <i className="ri-emoji-sticker-line"></i>
            )}
          </Button>
          <Button onClick={() => setShowImageSelector(!showImageSelector)}>
            <Image size={14} />
          </Button>
        </div>
      </div>
      <div className="flex-1">
        <Input
          type="text"
          placeholder="Type a message"
          className="  focus-visible:ring-0 focus-visible:ring-offset-0 
          focus-visible:outline-none focus-visible:border-gray-300 bg-white"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onSend();
            }
          }}
          ref={inputRef}
        />
      </div>
      <Button type="primary" onClick={() => onSend()}>
        <SendHorizontal />
      </Button>

      {showImageSelector && (
        <ImageSelector
          showImageSelector={showImageSelector}
          setShowImageSelector={setShowImageSelector}
          selectedImageFile={selectedImageFile}
          setSelectedImageFile={setSelectedImageFile}
          onSend={onSend}
          loading={loading}
        />
      )}
    </div>
  );
};

export default NewMessages;
