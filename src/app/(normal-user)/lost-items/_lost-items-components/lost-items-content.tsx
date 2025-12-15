"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { message, Spin } from "antd";
import { LostItemReportType } from "@/interfaces";
import { getAllLostItems } from "@/server-actions/lost-items-report";
import LostItemCard from "./lost-item-card";
import socket from "@/config/socket-config";

const LostItemsContent = () => {
  const rawSearchParams = useSearchParams();

  // Memoize search query so it won't trigger fetch endlessly
  const searchQuery = useMemo(() => {
    return rawSearchParams.get("q") || "";
  }, [rawSearchParams]);

  const [lostItems, setLostItems] = useState<LostItemReportType[]>([]);
  const [loading, setLoading] = useState(false);

  // Tab state: "pending" or "found"
  const [statusFilter, setStatusFilter] = useState<"pending" | "found">(
    "pending"
  );

  const fetchLostItems = async () => {
    try {
      setLoading(true);

      const response = await getAllLostItems(searchQuery, statusFilter);

      if (!response.success) throw new Error(response.message || "Failed");

      const dataArray = Array.isArray(response.data) ? response.data : [];

      // Filter out items where the reporter was deleted
      const transformed = dataArray
        .filter((item) => item.reportedBy)
        .map((item: LostItemReportType) => {
          const fullName = item.reportedBy?.name || "Unknown";
          const isAdmin = item.reportedBy?.role === "admin";
          const firstName = fullName.split(" ")[0];

          return {
            ...item,
            reportedBy: {
              ...item.reportedBy,
              displayName: isAdmin ? `${firstName} - Admin` : fullName,
            },
          };
        });

      setLostItems(transformed);
    } catch (error: unknown) {
      if (error instanceof Error) {
        message.error(error.message);
      } else {
        message.error("Failed to get the lost items report");
      }
    } finally {
      setLoading(false);
    }
  };

  // Re-fetch when search query OR tab changes
 useEffect(() => {
  fetchLostItems();
}, [searchQuery, statusFilter]);



  // Socket listener (stable + cleaned properly)
  useEffect(() => {
    const handleNewReport = (newReport: LostItemReportType) => {
      if (newReport.lostItemStatus === statusFilter && newReport.reportedBy) {
        setLostItems((prev) => [newReport, ...prev]);
      }
    };

    socket.on("lost-item-created", handleNewReport);

    return () => {
      socket.off("lost-item-created", handleNewReport);
    };
  }, [statusFilter]);

  return (
    <div className="grid grid-cols-1 grid-rows-[auto_1fr] h-[50rem] w-full">
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
              statusFilter === "found" ? "border-b-4 border-blue-950" : ""
            }`}
            onClick={() => setStatusFilter("found")}
          >
            Report Found
          </div>
        </div>
      </div>

      {/* CONTENT SECTION */}
      <div className="w-full h-[40rem] overflow-y-auto mt-5">
        {loading && <Spin size="large" className="my-10 flex justify-center" />}

        {!loading && lostItems.length === 0 && (
          <span className="text-[2rem] text-gray-400 font-semibold my-10 flex justify-center">
            No {statusFilter} lost items...
          </span>
        )}

        {!loading && lostItems.length > 0 && (
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
