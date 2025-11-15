import mongoose from "mongoose";
import "./message-model";

const chatSchema = new mongoose.Schema(
  {
    users: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "users",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "messages",
    },
    unreadCounts: {
      type: Object,
      default: {},
    },
    lastMessageAt: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

// ✅ Safe model reuse — avoids deleteModel issues
const ChatModel = mongoose.models.chats || mongoose.model("chats", chatSchema);

export default ChatModel;
