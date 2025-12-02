"use client";

import { useEffect, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { UserState } from "@/redux/userSlice";

interface RedirectIfBannedProps {
  children?: ReactNode; // ✅ children is now optional
}

const RedirectIfBanned = ({ children }: RedirectIfBannedProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const { currentUserData }: UserState = useSelector(
    (state: any) => state.user
  );

  useEffect(() => {
    // Don't redirect if we're already on the banned page
    if (currentUserData?.isBanned && pathname !== "/banned-users") {
      router.replace("/banned-users");
    }
  }, [currentUserData, pathname, router]);

  // Render children normally if not banned OR already on the banned page
  return <>{children}</>;
};

export default RedirectIfBanned;
