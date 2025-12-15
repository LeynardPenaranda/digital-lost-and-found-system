"use client";

import Footer from "@/components/footer";
import TempHeader from "@/components/temp-header";
import { Button } from "@/components/ui/button";
import { UserState } from "@/redux/userSlice";
import Link from "next/link";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
  const router = useRouter();
  const { currentUserData }: UserState = useSelector((state: any) => state.user);

  // Redirect logged-in users immediately
  useEffect(() => {
    if (!currentUserData) return;

    if (currentUserData.role === "admin") router.replace("/admin");
    else router.replace("/home");
  }, [currentUserData, router]);

  // Render nothing while redirecting
  if (currentUserData) return null;

  return (
    <>
      <TempHeader />
      <div className="lg:grid lg:grid-rows-[minmax(700px,1fr)_auto] h-full">
        <div className="flex flex-col lg:grid lg:grid-cols-2">
          <div className="flex flex-col items-center lg:items-end justify-center">
            <div className="lg:w-[50%]">
              <h1 className="text-[4rem] lg:text-[6rem] text-center lg:text-start">
                Find & Recover With Ease
              </h1>
            </div>
            <p className="px-2 text-center">
              Experience effortless recovery with our dedicated lost and found service.
            </p>
          </div>

          <div className="flex items-center justify-center h-full">
            <div className="flex flex-col gap-2 w-[30%] ">
              <Button asChild>
                <Link href="/sign-up">Sign Up</Link>
              </Button>
            </div>
          </div>
        </div>
        <div>
          <Footer />
        </div>
      </div>
    </>
  );
}
