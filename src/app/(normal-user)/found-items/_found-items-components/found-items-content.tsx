"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { message, Spin } from "antd";
import { FoundItemReportType } from "@/interfaces";
import socket from "@/config/socket-config";
import { getAllFoundItems } from "@/server-actions/found-items-report";
import FoundItemCard from "./found-item-card";

const FoundItemsContent = () => {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("q") || "";

  const [foundItems, setFoundItems] = useState<FoundItemReportType[]>([]);
  const [loading, setLoading] = useState(false);

  // NEW: state for switching tabs
  const [statusFilter, setStatusFilter] = useState<"pending" | "claimed">(
    "pending"
  );

  const fetchFoundItems = async () => {
    try {
      setLoading(true);

      const response = await getAllFoundItems(searchQuery, statusFilter);

      if ("error" in response) throw new Error(response.error);
      console.log(response);
      setFoundItems(response);
    } catch (error: any) {
      message.error("Failed to get the found items report");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFoundItems();
  }, [searchQuery, statusFilter]); // Re-fetch when search or tab changes

  useEffect(() => {
    socket.on("found-item-created", (newReport: FoundItemReportType) => {
      // Only add report if it matches current tab (pending/found)
      if (newReport.foundItemStatus === statusFilter) {
        setFoundItems((prev) => [newReport, ...prev]);
      }
    });

    return () => {
      socket.off("found-item-created");
    };
  }, [statusFilter]);

  return (
    <div className="grid grid-cols-1 grid-rows-[auto_1fr] h-[50rem] w-full ">
      {/* FILTER TABS */}
      <div className="flex items-center justify-center mt-10">
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
              statusFilter === "claimed" ? "border-b-4 border-blue-950" : ""
            }`}
            onClick={() => setStatusFilter("claimed")}
          >
            Report Claimed
          </div>
        </div>
      </div>

      {/* CONTENT SECTION */}
      <div className="w-full h-[40rem] overflow-y-auto mt-5">
        {loading && <Spin size="large" className="my-10 flex justify-center" />}
        {foundItems.length === 0 && !loading && (
          <span className="text-[2rem] text-gray-400 font-semibold my-10 flex justify-center">
            No {statusFilter} found items...
          </span>
        )}
        {!loading && (
          <div className="flex gap-10 flex-wrap justify-center">
            {foundItems.map((items) => (
              <FoundItemCard key={items._id} items={items} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FoundItemsContent;
