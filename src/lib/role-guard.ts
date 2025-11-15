import { GetCurrentUserFromMongoDB } from "@/server-actions/users";
import { redirect } from "next/navigation";

interface Props {
  requiredRole: "admin" | "user";
}

export const ServerRoleGuard = async ({ requiredRole }: Props) => {
  const user = await GetCurrentUserFromMongoDB(); // server-side fetch

  if (user.role !== requiredRole) {
    redirect(user.role === "admin" ? "/admin" : "/");
    return null;
  }

  return null; // just a guard, no UI
};
