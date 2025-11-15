"use client";

import CurrentUserInfo from "@/components/current-user-info";
import { AvatarFallback, AvatarImage, Avatar } from "@/components/ui/avatar";
import socket from "@/config/socket-config";
import { setCurrentUserData, setOnlineUsers } from "@/redux/userSlice";
import { GetCurrentUserFromMongoDB } from "@/server-actions/users";
import { useClerk } from "@clerk/nextjs";

import { message } from "antd";
import {
  ChevronsLeft,
  ChevronsRight,
  LayoutDashboard,
  LogOut,
  MessageCircle,
  Ticket,
  User,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const Sidebar = () => {
  const { currentUserData } = useSelector((state: any) => state.user);
  const [showCurrentUserInfo, setShowCurrentUserInfo] = useState(false);
  const [loading, setLoading] = useState(false);

  const [isOpen, setIsOpen] = useState(true);
  const dispatch = useDispatch();
  const router = useRouter();
  const { signOut } = useClerk();

  const getCurrentUser = async () => {
    try {
      const response = await GetCurrentUserFromMongoDB();
      if (response.error) throw new Error(response.error);
      dispatch(setCurrentUserData(response));
    } catch (error: any) {
      message.error(error.message || "Something went wrong fetching user data");
    }
  };

  const onLogout = async () => {
    try {
      setLoading(true);
      socket.emit("logout", currentUserData?._id!);
      await signOut();
      message.success("Logged out successfully");
      router.push("/sign-in");
    } catch (error: any) {
      message.error(error.message || "Something went wrong during logout");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCurrentUser();
  }, []);

  useEffect(() => {
    if (currentUserData) {
      socket.emit("join", currentUserData?._id);

      socket.on("online-users-updated", (onlineUser: string[]) => {
        dispatch(setOnlineUsers(onlineUser));
      });
    }
  }, [currentUserData]);
  return (
    <div
      className={` border border-l border-gray-300 p-4 flex flex-col gap-10 items-center relative ${
        isOpen ? "w-[17rem]" : "w-16"
      } transition-width duration-300`}
    >
      <div>
        <Image src="/DLFS-logos.png" alt="Logo" width={90} height={90} />
      </div>
      <div className="flex flex-col gap-6 mt-20">
        <Link href="/admin" className="flex gap-8">
          <LayoutDashboard className=" text-gray-500" />
          {isOpen && <span className=" text-gray-500">Dashboard</span>}
        </Link>
        <Link href="/admin/admin-user-list" className="flex gap-8">
          <User className=" text-gray-500" />
          {isOpen && <span className=" text-gray-500">User</span>}
        </Link>
        <Link href="/admin/admin-status" className="flex gap-8">
          <Ticket className=" text-gray-500" />
          {isOpen && <span className=" text-gray-500">Status</span>}
        </Link>
        <Link href="/admin/admin-messages" className="flex gap-8">
          <MessageCircle className=" text-gray-500" />
          {isOpen && <span className=" text-gray-500">Messages</span>}
        </Link>
      </div>
      <div className="absolute cursor-pointer right-0 bottom-[27rem]">
        {isOpen ? (
          <ChevronsLeft onClick={() => setIsOpen(!isOpen)} />
        ) : (
          <ChevronsRight onClick={() => setIsOpen(!isOpen)} />
        )}
      </div>
      <div className="absolute bottom-5 flex items-center gap-2">
        {currentUserData?.profilePicture && (
          <Avatar
            className="w-10 h-10 rounded-md cursor-pointer"
            onClick={() => setShowCurrentUserInfo(true)}
          >
            <AvatarImage src={currentUserData?.profilePicture} />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
        )}
        {showCurrentUserInfo && currentUserData && (
          <CurrentUserInfo
            currentUserData={currentUserData}
            setShowCurrentUserInfo={setShowCurrentUserInfo}
            showCurrentUserInfo={showCurrentUserInfo}
          />
        )}
        {isOpen && (
          <div className="flex items-center gap-2">
            <div className="flex flex-col">
              <span className="text-sm overflow-auto">
                {currentUserData?.name}
              </span>
              <span className="text-xs text-gray-500">
                {currentUserData?.role}
              </span>
            </div>
            <div>
              <LogOut
                className=" text-gray-500 cursor-pointer"
                onClick={() => onLogout()}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
