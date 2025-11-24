import type { Metadata } from "next";
import "@/app/globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import ReduxProvider from "@/providers/redux-provider";
import "remixicon/fonts/remixicon.css";
import MessagesListener from "@/components/chats/messages-listener";
import LoadUnreadCounts from "@/lib/load-unread-counts";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Digital Lost and Found System",
  description: "A platform to report and find lost items digitally.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <ReduxProvider>
            {/* Load initial unread counts from DB */}
            <LoadUnreadCounts />

            {/* Listen to real-time incoming messages */}
            <MessagesListener>{children}</MessagesListener>
            <Toaster />
          </ReduxProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
