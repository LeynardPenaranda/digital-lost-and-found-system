import { Metadata } from "next";
import Sidebar from "../_admin-components/admin-sidebar";
import { ServerRoleGuard } from "@/lib/role-guard";

export const metadata: Metadata = {
  title: "ADMIN Digital Lost and Found System",
  description: "A platform to report and find lost items digitally.",
};
export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await ServerRoleGuard({ requiredRole: "admin" });
  return (
    <div className="h-screen grid lg:grid-cols-[auto_1fr] relative">
      {/* Desktop sidebar (in the grid) */}
      <div className="hidden lg:block h-screen">
        <Sidebar />
      </div>

      {/* Mobile sidebar (overlay) */}
      <div className="lg:hidden absolute top-0 left-0 h-screen bg-white z-50">
        <Sidebar />
      </div>

      {/* Main content */}
      <div className="overflow-auto">{children}</div>
    </div>
  );
}
