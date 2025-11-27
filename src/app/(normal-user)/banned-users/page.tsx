"use client";

import { Card } from "@/components/ui/card";
import { UserState } from "@/redux/userSlice";
import { useSelector } from "react-redux";

export default function BannedPage() {
  const { currentUserData }: UserState = useSelector(
    (state: any) => state.user
  );
  return (
    <div className="flex items-center justify-center h-screen">
      <Card>
        <div className="m-10">
          <h1 className="text-2xl font-bold text-red-600 text-center">
            Your account has been banned by an Admin.
          </h1>
          <p className="mt-4 text-gray-700">
            Reason: {currentUserData?.banReason}
          </p>
        </div>
      </Card>
    </div>
  );
}
