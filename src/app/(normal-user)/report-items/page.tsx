"use client";

import { useState } from "react";
import FoundItemTable from "./_report-items-component/found-items-table";
import LostItemTableWrapper from "./_report-items-component/lost-items-table-wrapper";
import { useSelector } from "react-redux";
import { UserState } from "@/redux/userSlice";
import FoundItemWrapper from "./_report-items-component/found-items-table-wrapper";

const ReportItems = () => {
  const [isLostItems, setIsLostItems] = useState(true);
  const { currentUserData }: UserState = useSelector(
    (state: any) => state.user
  );
  return (
    <div className="grid grid-rows-[auto_1fr] h-full w-full">
      {/* Top Buttons */}
      <div className="flex gap-4 justify-center items-center p-4">
        <span
          onClick={() => setIsLostItems(true)}
          className={`px-4 py-2 text-center transition font-medium cursor-pointer
            ${
              isLostItems
                ? "border-b-2 border-blue-950 text-black"
                : " hover:bg-gray-300"
            }
          `}
        >
          Lost Items Table
        </span>

        <span
          onClick={() => setIsLostItems(false)}
          className={`px-4 py-2 text-center transition font-medium cursor-pointer
            ${
              !isLostItems
                ? "border-b-2 border-blue-950 text-black"
                : " hover:bg-gray-300"
            }
          `}
        >
          Found Items Table
        </span>
      </div>

      {/* Dynamic Table */}
      <div className=" flex items-center justify-center">
        {isLostItems ? (
          <div className="w-[90%] lg:w-[60%]">
            <LostItemTableWrapper userId={currentUserData?._id!} />
          </div>
        ) : (
          <div className="w-[90%] lg:w-[60%]">
            <FoundItemWrapper userId={currentUserData?._id!} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportItems;
