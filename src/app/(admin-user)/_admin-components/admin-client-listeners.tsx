"use client";

import LoadUnreadCounts from "@/lib/load-unread-counts";
import MessagesListener from "@/components/chats/messages-listener";

interface AdminClientListenersProps {
  children: React.ReactNode;
}

export default function AdminClientListeners({
  children,
}: AdminClientListenersProps) {
  return (
    <>
      <LoadUnreadCounts />
      <MessagesListener>{children}</MessagesListener>
    </>
  );
}
