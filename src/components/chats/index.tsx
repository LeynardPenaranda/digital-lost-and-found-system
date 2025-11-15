import ChatsHeader from "./chats-header";
import ChatList from "./chats-list";

const Chats = () => {
  return (
    <div className="lg:w-[400px] w-[350px] h-full p-3">
      <ChatsHeader />
      <ChatList />
    </div>
  );
};

export default Chats;
