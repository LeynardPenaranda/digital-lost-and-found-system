export interface UserType {
  _id: string;
  clerkUserId: string;
  name: string;
  email: string;
  profilePicture: string;
  userName: string;
  role: "admin" | "user";
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatType {
  _id: string;
  users: UserType[];
  createdBy: UserType;
  lastMessage: MessageType;
  unreadCounts: Record<string, number>;
  createdAt: Date;
  updatedAt: Date;
}

export interface MessageType {
  _id: string;
  socketMessageId: string;
  chat: ChatType;
  sender: UserType;
  text: string;
  image: string;
  readBy: string[];
  createdAt: Date;
  updatedAt: Date;
}
