import { ReactNode } from "react";
import { ServerRoleGuard } from "@/lib/role-guard";
import NormalUserClientLayout from "./_client-layout";

export const metadata = {
  title: "Digital Lost and Found System",
  description: "A platform to report and find lost items digitally.",
};

export default async function NormalUserServerLayout({
  children,
}: {
  children: ReactNode;
}) {
  await ServerRoleGuard({ requiredRole: "user" });

  return <NormalUserClientLayout>{children}</NormalUserClientLayout>;
}
