"use client";

import Header from "@/components/header";
import RedirectIfBanned from "./banned-users/_banned-user-component/redirect-users";
import LoadUnreadCounts from "@/lib/load-unread-counts";
import MessagesListener from "@/components/chats/messages-listener";

interface NormalUserClientLayoutProps {
  children: React.ReactNode;
}

export default function NormalUserClientLayout({
  children,
}: NormalUserClientLayoutProps) {
  return (
    <div className="h-screen grid grid-rows-[auto_1fr]">
      <Header />
      <LoadUnreadCounts />
      <MessagesListener>{children}</MessagesListener>
      <RedirectIfBanned />
    </div>
  );
}
