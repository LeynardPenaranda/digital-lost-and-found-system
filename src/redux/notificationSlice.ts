import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface NotificationState {
  chatUnread: {
    [chatId: string]: {
      count: number;
      lastMessage: string;
      lastSenderName: string;
    };
  };
}

const initialState: NotificationState = {
  chatUnread: {},
};

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    incrementUnread: (
      state,
      action: PayloadAction<{
        chatId: string;
        lastMessage: string;
        lastSenderName: string;
      }>
    ) => {
      const { chatId, lastMessage, lastSenderName } = action.payload;
      if (!state.chatUnread[chatId]) {
        state.chatUnread[chatId] = {
          count: 0,
          lastMessage: "",
          lastSenderName: "",
        };
      }
      state.chatUnread[chatId].count += 1;
      state.chatUnread[chatId].lastMessage = lastMessage;
      state.chatUnread[chatId].lastSenderName = lastSenderName;
    },
    clearChatUnread: (state, action: PayloadAction<string>) => {
      delete state.chatUnread[action.payload];
    },
    clearAllUnread: (state) => {
      state.chatUnread = {};
    },
  },
});

export const { incrementUnread, clearChatUnread, clearAllUnread } =
  notificationSlice.actions;
export default notificationSlice;
