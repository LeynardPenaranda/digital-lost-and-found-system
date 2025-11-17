"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { message, Spin } from "antd";
import { LostItemReportType } from "@/interfaces";
import { getAllLostItems } from "@/server-actions/lost-items-report";
import LostItemCard from "./lost-item-card";

const LostItemsContent = () => {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("q") || "";

  const [lostItems, setLostItems] = useState<LostItemReportType[]>([]);
  const [loading, setLoading] = useState(false);

  // NEW: state for switching tabs
  const [statusFilter, setStatusFilter] = useState<"pending" | "found">(
    "pending"
  );

  const fetchLostItems = async () => {
    try {
      setLoading(true);

      const response = await getAllLostItems(searchQuery, statusFilter);

      if ("error" in response) throw new Error(response.error);

      setLostItems(response);
    } catch (error: any) {
      message.error("Failed to get the lost items report");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLostItems();
  }, [searchQuery, statusFilter]); // Re-fetch when search or tab changes

  return (
    <div className="grid grid-cols-1 grid-rows-[auto_1fr] h-[50rem] w-full ">
      {/* FILTER TABS */}
      <div className="flex items-center justify-center ">
        <div className="flex gap-3">
          <div
            className={`cursor-pointer ${
              statusFilter === "pending" ? "border-b-4 border-blue-950" : ""
            }`}
            onClick={() => setStatusFilter("pending")}
          >
            Report Pending
          </div>

          <div
            className={`cursor-pointer ${
              statusFilter === "found" ? "border-b-4 border-blue-950" : ""
            }`}
            onClick={() => setStatusFilter("found")}
          >
            Report Found
          </div>
        </div>
      </div>

      {/* CONTENT SECTION */}
      <div className="w-full  mt-20">
        {loading && <Spin size="large" className="my-10 flex justify-center" />}
        {lostItems.length === 0 && !loading && (
          <span className="text-[2rem] text-gray-400 font-semibold my-10 flex justify-center">
            No {statusFilter} lost items...
          </span>
        )}
        {!loading && (
          <div className="flex gap-10 flex-wrap justify-center">
            {lostItems.map((items) => (
              <LostItemCard key={items._id} items={items} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LostItemsContent;
