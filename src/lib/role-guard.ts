import { GetCurrentUserFromMongoDB } from "@/server-actions/users";

interface Props {
  requiredRole: "admin" | "user";
}

export interface GuardResult {
  redirectTo: string | null;
  message?: string;
}

export const ServerRoleGuard = async ({
  requiredRole,
}: Props): Promise<GuardResult> => {
  const user = await GetCurrentUserFromMongoDB();

  if (!user) {
    return {
      redirectTo: "/sign-in",
      message: "Please sign in first.",
    };
  }

  if (!user.role || !["admin", "user"].includes(user.role)) {
    return {
      redirectTo: "/",
      message: "Invalid account role.",
    };
  }

  if (user.role !== requiredRole) {
    const redirectPath = user.role === "admin" ? "/admin" : "/home";
    const roleName = user.role === "admin" ? "admin" : "normal user";

    return {
      redirectTo: redirectPath,
      message: `You are being redirected to ${roleName} page.`,
    };
  }

  // Correct role, allow access
  return { redirectTo: null };
};
