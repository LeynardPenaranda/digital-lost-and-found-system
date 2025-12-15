import type { Metadata } from "next";
import "@/app/globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import ReduxProvider from "@/providers/redux-provider";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Digital Lost and Found System",
  description: "A platform to report and find lost items digitally.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      signInForceRedirectUrl={process.env.CLERK_SIGN_IN_FORCE_REDIRECT_URL}
      signInFallbackRedirectUrl={process.env.CLERK_SIGN_IN_FALLBACK_REDIRECT_URL}
      signUpForceRedirectUrl={process.env.CLERK_SIGN_UP_FORCE_REDIRECT_URL}
      signUpFallbackRedirectUrl={process.env.CLERK_SIGN_UP_FALLBACK_REDIRECT_URL}
    >
      <html lang="en">
        <body>
          <ReduxProvider>
            {children}
            <Toaster />
          </ReduxProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
