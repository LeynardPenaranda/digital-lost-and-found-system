
import { ServerRoleGuard } from "@/lib/role-guard";
import NormalUserClientLayout from "./_client-layout";
import RoleGuardWrapper from "@/lib/role-guard-wrapper";

export const metadata = {
  title: "Digital Lost and Found System",
  description: "A platform to report and find lost items digitally.",
};

export default async function NormalUserServerLayout({ children }: { children: React.ReactNode }) {
  const guardResult = await ServerRoleGuard({ requiredRole: "user" });

  return (
    <RoleGuardWrapper guardResult={guardResult}>
      <NormalUserClientLayout>{children}</NormalUserClientLayout>
    </RoleGuardWrapper>
  );
}
