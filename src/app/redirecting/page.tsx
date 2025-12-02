"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function RedirectingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const target = searchParams.get("to") || "/sign-in";

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace(target);
    }, 1000); // wait 1s to show message
    return () => clearTimeout(timer);
  }, [router, target]);

  return (
    <div className="h-screen flex flex-col justify-center items-center bg-gray-50">
      <h1 className="text-xl font-medium mb-2">Redirecting...</h1>
      <p className="text-gray-500">You are being redirected, please wait.</p>
    </div>
  );
}
