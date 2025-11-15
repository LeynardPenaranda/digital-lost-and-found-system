import Header from "@/components/header";
import { ServerRoleGuard } from "@/lib/role-guard";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Digital Lost and Found System",
  description: "A platform to report and find lost items digitally.",
};
export default async function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await ServerRoleGuard({ requiredRole: "user" });

  return (
    <div className="h-screen grid grid-rows-[auto_1fr]">
      <Header />
      <div>{children}</div>
    </div>
  );
}
