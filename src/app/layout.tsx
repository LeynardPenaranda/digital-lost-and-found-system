import type { Metadata } from "next";
import "@/app/globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import ReduxProvider from "@/providers/redux-provider";
import "remixicon/fonts/remixicon.css";

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
          <ReduxProvider>{children}</ReduxProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
