import { UserType } from "@/interfaces";
import { createSlice, current } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    currentUserData: null,
    currentUserId: "",
    onlineUsers: [],
  },
  reducers: {
    setCurrentUserData: (state, action) => {
      state.currentUserData = action.payload;
    },
    setCurrentUserId: (state, action) => {
      state.currentUserId = action.payload;
    },
    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },
  },
});

export const { setCurrentUserData, setCurrentUserId, setOnlineUsers } =
  userSlice.actions;
export default userSlice;

export interface UserState {
  currentUserData: UserType | null;
  currentUserId: string;
  onlineUsers: string[];
}
