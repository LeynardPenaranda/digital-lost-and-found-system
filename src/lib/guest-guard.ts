// lib/guest-guard.ts
import { GetCurrentUserFromMongoDB } from "@/server-actions/users";
import { redirect } from "next/navigation";

export const GuestGuard = async () => {
  const user = await GetCurrentUserFromMongoDB();

  if (!user) return; // Not logged in → allow access

  // Already logged in → redirect to proper page
  if (user.role === "admin") {
    redirect("/admin");
  } else {
    redirect("/home");
  }
};
