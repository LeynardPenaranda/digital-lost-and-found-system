"use server";

import ChatModel from "@/models/chat-model";
import MessageModel from "@/models/message-model";

export const CreateNewChat = async (payload: any) => {
  try {
    await ChatModel.create(payload);
    const newChats = await ChatModel.find({
      users: {
        $in: [payload.createdBy],
      },
    }).populate("users");
    return JSON.parse(JSON.stringify(newChats));
  } catch (error: any) {
    return {
      error: error.message,
    };
  }
};

export const GetAllChats = async (userId: string) => {
  try {
    const users = await ChatModel.find({
      users: {
        $in: [userId],
      },
    })
      .populate("users")
      .populate("lastMessage")
      .populate({
        path: "lastMessage",
        populate: {
          path: "sender",
        },
      })
      .sort({ lastMessageAt: -1 });
    return JSON.parse(JSON.stringify(users));
  } catch (error: any) {
    return {
      error: error.message,
    };
  }
};

export const GetOrCreateChat = async (userAId: string, userBId: string) => {
  try {
    let chat = await ChatModel.findOne({
      users: { $all: [userAId, userBId] },
    })
      .populate("users")
      .populate("lastMessage");

    if (chat) return JSON.parse(JSON.stringify(chat));

    // Create new chat
    chat = await ChatModel.create({
      users: [userAId, userBId],
      createdBy: userAId,
      unreadCounts: {},
      lastMessageAt: "",
    });

    chat = await chat.populate("users");

    return JSON.parse(JSON.stringify(chat));
  } catch (error: any) {
    return { error: error.message };
  }
};

export const SendMessage = async ({ chatId, sender, text, image }: any) => {
  try {
    const message = await MessageModel.create({
      chat: chatId,
      sender,
      text: text || "",
      image: image || "",
    });

    await ChatModel.findByIdAndUpdate(chatId, {
      lastMessage: message._id,
      lastMessageAt: new Date(),
    });

    return JSON.parse(JSON.stringify(message));
  } catch (error: any) {
    return { error: error.message };
  }
};
