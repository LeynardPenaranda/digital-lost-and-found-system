import ChatArea from "@/components/chat-area";
import Chats from "@/components/chats";
import { Divider } from "antd";

const AdminMessages = () => {
  return (
    <div className="flex h-[100vh]">
      <Chats />
      <Divider type="vertical" className="h-full px-0 mx-0" />
      <ChatArea />
    </div>
  );
};

export default AdminMessages;
