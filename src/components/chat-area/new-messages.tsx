import { Button, message } from "antd";
import { Image, SendHorizontal, SmilePlus, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { UserState } from "@/redux/userSlice";
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
  const inputRef = useRef<HTMLTextAreaElement>(null);
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

      // Send via socket
      socket.emit("send-new-message", socketPayload);

      // Reset input
      setText("");
      setSelectedImageFile(null);
      setShowEmoji(false);
      setShowImageSelector(false);

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

  const autoResize = (el: HTMLTextAreaElement) => {
    el.style.height = "auto"; // reset height
    el.style.height = el.scrollHeight + "px"; // grow with content
  };

  return (
    <div className="p-3 bg-gray-100 border-t border-gray-100 flex gap-3 items-end relative">
      {/* Left buttons */}
      <div className="flex flex-col justify-end gap-2">
        {showEmoji && (
          <div className="absolute left-2 bottom-28 z-50">
            <EmojiPicker
              height={350}
              previewConfig={{ showPreview: false }}
              onEmojiClick={(emojiObject: any) => {
                setText((prev) => prev + emojiObject.emoji);
                inputRef.current?.focus();
              }}
            />
          </div>
        )}
        <Button
          onClick={() => setShowEmoji(!showEmoji)}
          type={showEmoji ? "primary" : "default"}
        >
          {showEmoji ? <X size={14} /> : <SmilePlus size={14} />}
        </Button>
        <Button onClick={() => setShowImageSelector(!showImageSelector)}>
          <Image size={14} />
        </Button>
      </div>

      {/* Textarea */}
      <div className="flex-1">
        <textarea
          placeholder="Type a message"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            autoResize(e.target);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              onSend();
            }
          }}
          ref={inputRef}
          className="
            w-full
            resize-none
            rounded-md
            px-3 py-2
            bg-white
            focus-visible:ring-0 focus-visible:ring-offset-0
            focus-visible:outline-none
            focus-visible:border-gray-300
            overflow-auto
            max-h-[120px]         /* mobile max height */
            lg:max-h-[90px]       /* large screen max height */
          "
          style={{ minHeight: "40px" }}
        />
      </div>

      {/* Send button */}
      <div className="flex flex-col justify-end">
        <Button type="primary" onClick={() => onSend()}>
          <SendHorizontal />
        </Button>
      </div>

      {/* Image selector */}
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
