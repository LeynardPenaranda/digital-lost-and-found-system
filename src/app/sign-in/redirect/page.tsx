"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SignInRedirect() {
  const { isLoaded, user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded || !user) return;

    const role = user.publicMetadata?.role;
    if (role === "admin") router.replace("/admin");
    else router.replace("/home");
  }, [isLoaded, user, router]);

  return <div>Redirecting...</div>;
}
