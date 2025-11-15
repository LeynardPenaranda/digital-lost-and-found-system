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
    <div className="h-screen grid grid-cols-[auto_1fr] ">
      <Sidebar />
      <div>{children}</div>
    </div>
  );
}
