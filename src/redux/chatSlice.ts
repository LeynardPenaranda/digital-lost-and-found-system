import { ChatType, MessageType } from "@/interfaces";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ChatSliceState {
  chats: ChatType[];
  selectedChat: ChatType | null;
  messagesByChatId: { [chatId: string]: MessageType[] };
}

const initialState: ChatSliceState = {
  chats: [],
  selectedChat: null,
  messagesByChatId: {},
};

const chatSlice = createSlice({
  name: "chats",
  initialState,
  reducers: {
    SetChats: (state, action: PayloadAction<ChatType[]>) => {
      state.chats = action.payload;
    },
    SetSelectedChat: (state, action: PayloadAction<ChatType | null>) => {
      state.selectedChat = action.payload;
    },
    SetMessagesForChat: (
      state,
      action: PayloadAction<{ chatId: string; messages: MessageType[] }>
    ) => {
      state.messagesByChatId[action.payload.chatId] = action.payload.messages;
    },
    AddMessageToChat: (
      state,
      action: PayloadAction<{ chatId: string; message: MessageType }>
    ) => {
      const chatMessages = state.messagesByChatId[action.payload.chatId] || [];
      const exists = chatMessages.find(
        (m) => m.socketMessageId === action.payload.message.socketMessageId
      );
      if (!exists) chatMessages.push(action.payload.message);
      state.messagesByChatId[action.payload.chatId] = chatMessages;
    },
  },
});

export const {
  SetChats,
  SetSelectedChat,
  SetMessagesForChat,
  AddMessageToChat,
} = chatSlice.actions;

export default chatSlice;

export interface ChatState {
  chats: ChatType[];
  selectedChat: ChatType | null;
  messagesByChatId: { [chatId: string]: MessageType[] };
}
