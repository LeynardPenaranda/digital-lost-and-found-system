"use client";
import { UserType } from "@/interfaces";
import { GetAllUsers } from "@/server-actions/users";
import { Button, Divider, message, Modal, Spin } from "antd";
import Image from "next/image";
import React, { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { CreateNewChat } from "@/server-actions/chats";
import { UserState } from "@/redux/userSlice";
import { ChatState, SetChats } from "@/redux/chatSlice";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const NewChatModal = ({
  showNewChatModal,
  setShowNewChatModal,
}: {
  showNewChatModal: boolean;
  setShowNewChatModal: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const { currentUserData }: UserState = useSelector(
    (state: any) => state.user
  );
  const { chats }: ChatState = useSelector((state: any) => state.chat);
  const dispatch = useDispatch();

  const getUsers = async () => {
    try {
      setLoading(true);
      const response = await GetAllUsers();
      if (response.error) throw new Error("No users found");
      setUsers(response);
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const onAddToChat = async (userId: string) => {
    setSelectedUserId(userId);
    setLoading(true);
    try {
      const response = await CreateNewChat({
        users: [userId, currentUserData?._id],
        createdBy: currentUserData?._id,
      });

      if (response.error) throw new Error(response.error);

      // Find the full user object from your users state
      const addedUser = users.find((u) => u._id === userId);

      const newChat = {
        ...response,
        users: [currentUserData, addedUser], // add current user and the added user
      };

      dispatch(SetChats([newChat, ...chats]));
      message.success("Chat added successfully");
      setShowNewChatModal(false);
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <Modal
      open={showNewChatModal}
      onCancel={() => setShowNewChatModal(false)}
      footer={null}
    >
      <div className="flex flex-col gap-5 font-semibold">
        <h1 className="uppercase">Add New Chat</h1>
        {loading && !selectedUserId && (
          <div className="flex justify-center mt-20">
            <Spin />
          </div>
        )}

        {!loading && users.length > 0 && (
          <div className="flex flex-col gap-10">
            {/* Admins */}
            <div>
              <h2 className="font-bold text-lg uppercase">Admins</h2>
              <div className="flex flex-col gap-5 mt-2">
                {(() => {
                  const availableAdmins = users.filter(
                    (u) =>
                      u.role === "admin" &&
                      u._id !== currentUserData?._id &&
                      !chats.some((chat) =>
                        chat.users.some((cu) => cu._id === u._id)
                      )
                  );

                  if (availableAdmins.length === 0) {
                    return (
                      <div className="text-gray-500">No admins left to add</div>
                    );
                  }

                  return availableAdmins.map((user) => (
                    <div
                      key={user._id}
                      className="flex justify-between items-center"
                    >
                      <div className="flex gap-5 items-center">
                        <Avatar>
                          <AvatarImage src={user.profilePicture} />
                          <AvatarFallback>U</AvatarFallback>
                        </Avatar>
                        <span className="text-gray-500 capitalize">
                          {user.name}
                        </span>
                      </div>
                      <Button
                        loading={selectedUserId === user._id && loading}
                        size="small"
                        onClick={() => onAddToChat(user._id)}
                      >
                        Add to Chat
                      </Button>
                    </div>
                  ));
                })()}
              </div>
            </div>

            {/* Normal Users */}
            <div>
              <h2 className="font-bold text-lg uppercase">Users</h2>
              <div className="flex flex-col gap-5 mt-2">
                {(() => {
                  const availableUsers = users.filter(
                    (u) =>
                      u.role === "user" &&
                      u._id !== currentUserData?._id &&
                      !chats.some((chat) =>
                        chat.users.some((cu) => cu._id === u._id)
                      )
                  );

                  if (availableUsers.length === 0) {
                    return (
                      <div className="text-gray-500">No users left to add</div>
                    );
                  }

                  return availableUsers.map((user) => (
                    <React.Fragment key={user._id}>
                      <div className="flex justify-between items-center">
                        <div className="flex gap-5 items-center">
                          <Avatar>
                            <AvatarImage src={user.profilePicture} />
                            <AvatarFallback>U</AvatarFallback>
                          </Avatar>
                          <span className="text-gray-500 capitalize">
                            {user.name}
                          </span>
                        </div>
                        <Button
                          loading={selectedUserId === user._id && loading}
                          size="small"
                          onClick={() => onAddToChat(user._id)}
                        >
                          Add to Chat
                        </Button>
                      </div>
                      <Divider className="border-gray-200 my-[1px]" />
                    </React.Fragment>
                  ));
                })()}
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default NewChatModal;
