
import { ServerRoleGuard } from "@/lib/role-guard";
import NormalUserClientLayout from "./_client-layout";
import RoleGuardWrapper from "@/lib/role-guard-wrapper";

export const metadata = {
  title: "Digital Lost and Found System",
  description: "A platform to report and find lost items digitally.",
};

export default async function NormalUserServerLayout({ children }: { children: React.ReactNode }) {
   // ✅ Get guard result (DON'T ignore it)
    const guardResult = await ServerRoleGuard({ requiredRole: "user" });
  
    // ⛔ BLOCK admin UI completely if redirect is needed
    if (guardResult.redirectTo) {
      return (
        <RoleGuardWrapper guardResult={guardResult}>
          {/* Nothing here on purpose */}
        </RoleGuardWrapper>
      );
    }

  return (
    <RoleGuardWrapper guardResult={guardResult}>
      <NormalUserClientLayout>{children}</NormalUserClientLayout>
    </RoleGuardWrapper>
  );
}
