import type { Metadata } from "next";
import "@/app/globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import ReduxProvider from "@/providers/redux-provider";
import "remixicon/fonts/remixicon.css";
import MessagesListener from "@/components/chats/messages-listener";
import LoadUnreadCounts from "@/lib/load-unread-counts";
import { Toaster } from "sonner";
import RedirectIfBanned from "./(normal-user)/banned-users/_banned-user-component/redirect-users";
// 🔹 import your component

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
            {/* Wrap the entire app */}
            <RedirectIfBanned>
              <LoadUnreadCounts />
              <MessagesListener>{children}</MessagesListener>
            </RedirectIfBanned>
            <Toaster />
          </ReduxProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
