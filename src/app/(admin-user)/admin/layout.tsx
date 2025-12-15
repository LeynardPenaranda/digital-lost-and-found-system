import { Metadata } from "next";
import Sidebar from "../_admin-components/admin-sidebar";
import { ServerRoleGuard } from "@/lib/role-guard";
import AdminClientListeners from "../_admin-components/admin-client-listeners";
import RoleGuardWrapper from "@/lib/role-guard-wrapper";


export const metadata: Metadata = {
  title: "ADMIN Digital Lost and Found System",
  description: "A platform to report and find lost items digitally.",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // ✅ Get guard result (DON'T ignore it)
  const guardResult = await ServerRoleGuard({ requiredRole: "admin" });

  // ⛔ BLOCK admin UI completely if redirect is needed
  if (guardResult.redirectTo) {
    return (
      <RoleGuardWrapper guardResult={guardResult}>
        {/* Nothing here on purpose */}
      </RoleGuardWrapper>
    );
  }

  // ✅ Allowed → render admin UI
  return (
    <div className="h-screen grid lg:grid-cols-[auto_1fr] relative">
      {/* Desktop sidebar */}
      <div className="hidden lg:block h-screen">
        <Sidebar />
      </div>

      {/* Mobile sidebar */}
      <div className="lg:hidden absolute top-0 left-0 h-screen bg-white z-50">
        <Sidebar />
      </div>

      {/* Main content */}
      <div className="overflow-auto">
        <AdminClientListeners>{children}</AdminClientListeners>
      </div>
    </div>
  );
}
