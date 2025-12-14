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
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearAllUnread, NotificationState } from "@/redux/notificationSlice";

const Sidebar = () => {
  const { currentUserData } = useSelector((state: any) => state.user);
  const { chatUnread }: NotificationState = useSelector(
    (state: any) => state.notifications
  );

  const [showCurrentUserInfo, setShowCurrentUserInfo] = useState(false);
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(true);

  const dispatch = useDispatch();
  const router = useRouter();
  const { signOut } = useClerk();

  useEffect(() => {
    setLoading(false);
  }, [pathname]);

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

      dispatch(clearAllUnread());
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

  const totalUnread = Object.values(chatUnread).reduce(
    (acc, curr) => acc + (curr.count || 0),
    0
  );

  // Sidebar links
  const links = [
    { name: "Dashboard", href: "/admin", icon: <LayoutDashboard /> },
    { name: "User", href: "/admin/admin-user-list", icon: <User /> },
    { name: "Status", href: "/admin/admin-status", icon: <Ticket /> },
    {
      name: "Messages",
      href: "/admin/admin-messages",
      icon: <MessageCircle />,
      badge: totalUnread,
    },
  ];

  const handleLinkClick = (href: string, e: React.MouseEvent) => {
    if (pathname === href) {
      e.preventDefault();
      message.info(`You are already on ${href.split("/").pop()}`);
      return;
    }
    setLoading(true);
  };

  const renderLinks = () =>
    links.map((link) => (
      <Link
        key={link.href}
        href={link.href}
        onClick={(e) => handleLinkClick(link.href, e)}
        className={`flex items-center gap-2 md:gap-8 px-2 py-1 ${pathname === link.href ? "border-b-2 border-blue-500" : ""
          } text-gray-500 relative`}
      >
        {link.icon}

        {isOpen && (
          <span className="hidden md:inline text-gray-500 whitespace-nowrap">
            {link.name}
          </span>
        )}

        {(link.badge ?? 0) > 0 && (
  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full px-1.5 py-0.5 pointer-events-none">
    {link.badge}
  </span>
)}


      </Link>

    ));

  return (
    <>
      {loading && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex flex-col items-center justify-center z-50 animate-fadeIn">
          <div className="h-12 w-12 border-4 border-white/30 border-t-white rounded-full animate-spin mb-4"></div>
          <span className="text-white text-sm font-medium tracking-wide animate-pulse">
            Navigating...
          </span>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div
        className={`border border-l border-gray-300 p-4 hidden lg:flex flex-col gap-10 items-center relative h-full ${isOpen ? "w-[17rem]" : "w-16"
          } transition-width duration-300`}
      >
        <div>
          <Image src="/DLFS-logos.png" alt="Logo" width={90} height={90} />
        </div>

        <div className="flex flex-col gap-6 mt-20">{renderLinks()}</div>

        <div className="absolute cursor-pointer right-0 bottom-[27rem]">
          {isOpen ? (
            <ChevronsLeft onClick={() => setIsOpen(!isOpen)} />
          ) : (
            <ChevronsRight onClick={() => setIsOpen(!isOpen)} />
          )}
        </div>

        {/* User Info & Logout */}
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
                  className="text-gray-500 cursor-pointer"
                  onClick={onLogout}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div
        className={`border border-l border-gray-300 p-4 lg:hidden flex-col gap-10 items-center relative h-full
      transition-all duration-300 ease-in-out
      ${isOpen ? "w-16 flex" : "hidden pointer-events-none"}`}
      >
        <div>
          <Image src="/DLFS-logos.png" alt="Logo" width={90} height={90} />
        </div>

        <div className="flex flex-col gap-6 mt-20">{renderLinks()}</div>

        <div className="absolute bottom-5 flex items-center gap-2">
          {isOpen && currentUserData?.profilePicture && (
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
        </div>
      </div>

      {/* Mobile Collapse Button */}
      <div className="absolute cursor-pointer left-2 bottom-[25rem] z-20 lg:hidden bg-gray-500/20 p-2 rounded-sm">
        <div
          onClick={() => setIsOpen(!isOpen)}
          className={`transition-transform duration-300 ${isOpen ? "rotate-180" : "rotate-0"
            }`}
        >
          {isOpen ? <ChevronsLeft /> : <ChevronsRight />}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
