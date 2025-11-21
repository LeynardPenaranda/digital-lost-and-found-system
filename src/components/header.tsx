"use client";

import { GetCurrentUserFromMongoDB } from "@/server-actions/users";
import { Drawer, message } from "antd";
import Image from "next/image";
import { useEffect, useState } from "react";
import NavLinks from "./navlinks";
import CurrentUserInfo from "./current-user-info";
import { useDispatch, useSelector } from "react-redux";
import {
  setCurrentUserData,
  setOnlineUsers,
  UserState,
} from "@/redux/userSlice";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import socket from "@/config/socket-config";
import { List } from "lucide-react";

const Header = () => {
  const [showCurrentUserInfo, setShowCurrentUserInfo] = useState(false);
  const [showBar, setShowBar] = useState(false);
  const { currentUserData }: UserState = useSelector(
    (state: any) => state.user
  );
  const dispatch = useDispatch();

  const getCurrentUser = async () => {
    try {
      const response = await GetCurrentUserFromMongoDB();
      if (response.error) throw new Error(response.error);
      dispatch(setCurrentUserData(response));
    } catch (error: any) {
      message.error(error.message || "Something went wrong fetching user data");
    }
  };
  useEffect(() => {
    getCurrentUser();
  }, []);

  useEffect(() => {
    if (currentUserData) {
      socket.emit("join", currentUserData?._id);

      // This set the online users to the redux or user slice
      socket.on("online-users-updated", (onlineUser: string[]) => {
        dispatch(setOnlineUsers(onlineUser));
      });
    }
  }, [currentUserData]);

  return (
    <header className="border h-[5rem] flex items-center justify-between bg-gray-100 sticky top-0 z-50">
      <div className="flex items-center justify-center">
        <Image src="/DLFS-logos.png" alt="Logo" width={70} height={70} />
        <span className="uppercase font-bold hidden">
          Digital lost and found system
        </span>
      </div>
      <div className="flex items-center gap-4 mr-5">
        <div className="hidden lg:flex">
          <NavLinks />
        </div>
        <Avatar
          className="cursor-pointer"
          onClick={() => setShowCurrentUserInfo(true)}
        >
          <AvatarImage src={currentUserData?.profilePicture} />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
        <div className="lg:hidden">
          <List size={35} onClick={() => setShowBar(true)} />
        </div>
      </div>
      {showCurrentUserInfo && currentUserData && (
        <CurrentUserInfo
          currentUserData={currentUserData}
          setShowCurrentUserInfo={setShowCurrentUserInfo}
          showCurrentUserInfo={showCurrentUserInfo}
        />
      )}

      {showBar && (
        <Drawer
          open={showBar}
          onClose={() => setShowBar(!showBar)}
          title="Links"
          className="lg:hidden"
        >
          <NavLinks className="flex-col " />
        </Drawer>
      )}
    </header>
  );
};

export default Header;
