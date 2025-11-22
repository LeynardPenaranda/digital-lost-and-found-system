import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface NotificationState {
  notifications: { chatId: string; senderName: string; message: string }[];
  unseenCount: number;
}

const initialState: NotificationState = {
  notifications: [],
  unseenCount: 0,
};

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    addNotification: (
      state,
      action: PayloadAction<{
        chatId: string;
        senderName: string;
        message: string;
      }>
    ) => {
      state.notifications.push(action.payload);
      state.unseenCount += 1;
    },
    clearNotifications: (state, action: PayloadAction<string>) => {
      // remove notifications for a specific chat
      state.notifications = state.notifications.filter(
        (n) => n.chatId !== action.payload
      );
      state.unseenCount = state.notifications.length;
    },
    clearAllNotifications: (state) => {
      state.notifications = [];
      state.unseenCount = 0;
    },
  },
});

export const { addNotification, clearNotifications, clearAllNotifications } =
  notificationSlice.actions;
export default notificationSlice;
