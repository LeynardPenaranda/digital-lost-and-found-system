"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader } from "lucide-react";


interface ServerRoleGuardResult {
  redirectTo: string | null;
  message?: string;
}

export default function RoleGuardWrapper({
  guardResult,
  children,
}: {
  guardResult: ServerRoleGuardResult;
  children?: React.ReactNode;
}) {
  const router = useRouter();
  const [redirecting, setRedirecting] = useState(false);


  useEffect(() => {
    if (guardResult.redirectTo) {
      setRedirecting(true);
      const timer = setTimeout(() => {
        router.push(guardResult.redirectTo!);
      }, 1000); // 1 second delay to show message

      return () => clearTimeout(timer);
    }
  }, [guardResult.redirectTo, router]);

  if (redirecting) {
    return (
      <div className="flex gap-2 items-center justify-center h-screen text-xl font-medium text-center">
        <Loader className="animate-spin"/>
        {guardResult.message || "Redirecting..."}
      </div>
    );
  }

  return <>{children}</>;
}
